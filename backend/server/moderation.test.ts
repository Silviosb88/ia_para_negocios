import { describe, it, expect, vi, beforeEach } from "vitest";
import { uploadsRouter } from "./routers-uploads";
import * as dbUploads from "./db-uploads";

vi.mock("./db-uploads");

describe("Moderation Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("moderationQueue", () => {
    it("should return empty queue when no uploads pending", async () => {
      vi.mocked(dbUploads.getModerationQueue).mockResolvedValue([]);

      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "admin" },
        req: {} as any,
        res: {} as any,
      } as any);

      const result = await caller.moderationQueue({});

      expect(result).toEqual([]);
      expect(dbUploads.getModerationQueue).toHaveBeenCalled();
    });

    it("should return pending uploads with correct fields", async () => {
      const mockQueue = [
        {
          id: 1,
          uploadId: 1,
          userId: 1,
          title: "Test Upload 1",
          description: "Description 1",
          type: "imagem" as const,
          fileUrl: "https://example.com/image1.jpg",
          aiTools: '["DALL-E"]',
          inspirationSource: "Test",
          status: "pending" as const,
          moderationNotes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          uploadId: 2,
          userId: 2,
          title: "Test Upload 2",
          description: "Description 2",
          type: "video" as const,
          fileUrl: "https://example.com/video.mp4",
          aiTools: '["Runway"]',
          inspirationSource: "Test 2",
          status: "pending" as const,
          moderationNotes: null,
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

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Test Upload 1");
      expect(result[1].type).toBe("video");
    });

    it("should reject non-admin users", async () => {
      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      await expect(caller.moderationQueue({})).rejects.toThrow(
        "Apenas administradores podem acessar a fila de moderação"
      );
    });
  });

  describe("approve", () => {
    it("should approve upload and move to gallery", async () => {
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
        status: "approved" as const,
        moderationNotes: "Approved by admin",
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

      const result = await caller.approve({
        uploadId: 1,
        notes: "Approved by admin",
      });

      expect(result.success).toBe(true);
      expect(dbUploads.updateUploadStatus).toHaveBeenCalledWith(1, "approved", "Approved by admin");
      expect(dbUploads.addToGallery).toHaveBeenCalled();
    });

    it("should reject non-admin users", async () => {
      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      await expect(caller.approve({ uploadId: 1 })).rejects.toThrow(
        "Apenas administradores podem aprovar uploads"
      );
    });

    it("should handle non-existent upload", async () => {
      vi.mocked(dbUploads.getUploadById).mockResolvedValue(null);

      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "admin" },
        req: {} as any,
        res: {} as any,
      } as any);

      await expect(caller.approve({ uploadId: 999 })).rejects.toThrow("Upload não encontrado");
    });
  });

  describe("reject", () => {
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
        moderationNotes: "Conteúdo inadequado",
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
        reason: "Conteúdo inadequado",
      });

      expect(result.success).toBe(true);
      expect(dbUploads.updateUploadStatus).toHaveBeenCalledWith(
        1,
        "rejected",
        "Conteúdo inadequado"
      );
    });

    it("should reject non-admin users", async () => {
      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      await expect(
        caller.reject({ uploadId: 1, reason: "Test" })
      ).rejects.toThrow("Apenas administradores podem rejeitar uploads");
    });

    it("should pass empty reason as provided", async () => {
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
        moderationNotes: "",
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
        reason: "",
      });

      expect(result.success).toBe(true);
      expect(dbUploads.updateUploadStatus).toHaveBeenCalledWith(
        1,
        "rejected",
        ""
      );
    });
  });

  describe("Filtering and Searching", () => {
    it("should filter by status correctly", async () => {
      const mockQueue = [
        {
          id: 1,
          uploadId: 1,
          userId: 1,
          title: "Pending Upload",
          description: "Description",
          type: "imagem" as const,
          fileUrl: "https://example.com/image.jpg",
          aiTools: '["DALL-E"]',
          inspirationSource: "Test",
          status: "pending" as const,
          moderationNotes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          uploadId: 2,
          userId: 2,
          title: "Approved Upload",
          description: "Description",
          type: "video" as const,
          fileUrl: "https://example.com/video.mp4",
          aiTools: '["Runway"]',
          inspirationSource: "Test",
          status: "approved" as const,
          moderationNotes: "Approved",
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

      // Client-side filtering would happen here
      const pendingOnly = result.filter((u) => u.status === "pending");
      expect(pendingOnly).toHaveLength(1);
      expect(pendingOnly[0].title).toBe("Pending Upload");
    });
  });
});
