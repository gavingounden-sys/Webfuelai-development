import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { 
  getUserWebsites, 
  getUserPayments, 
  getUserSupportTickets, 
  getUserNotifications,
  getWebsiteById,
  getFormDataByWebsiteId,
  markNotificationAsRead,
  createWebsite,
  createFormData,
  updateFormData,
  createPayment,
  createSupportTicket,
  updateSupportTicket,
  updateWebsiteGeneratedContent,
  saveWebsiteEdit,
} from "./db";
import { storagePut } from "./storage";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

// Helper function to build the generation prompt
function buildGenerationPrompt(formData: any): string {
  const services = Array.isArray(formData.services) ? formData.services.join(", ") : "";
  const colors = formData.colorPreference ? formData.colorPreference.split("|") : ["Black", "#FF3800"];
  const socialLinks = formData.socialMedia ? Object.entries(formData.socialMedia).map(([platform, url]) => `${platform}: ${url}`).join("\n") : "";

  return `
Generate a professional, AI-optimized website for a South African ${formData.industry || "business"} called "${formData.businessName || "Business"}".

Business Information:
- Business Name: ${formData.businessName || "Not provided"}
- Tagline: ${formData.tagline || "Not provided"}
- Industry: ${formData.industry || "Not provided"}
- Location: ${formData.city || ""}, ${formData.province || ""}
- Description: ${formData.description || "Not provided"}
- Target Customers: ${formData.targetCustomers || "Not provided"}
- Services/Products: ${services || "Not specified"}
- Brand Vibe: ${formData.brandVibe || "Professional"}
- Contact: ${formData.phone || ""} | ${formData.email || ""}
- Address: ${formData.address || "Not provided"}
${socialLinks ? `- Social Media:\n${socialLinks}` : ""}

Design Requirements:
- Primary Color: ${colors[0] || "Black"}
- Secondary Color: ${colors[1] || "#FF3800"}
- Style: ${formData.brandVibe || "Professional"}

Generate:
1. Complete, production-ready HTML with embedded CSS
2. Responsive design (mobile-first)
3. SEO-optimized with proper semantic HTML
4. AI-friendly structure with clear headings and content hierarchy
5. Include a hero section, services/products section, testimonials placeholder, CTA buttons
6. Use the specified colors throughout
7. Include business contact information
8. Add LocalBusiness schema markup
9. Generate robots.txt content optimized for AI crawlers
10. Generate llms.txt content for AI search engines
11. Calculate an AVO (AI Visibility Optimization) score based on the quality of AI-optimization

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "html": "...",
  "title": "...",
  "description": "...",
  "avoScore": 85,
  "avoLiteFeatures": {
    "robotsTxt": "...",
    "llmsTxt": "...",
    "schemaMarkup": "..."
  }
}

IMPORTANT: Ensure all quotes and special characters in the HTML are properly escaped for JSON.
`;
}

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Website procedures
  websites: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserWebsites(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ websiteId: z.number() }))
      .query(async ({ input, ctx }) => {
        const website = await getWebsiteById(input.websiteId);
        if (!website || website.userId !== ctx.user.id) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return website;
      }),
    
    create: protectedProcedure
      .input(z.object({
        businessName: z.string().min(1, "Business name is required"),
        industry: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const website = await createWebsite({
          userId: ctx.user.id,
          businessName: input.businessName,
          industry: input.industry,
          status: "draft",
          avoScore: 0,
          subdomain: input.businessName.toLowerCase().replace(/\s+/g, "-"),
        });
        
        // Create empty formData record for this website
        await createFormData({
          websiteId: website.id,
        });
        
        return { success: true, websiteId: website.id };
      }),
  }),

  // File upload procedure
  upload: router({
    image: protectedProcedure
      .input(z.object({
        base64: z.string(),
        filename: z.string(),
        contentType: z.string().default("image/png"),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Decode base64 to buffer
          const base64Data = input.base64.replace(/^data:[^;]+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
          
          // Upload to S3
          const fileKey = `uploads/${ctx.user.id}/${nanoid()}-${input.filename}`;
          const { url } = await storagePut(fileKey, buffer, input.contentType);
          
          return { success: true, url };
        } catch (error) {
          console.error("[Upload] Failed:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to upload file" });
        }
      }),
  }),

  // Form data procedures
  formData: router({
    get: protectedProcedure
      .input(z.object({ websiteId: z.number() }))
      .query(async ({ input, ctx }) => {
        const website = await getWebsiteById(input.websiteId);
        if (!website || website.userId !== ctx.user.id) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return getFormDataByWebsiteId(input.websiteId);
      }),

    submit: protectedProcedure
      .input(z.object({
        websiteId: z.number(),
        businessName: z.string().optional(),
        tagline: z.string().optional(),
        industry: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        description: z.string().optional(),
        targetCustomers: z.string().optional(),
        services: z.array(z.string()).optional(),
        brandVibe: z.string().optional(),
        colorPreference: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        address: z.string().optional(),
        socialMedia: z.record(z.string(), z.string()).optional(),
        logoUrl: z.string().optional(),
        photoUrls: z.array(z.string()).optional(),
        productImageUrls: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Verify website ownership
        const website = await getWebsiteById(input.websiteId);
        if (!website || website.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        try {
          // Always use updateFormData which handles both create and update
          await updateFormData(input.websiteId, {
            businessName: input.businessName,
            tagline: input.tagline,
            industry: input.industry,
            city: input.city,
            province: input.province,
            description: input.description,
            targetCustomers: input.targetCustomers,
            services: input.services,
            brandVibe: input.brandVibe,
            colorPreference: input.colorPreference,
            phone: input.phone,
            email: input.email,
            address: input.address,
            socialMedia: input.socialMedia,
            logoUrl: input.logoUrl,
            photoUrls: input.photoUrls,
            productImageUrls: input.productImageUrls,
          });

          return { success: true };
        } catch (error) {
          console.error("[formData.submit] Error:", error);
          throw new TRPCError({ 
            code: "INTERNAL_SERVER_ERROR", 
            message: "Failed to save form data. Please try again." 
          });
        }
      }),
  }),

  // Payment procedures
  payments: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserPayments(ctx.user.id);
    }),
    
    initiatePayment: protectedProcedure
      .input(z.object({
        websiteId: z.number(),
        amount: z.number().positive("Amount must be positive"),
        gateway: z.enum(["paystack", "payfast"]),
      }))
      .mutation(async ({ input, ctx }) => {
        // Verify website ownership
        const website = await getWebsiteById(input.websiteId);
        if (!website || website.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        // Create payment record
        const payment = await createPayment({
          userId: ctx.user.id,
          websiteId: input.websiteId,
          amount: input.amount.toString(),
          currency: "ZAR",
          gateway: input.gateway,
          status: "pending" as const,
          transactionId: `TXN-${Date.now()}`,
          invoiceNumber: `INV-${ctx.user.id}-${Date.now()}`,
        })

        // Generate redirect URL based on gateway
        let redirectUrl = "";
        if (input.gateway === "paystack") {
          // Paystack integration
          redirectUrl = `https://checkout.paystack.com/pay/${process.env.PAYSTACK_PUBLIC_KEY || "pk_test_demo"}`;
        } else if (input.gateway === "payfast") {
          // PayFast integration
          redirectUrl = `https://www.payfast.co.za/eng/process`;
        }

        return { success: true, redirectUrl, paymentId: payment.id.toString() };
      }),

    confirmPayment: protectedProcedure
      .input(z.object({
        paymentId: z.number(),
        transactionId: z.string(),
        status: z.enum(["success", "failed", "pending"]),
      }))
      .mutation(async ({ input, ctx }) => {
        // TODO: Implement payment confirmation with gateway verification
        return { success: true };
      }),
  }),

  // Support procedures
  support: router({
    listTickets: protectedProcedure.query(async ({ ctx }) => {
      return getUserSupportTickets(ctx.user.id);
    }),
    
    createTicket: protectedProcedure
      .input(z.object({
        subject: z.string().min(1, "Subject is required"),
        message: z.string().min(1, "Message is required"),
        priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
      }))
      .mutation(async ({ input, ctx }) => {
        const ticket = await createSupportTicket({
          userId: ctx.user.id,
          subject: input.subject,
          message: input.message,
          status: "open" as const,
          priority: input.priority as "low" | "medium" | "high",
        });
        return { success: true, ticketId: ticket.id };
      }),

    updateTicket: protectedProcedure
      .input(z.object({
        ticketId: z.number(),
        status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Verify ticket ownership
        const tickets = await getUserSupportTickets(ctx.user.id);
        const ticket = tickets.find(t => t.id === input.ticketId);
        if (!ticket) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        await updateSupportTicket(input.ticketId, {
          status: input.status,
          priority: input.priority,
        });

        return { success: true };
      }),
  }),

  // Notification procedures
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserNotifications(ctx.user.id);
    }),
    
    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number().positive() }))
      .mutation(async ({ input, ctx }) => {
        const notifications = await getUserNotifications(ctx.user.id);
        const notification = notifications.find(n => n.id === input.notificationId);
        if (!notification) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        await markNotificationAsRead(input.notificationId);
        return { success: true };
      }),
  }),

  // AI Generation procedures
  aiGeneration: router({
    generate: protectedProcedure
      .input(z.object({
        websiteId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Verify website ownership
        const website = await getWebsiteById(input.websiteId);
        if (!website || website.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        // Get form data
        const formData = await getFormDataByWebsiteId(input.websiteId);
        if (!formData) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Form data not found" });
        }

        try {
          // Build prompt for Gemini 2.5 Flash
          const prompt = buildGenerationPrompt(formData);

          // Call Gemini 2.5 Flash to generate website content
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "You are an expert web designer and copywriter specializing in AI-optimized websites for South African small businesses. Generate professional, conversion-focused website HTML with embedded CSS that is optimized for AI search engines like ChatGPT, Perplexity, and Google AI Overview."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            // Removed strict JSON schema due to LLM escaping issues with large HTML content
          });

          // Parse the response
          const content = response.choices[0].message.content;
          if (typeof content !== "string") {
            throw new Error("Invalid response format from LLM");
          }

          let generatedData;
          try {
            generatedData = JSON.parse(content);
          } catch (parseError) {
            // If JSON parsing fails, try to extract JSON from the content
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
              throw new Error(`Failed to parse LLM response as JSON: ${parseError}`);
            }
            try {
              generatedData = JSON.parse(jsonMatch[0]);
            } catch (retryError) {
              throw new Error(`Failed to parse extracted JSON: ${retryError}`);
            }
          }

          // Calculate AVO score based on generated content
          const avoScore = Math.min(100, Math.max(0, generatedData.avoScore || 85));

          // Return generated content
          return {
            success: true,
            generatedContent: {
              html: generatedData.html,
              avoScore,
              metadata: {
                title: generatedData.title,
                description: generatedData.description,
              },
              avoLiteFeatures: generatedData.avoLiteFeatures,
            },
          };
        } catch (error) {
          console.error("[aiGeneration.generate] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate website. Please try again."
          });
        }
      }),
      
      saveEdit: protectedProcedure
        .input(z.object({
          websiteId: z.number(),
          html: z.string(),
          title: z.string(),
          description: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
          const website = await getWebsiteById(input.websiteId);
          if (!website || website.userId !== ctx.user.id) {
            throw new TRPCError({ code: "FORBIDDEN" });
          }

          try {
            await saveWebsiteEdit(input.websiteId, {
              html: input.html,
              title: input.title,
              description: input.description,
            });

            const updated = await getWebsiteById(input.websiteId);
            const generatedContent = (updated?.generatedContent as any) || {};
            const editCount = generatedContent.editCount || 0;
            return {
              success: true,
              editCount,
              remainingEdits: 5 - editCount,
            };
          } catch (error: any) {
            console.error("[aiGeneration.saveEdit] Error:", error);
            if (error.message?.includes("Maximum edits")) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: error.message
              });
            }
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to save edit. Please try again."
            });
          }
        }),
  }),
});

export type AppRouter = typeof appRouter;
