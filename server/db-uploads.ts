import { eq, desc, and } from "drizzle-orm";
import { uploads, gallery, moderationQueue, InsertUpload, InsertGallery, InsertModerationQueue, Upload, Gallery } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Criar um novo upload (em status pending)
 */
export async function createUpload(data: InsertUpload): Promise<Upload | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create upload: database not available");
    return null;
  }

  try {
    const result = await db.insert(uploads).values(data);
    const uploadId = result[0].insertId;
    
    // Buscar o upload criado
    const created = await db.select().from(uploads).where(eq(uploads.id, Number(uploadId))).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create upload:", error);
    throw error;
  }
}

/**
 * Obter upload por ID
 */
export async function getUploadById(id: number): Promise<Upload | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get upload: database not available");
    return null;
  }

  const result = await db.select().from(uploads).where(eq(uploads.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Listar uploads do usuário
 */
export async function getUserUploads(userId: number): Promise<Upload[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list uploads: database not available");
    return [];
  }

  return await db
    .select()
    .from(uploads)
    .where(eq(uploads.userId, userId))
    .orderBy(desc(uploads.createdAt));
}

/**
 * Listar uploads pendentes de moderação
 */
export async function getPendingUploads(): Promise<Upload[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list pending uploads: database not available");
    return [];
  }

  return await db
    .select()
    .from(uploads)
    .where(eq(uploads.status, "pending"))
    .orderBy(desc(uploads.createdAt));
}

/**
 * Atualizar status do upload
 */
export async function updateUploadStatus(
  uploadId: number,
  status: "pending" | "approved" | "rejected",
  moderationNotes?: string
): Promise<Upload | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update upload: database not available");
    return null;
  }

  try {
    const updateData: Record<string, any> = { status, updatedAt: new Date() };
    if (moderationNotes) {
      updateData.moderationNotes = moderationNotes;
    }

    await db.update(uploads).set(updateData).where(eq(uploads.id, uploadId));
    return await getUploadById(uploadId);
  } catch (error) {
    console.error("[Database] Failed to update upload:", error);
    throw error;
  }
}

/**
 * Adicionar trabalho à galeria (quando aprovado)
 */
export async function addToGallery(data: InsertGallery): Promise<Gallery | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add to gallery: database not available");
    return null;
  }

  try {
    const result = await db.insert(gallery).values(data);
    const galleryId = result[0].insertId;
    
    const created = await db.select().from(gallery).where(eq(gallery.id, Number(galleryId))).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to add to gallery:", error);
    throw error;
  }
}

/**
 * Listar galeria pública (apenas aprovados)
 */
export async function getPublicGallery(limit = 20, offset = 0): Promise<Gallery[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list gallery: database not available");
    return [];
  }

  return await db
    .select()
    .from(gallery)
    .orderBy(desc(gallery.createdAt))
    .limit(limit)
    .offset(offset);
}

/**
 * Filtrar galeria por tipo
 */
export async function getGalleryByType(
  type: "imagem" | "video" | "avatar",
  limit = 20,
  offset = 0
): Promise<Gallery[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list gallery: database not available");
    return [];
  }

  return await db
    .select()
    .from(gallery)
    .where(eq(gallery.type, type))
    .orderBy(desc(gallery.createdAt))
    .limit(limit)
    .offset(offset);
}

/**
 * Incrementar visualizações
 */
export async function incrementGalleryViews(galleryId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot increment views: database not available");
    return;
  }

  try {
    const current = await db.select().from(gallery).where(eq(gallery.id, galleryId)).limit(1);
    if (current.length > 0) {
      const newViews = (current[0].views || 0) + 1;
      await db.update(gallery).set({ views: newViews }).where(eq(gallery.id, galleryId));
    }
  } catch (error) {
    console.error("[Database] Failed to increment views:", error);
  }
}

/**
 * Adicionar à fila de moderação
 */
export async function addToModerationQueue(data: InsertModerationQueue): Promise<any> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add to moderation queue: database not available");
    return null;
  }

  try {
    const result = await db.insert(moderationQueue).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to add to moderation queue:", error);
    throw error;
  }
}

/**
 * Listar fila de moderação
 */
export async function getModerationQueue(status?: string): Promise<any[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list moderation queue: database not available");
    return [];
  }

  if (status) {
    return await db
      .select()
      .from(moderationQueue)
      .where(eq(moderationQueue.status, status as any))
      .orderBy(desc(moderationQueue.createdAt));
  }

  return await db
    .select()
    .from(moderationQueue)
    .orderBy(desc(moderationQueue.createdAt));
}
