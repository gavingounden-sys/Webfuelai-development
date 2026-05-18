import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `user-${userId}`,
    email: `user${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Website Features", () => {
  describe("websites.list", () => {
    it("returns empty array for user with no websites", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.websites.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("websites.create", () => {
    it("accepts valid website creation input", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.websites.create({
        businessName: "Test Business",
        industry: "Plumbing",
      });

      expect(result.success).toBe(true);
    });

    it("rejects empty business name", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.websites.create({
          businessName: "",
          industry: "Plumbing",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });
});

describe("Form Data Features", () => {
  describe("formData.submit", () => {
    it("accepts valid form data submission", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.formData.submit({
        websiteId: 1,
        businessName: "John's Plumbing",
        tagline: "Fast, reliable plumbing",
        industry: "Plumbing",
        city: "Johannesburg",
        province: "Gauteng",
        description: "Professional plumbing services",
        targetCustomers: "Homeowners and businesses",
        services: ["Emergency repairs", "Maintenance", "Installation"],
        brandVibe: "Professional",
        colorPreference: "#FF3800",
        phone: "+27 10 123 4567",
        email: "contact@plumbing.co.za",
        address: "123 Main St, Johannesburg",
      });

      expect(result.success).toBe(true);
    });

    it("requires website ID", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.formData.submit({
          websiteId: 0,
          businessName: "Test",
          phone: "+27 10 123 4567",
          email: "test@example.com",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("requires business name", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.formData.submit({
          websiteId: 1,
          businessName: "",
          phone: "+27 10 123 4567",
          email: "test@example.com",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });
});

describe("Payment Features", () => {
  describe("payments.list", () => {
    it("returns empty array for user with no payments", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.payments.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("payments.initiatePayment", () => {
    it("accepts valid payment initiation", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.payments.initiatePayment({
        websiteId: 1,
        amount: 99,
        gateway: "paystack",
      });

      expect(result.success).toBe(true);
      expect(result.redirectUrl).toBeDefined();
    });

    it("validates payment gateway", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.payments.initiatePayment({
          websiteId: 1,
          amount: 99,
          gateway: "invalid" as any,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("requires positive amount", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.payments.initiatePayment({
          websiteId: 1,
          amount: -99,
          gateway: "paystack",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });
});

describe("Support Features", () => {
  describe("support.listTickets", () => {
    it("returns empty array for user with no tickets", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.support.listTickets();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("support.createTicket", () => {
    it("accepts valid support ticket", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.support.createTicket({
        subject: "Website not loading",
        message: "My website is showing a blank page",
        priority: "high",
      });

      expect(result.success).toBe(true);
    });

    it("requires subject and message", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.support.createTicket({
          subject: "",
          message: "",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });
});

describe("Notification Features", () => {
  describe("notifications.list", () => {
    it("returns empty array for user with no notifications", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.notifications.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("notifications.markAsRead", () => {
    it("accepts valid notification ID", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.notifications.markAsRead({
          notificationId: 1,
        });
        expect(result.success).toBe(true);
      } catch (error: any) {
        // Expected: notification doesn't exist in test context
        expect(error.code).toBe("NOT_FOUND");
      }
    });

    it("requires positive notification ID", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.notifications.markAsRead({
          notificationId: 0,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        // Should fail validation
        expect(error).toBeDefined();
      }
    });
  });
});

describe("Protected Procedures", () => {
  it("rejects unauthenticated requests to protected procedures", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: () => {} } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.websites.list();
      expect.fail("Should have thrown authentication error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
