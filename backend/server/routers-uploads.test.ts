import { describe, it, expect, vi, beforeEach } from "vitest";
import { uploadsRouter } from "./routers-uploads";
import * as dbUploads from "./db-uploads";
import * as storage from "./storage";

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

      const largeBuffer = new Uint8Array(150 * 1024 * 1024);
      const largeFile = new File([largeBuffer], "test.jpg", { type: "image/jpeg" });

      await expect(
        caller.create({
          title: "Test",
          description: "Test description",
          type: "imagem",
          aiTools: ["DALL-E"],
          inspirationSource: "Test",
          file: largeFile,
        })
      ).rejects.toThrow("Arquivo muito grande");
    });

    it("should validate title is required", async () => {
      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      await expect(
        caller.create({
          title: "",
          description: "Test",
          type: "imagem",
          aiTools: ["DALL-E"],
          file: file,
        })
      ).rejects.toThrow();
    });

    it("should validate at least one AI tool is selected", async () => {
      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      await expect(
        caller.create({
          title: "Test",
          description: "Test",
          type: "imagem",
          aiTools: [],
          file: file,
        })
      ).rejects.toThrow();
    });
  });

  describe("userStats query", () => {
    it("should return user statistics", async () => {
      const mockStats = {
        total: 5,
        approved: 3,
        pending: 1,
        rejected: 1,
        totalViews: 150,
      };

      vi.mocked(dbUploads.getUserUploadStats).mockResolvedValue(mockStats);

      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      const result = await caller.userStats();

      expect(result).toEqual(mockStats);
      expect(result.total).toBe(5);
      expect(result.approved).toBe(3);
    });
  });

  describe("userHistory query", () => {
    it("should return user upload history", async () => {
      const mockHistory = [
        {
          id: 1,
          userId: 1,
          title: "Test Upload",
          description: "Test",
          type: "imagem" as const,
          fileKey: "uploads/1/test.jpg",
          fileUrl: "https://example.com/test.jpg",
          mimeType: "image/jpeg",
          fileSize: 1024,
          aiTools: '["DALL-E"]',
          inspirationSource: "Test",
          status: "approved" as const,
          moderationNotes: "Approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(dbUploads.getUserUploadHistory).mockResolvedValue(mockHistory);

      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      const result = await caller.userHistory({ limit: 20, offset: 0 });

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Test Upload");
    });
  });

  describe("userApproved query", () => {
    it("should return approved uploads", async () => {
      const mockApproved = [
        {
          id: 1,
          uploadId: 1,
          userId: 1,
          title: "Approved Upload",
          description: "Test",
          type: "imagem" as const,
          fileUrl: "https://example.com/test.jpg",
          aiTools: '["DALL-E"]',
          inspirationSource: "Test",
          views: 50,
          featured: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(dbUploads.getUserApprovedUploads).mockResolvedValue(mockApproved);

      const caller = uploadsRouter.createCaller({
        user: { id: 1, role: "user" },
        req: {} as any,
        res: {} as any,
      } as any);

      const result = await caller.userApproved();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Approved Upload");
      expect(result[0].views).toBe(50);
    });
  });
});
