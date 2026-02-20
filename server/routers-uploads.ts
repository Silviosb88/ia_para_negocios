import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  createUpload,
  getUploadById,
  getUserUploads,
  getPendingUploads,
  updateUploadStatus,
  addToGallery,
  getPublicGallery,
  getGalleryByType,
  incrementGalleryViews,
  addToModerationQueue,
  getModerationQueue,
} from "./db-uploads";
import { storagePut } from "./storage";

const uploadTypeEnum = z.enum(["imagem", "video", "avatar"]);
const statusEnum = z.enum(["pending", "approved", "rejected"]);

export const uploadsRouter = router({
  /**
   * Criar novo upload (requer autenticação)
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        type: uploadTypeEnum,
        aiTools: z.array(z.string()).optional(),
        inspirationSource: z.string().optional(),
        fileData: z.string(), // base64 encoded file
        fileName: z.string(),
        mimeType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Validar tamanho do arquivo (máximo 100MB)
        const fileSizeBytes = Math.ceil((input.fileData.length * 3) / 4);
        const maxSizeBytes = 100 * 1024 * 1024;
        if (fileSizeBytes > maxSizeBytes) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Arquivo muito grande (máximo 100MB)",
          });
        }

        // Fazer upload para S3
        const fileKey = `uploads/${ctx.user.id}/${Date.now()}-${input.fileName}`;
        const buffer = Buffer.from(input.fileData, "base64");
        const { url: fileUrl } = await storagePut(fileKey, buffer, input.mimeType);

        // Criar registro no banco de dados
        const upload = await createUpload({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          type: input.type,
          fileKey,
          fileUrl,
          mimeType: input.mimeType,
          fileSize: fileSizeBytes,
          aiTools: input.aiTools ? JSON.stringify(input.aiTools) : null,
          inspirationSource: input.inspirationSource,
          status: "pending",
        });

        if (!upload) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao criar upload",
          });
        }

        // Adicionar à fila de moderação
        await addToModerationQueue({
          uploadId: upload.id,
          userId: ctx.user.id,
          title: input.title,
          type: input.type,
          fileUrl,
          status: "pending",
        });

        return {
          success: true,
          uploadId: upload.id,
          message: "Upload enviado com sucesso! Aguardando moderação.",
        };
      } catch (error) {
        console.error("[Upload] Error creating upload:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao fazer upload",
        });
      }
    }),

  /**
   * Obter uploads do usuário
   */
  myUploads: protectedProcedure.query(async ({ ctx }) => {
    try {
      const uploads = await getUserUploads(ctx.user.id);
      return uploads.map((upload) => ({
        ...upload,
        aiTools: upload.aiTools ? JSON.parse(upload.aiTools) : [],
      }));
    } catch (error) {
      console.error("[Upload] Error getting user uploads:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar uploads",
      });
    }
  }),

  /**
   * Obter upload por ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const upload = await getUploadById(input.id);
        if (!upload) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Upload não encontrado",
          });
        }
        return {
          ...upload,
          aiTools: upload.aiTools ? JSON.parse(upload.aiTools) : [],
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar upload",
        });
      }
    }),

  /**
   * Galeria pública - listar trabalhos aprovados
   */
  gallery: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const items = await getPublicGallery(input.limit, input.offset);
        return items.map((item) => ({
          ...item,
          aiTools: item.aiTools ? JSON.parse(item.aiTools) : [],
        }));
      } catch (error) {
        console.error("[Gallery] Error getting gallery:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar galeria",
        });
      }
    }),

  /**
   * Galeria por tipo
   */
  galleryByType: publicProcedure
    .input(
      z.object({
        type: uploadTypeEnum,
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const items = await getGalleryByType(input.type, input.limit, input.offset);
        return items.map((item) => ({
          ...item,
          aiTools: item.aiTools ? JSON.parse(item.aiTools) : [],
        }));
      } catch (error) {
        console.error("[Gallery] Error getting gallery by type:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar galeria",
        });
      }
    }),

  /**
   * Incrementar visualizações
   */
  incrementViews: publicProcedure
    .input(z.object({ galleryId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await incrementGalleryViews(input.galleryId);
        return { success: true };
      } catch (error) {
        console.error("[Gallery] Error incrementing views:", error);
        // Não lançar erro, apenas registrar
        return { success: false };
      }
    }),

  /**
   * Listar fila de moderação (apenas admin)
   */
  moderationQueue: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "approved", "rejected"]).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      // Verificar se é admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem acessar a fila de moderação",
        });
      }

      try {
        const items = await getModerationQueue(input.status);
        return items;
      } catch (error) {
        console.error("[Moderation] Error getting queue:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar fila de moderação",
        });
      }
    }),

  /**
   * Aprovar upload (apenas admin)
   */
  approve: protectedProcedure
    .input(
      z.object({
        uploadId: z.number(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verificar se é admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem aprovar uploads",
        });
      }

      try {
        const upload = await getUploadById(input.uploadId);
        if (!upload) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Upload não encontrado",
          });
        }

        // Atualizar status
        const updated = await updateUploadStatus(
          input.uploadId,
          "approved",
          input.notes
        );

        if (!updated) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao atualizar upload",
          });
        }

        // Adicionar à galeria
        await addToGallery({
          uploadId: input.uploadId,
          userId: upload.userId,
          title: upload.title,
          description: upload.description,
          type: upload.type,
          fileUrl: upload.fileUrl,
          aiTools: upload.aiTools,
          inspirationSource: upload.inspirationSource,
        });

        return {
          success: true,
          message: "Upload aprovado e adicionado à galeria",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Moderation] Error approving upload:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao aprovar upload",
        });
      }
    }),

  /**
   * Rejeitar upload (apenas admin)
   */
  reject: protectedProcedure
    .input(
      z.object({
        uploadId: z.number(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verificar se é admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem rejeitar uploads",
        });
      }

      try {
        const updated = await updateUploadStatus(
          input.uploadId,
          "rejected",
          input.reason
        );

        if (!updated) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao atualizar upload",
          });
        }

        return {
          success: true,
          message: "Upload rejeitado",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Moderation] Error rejecting upload:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao rejeitar upload",
        });
      }
    }),
});
