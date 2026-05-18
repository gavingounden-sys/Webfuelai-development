import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  InsertWebsite,
  InsertFormData,
  InsertPayment,
  InsertSupportTicket,
  users, 
  websites, 
  formData, 
  payments, 
  supportTickets, 
  notifications 
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    for (const field of textFields) {
      if (user[field] !== undefined) {
        values[field] = user[field];
        updateSet[field] = user[field];
      }
    }

    // Always update lastSignedIn to track user activity
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }

    // If updateSet is empty (new user with only openId), don't call onDuplicateKeyUpdate
    if (Object.keys(updateSet).length === 0) {
      await db.insert(users).values(values);
    } else {
      await db
        .insert(users)
        .values(values)
        .onDuplicateKeyUpdate({ set: updateSet as any });
    }
  } catch (error) {
    console.error("[upsertUser] Error:", error);
    throw error;
  }
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateUserPlan(userId: number, plan: "free" | "starter" | "growth") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({ plan }).where(eq(users.id, userId));
}

export async function updateUserRole(userId: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({ role }).where(eq(users.id, userId));
}

// Website queries and mutations
export async function getUserWebsites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(websites).where(eq(websites.userId, userId));
}

export async function getWebsiteById(websiteId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(websites).where(eq(websites.id, websiteId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createWebsite(data: InsertWebsite) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(websites).values(data);
  const insertedId = result[0].insertId;
  
  const website = await getWebsiteById(Number(insertedId));
  if (!website) throw new Error("Failed to create website");
  
  return website;
}

// Form data queries and mutations
export async function getFormDataByWebsiteId(websiteId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(formData).where(eq(formData.websiteId, websiteId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createFormData(data: InsertFormData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(formData).values(data);
  const insertedId = result[0].insertId;
  
  const form = await getFormDataByWebsiteId(data.websiteId);
  if (!form) throw new Error("Failed to create form data");
  
  return form;
}

export async function updateFormData(websiteId: number, data: Partial<InsertFormData>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Strip undefined values and ensure empty strings for text fields
  const cleanData: Record<string, unknown> = {};
  const jsonFields = ['services', 'photoUrls', 'productImageUrls', 'socialMedia'];
  
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    
    if (jsonFields.includes(key)) {
      // JSON fields: ensure proper serialization
      if (Array.isArray(value)) {
        cleanData[key] = value;
      } else if (typeof value === 'object' && value !== null) {
        cleanData[key] = value;
      } else {
        cleanData[key] = key === 'socialMedia' ? {} : [];
      }
    } else if (typeof value === 'string') {
      // Text fields: use empty string instead of null
      cleanData[key] = value;
    } else {
      cleanData[key] = value;
    }
  }
  
  try {
    // Check if formData exists
    const existing = await getFormDataByWebsiteId(websiteId);
    
    if (existing) {
      // Update existing record
      if (Object.keys(cleanData).length > 0) {
        await db.update(formData).set(cleanData as any).where(eq(formData.websiteId, websiteId));
      }
    } else {
      // Create new record if it doesn't exist
      await db.insert(formData).values({
        websiteId,
        ...cleanData,
      } as any);
    }
    
    // Return the updated record
    const updated = await getFormDataByWebsiteId(websiteId);
    if (!updated) throw new Error("Failed to update form data");
    return updated;
  } catch (error) {
    console.error("[updateFormData] Error for websiteId", websiteId, ":", error);
    console.error("[updateFormData] cleanData keys:", Object.keys(cleanData));
    // Log sizes of string fields to detect oversized data
    for (const [key, value] of Object.entries(cleanData)) {
      if (typeof value === 'string' && value.length > 1000) {
        console.error(`[updateFormData] Field '${key}' is ${value.length} chars (possibly base64 data)`);
      }
    }
    throw error;
  }
}

// Payment queries and mutations
export async function getUserPayments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(payments).where(eq(payments.userId, userId));
}

export async function createPayment(data: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(payments).values(data);
  const insertedId = result[0].insertId;
  
  const payment = await db.select().from(payments).where(eq(payments.id, Number(insertedId))).limit(1);
  if (!payment || payment.length === 0) throw new Error("Failed to create payment");
  
  return payment[0];
}

// Support ticket queries and mutations
export async function getUserSupportTickets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(supportTickets).where(eq(supportTickets.userId, userId));
}

export async function createSupportTicket(data: InsertSupportTicket) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(supportTickets).values(data);
  const insertedId = result[0].insertId;
  
  const ticket = await db.select().from(supportTickets).where(eq(supportTickets.id, Number(insertedId))).limit(1);
  if (!ticket || ticket.length === 0) throw new Error("Failed to create support ticket");
  
  return ticket[0];
}

export async function updateSupportTicket(ticketId: number, data: Partial<InsertSupportTicket>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(supportTickets).set(data).where(eq(supportTickets.id, ticketId));
}

// Notification queries and mutations
export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(notifications).where(eq(notifications.userId, userId));
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) return null;
  
  return db.update(notifications).set({ read: true }).where(eq(notifications.id, notificationId));
}

// Generated content and edits (stored in generatedContent JSON field)
export async function updateWebsiteGeneratedContent(websiteId: number, generatedContent: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(websites).set({
    generatedContent: {
      ...generatedContent,
      editCount: 0,
      editHistory: [],
    },
  }).where(eq(websites.id, websiteId));
}

export async function saveWebsiteEdit(websiteId: number, editData: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const website = await getWebsiteById(websiteId);
  if (!website) throw new Error("Website not found");
  
  // Get existing generated content
  const generatedContent = (website.generatedContent as any) || {};
  const editHistory = generatedContent.editHistory || [];
  const editCount = generatedContent.editCount || 0;
  
  // Check edit limit
  if (editCount >= 5) {
    throw new Error("Maximum edits reached (5 edits allowed)");
  }
  
  // Add new edit to history
  editHistory.push({
    timestamp: new Date().toISOString(),
    ...editData,
  });
  
  // Update generated content with new edit data
  const updatedGeneratedContent = {
    ...generatedContent,
    html: editData.html,
    metadata: {
      title: editData.title,
      description: editData.description,
    },
    editHistory,
    editCount: editCount + 1,
  };
  
  await db.update(websites).set({
    generatedContent: updatedGeneratedContent,
  }).where(eq(websites.id, websiteId));
}
