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
  getUserUploadStats,
  getUserUploadHistory,
  getUserApprovedUploads,
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
        file: z.instanceof(File),
        aiTools: z.array(z.string()).min(1),
        inspirationSource: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Validar tamanho do arquivo (máximo 100MB)
        const maxSize = 100 * 1024 * 1024;
        if (input.file.size > maxSize) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Arquivo muito grande (máximo 100MB)",
          });
        }

        // Fazer upload para S3
        const buffer = await input.file.arrayBuffer();
        const fileKey = `uploads/${ctx.user.id}/${Date.now()}-${input.file.name}`;
        const { url } = await storagePut(fileKey, new Uint8Array(buffer), input.file.type);

        // Criar registro no banco de dados
        const upload = await createUpload({
          userId: ctx.user.id,
          title: input.title,
          description: input.description || "",
          type: input.type,
          fileKey,
          fileUrl: url,
          mimeType: input.file.type,
          fileSize: input.file.size,
          aiTools: JSON.stringify(input.aiTools),
          inspirationSource: input.inspirationSource || "",
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
          fileUrl: url,
          status: "pending",
        });

        return {
          success: true,
          uploadId: upload.id,
          message: "Upload enviado com sucesso! Aguardando moderação.",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Upload] Error creating upload:", error);
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
        console.error("[Upload] Error getting upload:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar upload",
        });
      }
    }),

  /**
   * Listar galeria pública com paginação
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
   * Filtrar galeria por tipo
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
        console.error("[Gallery] Error filtering gallery:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao filtrar galeria",
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

  /**
   * Obter estatísticas de upload do usuário (protegido)
   */
  userStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const stats = await getUserUploadStats(ctx.user.id);
      return stats;
    } catch (error) {
      console.error("[Profile] Error getting user stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar estatísticas",
      });
    }
  }),

  /**
   * Obter histórico de uploads do usuário (protegido)
   */
  userHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const history = await getUserUploadHistory(ctx.user.id, input.limit, input.offset);
        return history.map((item) => ({
          ...item,
          aiTools: item.aiTools ? JSON.parse(item.aiTools) : [],
        }));
      } catch (error) {
        console.error("[Profile] Error getting user history:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar histórico",
        });
      }
    }),

  /**
   * Obter uploads aprovados do usuário (protegido)
   */
  userApproved: protectedProcedure.query(async ({ ctx }) => {
    try {
      const approved = await getUserApprovedUploads(ctx.user.id);
      return approved.map((item) => ({
        ...item,
        aiTools: item.aiTools ? JSON.parse(item.aiTools) : [],
      }));
    } catch (error) {
      console.error("[Profile] Error getting approved uploads:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar uploads aprovados",
      });
    }
  }),
});
