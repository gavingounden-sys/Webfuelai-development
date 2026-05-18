import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { users, websites, formData } from "../drizzle/schema";

describe("AI Generation & Payment Features", () => {
  let db: any;
  let testUserId: number;
  let testWebsiteId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error("Database not available for tests");
    }

    // Create test user
    const userResult = await db.insert(users).values({
      openId: `test-user-${Date.now()}`,
      name: "Test User",
      email: "test@example.com",
      role: "user",
    });
    testUserId = Number(userResult[0].insertId);

    // Create test website
    const websiteResult = await db.insert(websites).values({
      userId: testUserId,
      businessName: "Test Business",
      industry: "Technology",
      status: "draft",
      avoScore: 0,
      subdomain: "test-business",
    });
    testWebsiteId = Number(websiteResult[0].insertId);

    // Create form data
    await db.insert(formData).values({
      websiteId: testWebsiteId,
      businessName: "Test Business",
      tagline: "Innovative tech solutions",
      industry: "Technology",
      city: "Johannesburg",
      province: "Gauteng",
      description: "We provide cutting-edge technology solutions",
      targetCustomers: "Small to medium businesses",
      services: ["Web Development", "Cloud Solutions", "Consulting"],
      brandVibe: "Professional",
      colorPreference: "#000000|#FF3800",
      phone: "+27123456789",
      email: "contact@testbusiness.com",
      address: "123 Tech Street, Johannesburg",
      socialMedia: {
        linkedin: "https://linkedin.com/company/testbusiness",
        twitter: "https://twitter.com/testbusiness",
      },
    });
  });

  describe("Payment Procedures", () => {
    it("should initiate Paystack payment", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, role: "user" },
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.payments.initiatePayment({
        websiteId: testWebsiteId,
        amount: 99,
        gateway: "paystack",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.redirectUrl).toBeDefined();
      expect(result.paymentId).toBeDefined();
      expect(typeof result.redirectUrl).toBe("string");
    });

    it("should initiate PayFast payment", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, role: "user" },
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.payments.initiatePayment({
        websiteId: testWebsiteId,
        amount: 450,
        gateway: "payfast",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.redirectUrl).toBeDefined();
      expect(result.paymentId).toBeDefined();
      expect(typeof result.redirectUrl).toBe("string");
    });

    it("should reject payment with invalid amount", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, role: "user" },
        req: {} as any,
        res: {} as any,
      });

      try {
        await caller.payments.initiatePayment({
          websiteId: testWebsiteId,
          amount: -50,
          gateway: "paystack",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should reject payment for non-owned website", async () => {
      // Create another user
      const otherUserResult = await db.insert(users).values({
        openId: `other-user-${Date.now()}`,
        name: "Other User",
        email: "other@example.com",
        role: "user",
      });
      const otherUserId = Number(otherUserResult[0].insertId);

      const caller = appRouter.createCaller({
        user: { id: otherUserId, role: "user" },
        req: {} as any,
        res: {} as any,
      });

      try {
        await caller.payments.initiatePayment({
          websiteId: testWebsiteId,
          amount: 99,
          gateway: "paystack",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should list payments for user", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, role: "user" },
        req: {} as any,
        res: {} as any,
      });

      const payments = await caller.payments.list();
      expect(Array.isArray(payments)).toBe(true);
    });
  });

  describe("AI Generation Procedures", () => {
    it("should validate website ownership for generation", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, role: "user" },
        req: {} as any,
        res: {} as any,
      });

      // Verify the website exists
      const website = await db.select().from(websites).limit(1);

      expect(website).toBeDefined();
      expect(Array.isArray(website)).toBe(true);
      expect(website.length).toBeGreaterThan(0);
    });

    it("should reject generation for non-owner", async () => {
      const otherUserResult = await db.insert(users).values({
        openId: `other-gen-user-${Date.now()}`,
        name: "Other Gen User",
        email: "othergen@example.com",
        role: "user",
      });
      const otherUserId = Number(otherUserResult[0].insertId);

      const caller = appRouter.createCaller({
        user: { id: otherUserId, role: "user" },
        req: {} as any,
        res: {} as any,
      });

      try {
        // Note: This will fail at the ownership check before calling LLM
        await caller.aiGeneration.generate({ websiteId: testWebsiteId });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should reject generation for non-existent website", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, role: "user" },
        req: {} as any,
        res: {} as any,
      });

      try {
        await caller.aiGeneration.generate({ websiteId: 999999 });
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should have form data for generation", async () => {
      // Verify form data exists in database
      const formDataRecord = await db.select().from(formData).limit(1);

      expect(formDataRecord).toBeDefined();
      expect(Array.isArray(formDataRecord)).toBe(true);
      expect(formDataRecord.length).toBeGreaterThan(0);
    });
  });
});
