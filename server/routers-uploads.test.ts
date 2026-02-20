import { describe, it, expect, vi, beforeEach } from "vitest";
import { uploadsRouter } from "./routers-uploads";
import * as dbUploads from "./db-uploads";
import * as storage from "./storage";
import { TRPCError } from "@trpc/server";

// Mock dependencies
vi.mock("./db-uploads");
vi.mock("./storage");

describe("uploadsRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create procedure", () => {
    it("should validate file size", async () => {
      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      // Simular arquivo muito grande (mais de 100MB)
      const largeBase64 = "a".repeat(150 * 1024 * 1024);

      await expect(
        caller.create({
          title: "Test",
          description: "Test description",
          type: "imagem",
          aiTools: ["DALL-E"],
          inspirationSource: "Test",
          fileData: largeBase64,
          fileName: "test.jpg",
          mimeType: "image/jpeg",
        })
      ).rejects.toThrow("Arquivo muito grande");
    });

    it("should validate title is required", async () => {
      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      await expect(
        caller.create({
          title: "",
          description: "Test",
          type: "imagem",
          aiTools: ["DALL-E"],
          inspirationSource: "Test",
          fileData: "base64data",
          fileName: "test.jpg",
          mimeType: "image/jpeg",
        })
      ).rejects.toThrow();
    });

    it("should validate at least one AI tool is selected", async () => {
      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      await expect(
        caller.create({
          title: "Test",
          description: "Test",
          type: "imagem",
          aiTools: [],
          inspirationSource: "Test",
          fileData: "base64data",
          fileName: "test.jpg",
          mimeType: "image/jpeg",
        })
      ).rejects.toThrow();
    });
  });

  describe("gallery procedure", () => {
    it("should return gallery items with pagination", async () => {
      const mockGalleryItems = [
        {
          id: 1,
          uploadId: 1,
          userId: 1,
          title: "Test Gallery Item",
          description: "Test",
          type: "imagem" as const,
          fileUrl: "https://example.com/image.jpg",
          aiTools: '["DALL-E"]',
          inspirationSource: "Test",
          views: 10,
          featured: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(dbUploads.getPublicGallery).mockResolvedValue(mockGalleryItems);

      const caller = uploadsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      } as any);

      const result = await caller.gallery({ limit: 20, offset: 0 });

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Test Gallery Item");
      expect(result[0].aiTools).toEqual(["DALL-E"]);
    });
  });

  describe("moderationQueue procedure", () => {
    it("should require admin role", async () => {
      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      await expect(caller.moderationQueue({})).rejects.toThrow(
        "Apenas administradores podem acessar a fila de moderação"
      );
    });

    it("should return moderation queue for admin", async () => {
      const mockQueue = [
        {
          id: 1,
          uploadId: 1,
          userId: 1,
          title: "Test Upload",
          type: "imagem",
          fileUrl: "https://example.com/image.jpg",
          status: "pending",
          githubIssueId: null,
          moderatorNotes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(dbUploads.getModerationQueue).mockResolvedValue(mockQueue);

      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "admin" },
        req: {} as any,
        res: {} as any,
      } as any);

      const result = await caller.moderationQueue({});

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("pending");
    });
  });

  describe("approve procedure", () => {
    it("should require admin role", async () => {
      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      await expect(
        caller.approve({ uploadId: 1, notes: "Approved" })
      ).rejects.toThrow("Apenas administradores podem aprovar uploads");
    });

    it("should approve upload and add to gallery", async () => {
      const mockUpload = {
        id: 1,
        userId: 1,
        title: "Test Upload",
        description: "Test",
        type: "imagem" as const,
        fileKey: "uploads/1/test.jpg",
        fileUrl: "https://example.com/image.jpg",
        mimeType: "image/jpeg",
        fileSize: 1024,
        aiTools: '["DALL-E"]',
        inspirationSource: "Test",
        status: "pending" as const,
        moderationNotes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(dbUploads.getUploadById).mockResolvedValue(mockUpload);
      vi.mocked(dbUploads.updateUploadStatus).mockResolvedValue(mockUpload);
      vi.mocked(dbUploads.addToGallery).mockResolvedValue({} as any);

      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "admin" },
        req: {} as any,
        res: {} as any,
      } as any);

      const result = await caller.approve({ uploadId: 1 });

      expect(result.success).toBe(true);
      expect(dbUploads.updateUploadStatus).toHaveBeenCalledWith(1, "approved", undefined);
      expect(dbUploads.addToGallery).toHaveBeenCalled();
    });
  });

  describe("reject procedure", () => {
    it("should require admin role", async () => {
      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      await expect(
        caller.reject({ uploadId: 1, reason: "Inappropriate content" })
      ).rejects.toThrow("Apenas administradores podem rejeitar uploads");
    });

    it("should reject upload with reason", async () => {
      const mockUpload = {
        id: 1,
        userId: 1,
        title: "Test Upload",
        description: "Test",
        type: "imagem" as const,
        fileKey: "uploads/1/test.jpg",
        fileUrl: "https://example.com/image.jpg",
        mimeType: "image/jpeg",
        fileSize: 1024,
        aiTools: '["DALL-E"]',
        inspirationSource: "Test",
        status: "rejected" as const,
        moderationNotes: "Inappropriate content",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(dbUploads.updateUploadStatus).mockResolvedValue(mockUpload);

      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "admin" },
        req: {} as any,
        res: {} as any,
      } as any);

      const result = await caller.reject({
        uploadId: 1,
        reason: "Inappropriate content",
      });

      expect(result.success).toBe(true);
      expect(dbUploads.updateUploadStatus).toHaveBeenCalledWith(
        1,
        "rejected",
        "Inappropriate content"
      );
    });
  });
});
