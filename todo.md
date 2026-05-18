# i2e Webfuel - Project TODO

## Phase 1: Foundation & Authentication
- [x] Landing Page (Hero, How It Works, Features, Testimonials, FAQ, Footer)
- [x] User Authentication UI (Sign Up, Login, Google OAuth)
- [x] Email Verification Flow UI
- [x] Password Reset Flow UI
- [x] Global Navigation & Layout
- [x] Brand colors applied (Black, Orange #FF3800, Silver)
- [x] Database schema created

## Phase 2: User Dashboard & Builder
- [x] User Dashboard (Overview, AVO Score Widget, Quick Links, Notifications)
- [x] Multi-step Website Builder Form (7 steps with progress bar)
- [x] Form Data Persistence (tRPC procedures implemented and UI integrated)
- [x] Image Upload Handling (File upload with preview, validation, and URL support)

## Phase 3: AI Generation & Pricing
- [x] Pricing Page (Starter & Growth tiers)
- [x] AI Generation Screen (Loading states, Preview, tRPC integrated)
- [x] Gemini 2.5 Flash Integration
- [x] AVO Lite Implementation (robots.txt, llms.txt, schema markup, meta tags)
- [x] Payment Integration UI (Paystack/PayFast)

## Phase 4: Domain & Admin
- [x] Domain Settings Page (Subdomain & Custom Domain)
- [x] Admin Panel (User Management, Website List, Analytics)
- [x] Support/Contact Page
- [x] POPIA Compliance Pages (Privacy Policy, T&Cs, Cookie Banner)

## Phase 5: Polish & Deployment
- [x] Mobile Responsiveness (all pages built with mobile-first design)
- [x] South African English Localization (ZAR currency, SA provinces, SA payment methods)
- [x] Integrate tRPC procedures with UI components (WebsiteBuilder, Dashboard, AIGeneration wired)
- [x] Final Testing & QA (27 tests passing, all procedures verified)
- [x] Performance Optimization (build optimized, all assets cached)
- [x] Gemini 2.5 Flash API integration
- [x] Payment gateway integration (Paystack/PayFast)

## Bug Fixes
- [x] Fix email validation error on WebsiteBuilder form (make email optional)
- [x] Fix businessName validation (allow empty on initial save)
- [x] Improve form validation error handling and display

## User Requested Changes (Completed)
- [x] Change branding from i2e Webfuel to WebfuelAI
- [x] Add AVO Logo (40x40px) next to "Fuel Your AI Visibility"
- [x] Update hero caption to ChatGPT/Perplexity/Google AI Overview messaging
- [x] Update "How it works" step 2 to mention AVO Lite strategy
- [x] Update "Why Choose" section with AVO Lite and South African focus
- [x] Implement 2-choice color selection in builder (Primary: Black/White/Light Grey + Secondary: Red/Blue/Green/Custom)
- [x] Add logo upload from PC
- [x] Add product photos tab (max 10) with PC upload
- [x] Add business photos tab (max 3) with PC upload
- [x] Remove Download and Share buttons from AI Generation screen
- [x] Redesign Domain Settings with 2 options (provider domain search + client domain)
- [x] Add mock domain search functionality
- [x] Remove email, phone, WhatsApp tabs from Support page
- [x] All 18 tests passing


## Testing Bugs Found
- [x] Fix formData update query - using wrong primary key (id vs websiteId)
- [x] Fix formData creation - websiteId 150001 doesn't have formData record (update query failing)

- [x] CRITICAL: Services tabs verified present in Step 2 (Key Services with 3 input fields)
- [x] CRITICAL: formData update fixed - base64 data stripped from submit payload
- [x] Verify formData.submit works end-to-end with real S3 uploads (no base64)
- [x] Add vitest test for formData.submit with proper data
- [x] Fix Key Services tabs display in Step 2 (now showing as tabbed interface)

## Phase 5 (Continued): AI Generation Implementation
- [x] Implement Gemini 2.5 Flash integration in aiGeneration.generate procedure
- [x] Generate website HTML/CSS from form data using LLM
- [x] Implement AVO Lite features (robots.txt, llms.txt, LocalBusiness schema)
- [x] Wire AIGeneration page to real backend with streaming progress
- [x] Implement Paystack/PayFast payment UI and backend integration
- [x] Add vitest tests for AI generation procedure
- [x] Test end-to-end generation flow

## Phase 6: Website Preview & Edit Features
- [x] Render actual generated HTML/CSS in AIGeneration page preview
- [x] Implement edit mode with text/color editing capabilities
- [x] Track edit count (max 5 edits allowed)
- [x] Add regeneration button for new generation
- [x] Persist edited website content to database (using generatedContent JSON field)
- [x] Add saveEdit tRPC procedure with edit limit enforcement
- [x] Fix database error - edits now stored in JSON field
- [x] Test full preview and edit flow - all tests passing

## Phase 7: Authentication & Bug Fixes
- [x] Fix authentication redirect on Dashboard (redirectOnUnauthenticated enabled)
- [x] Fix "Build My Website" button redirecting to login
- [x] Fix OAuth login loop - upsertUser now includes lastSignedIn in update set


## Phase 8: Fix AI Generation JSON Parsing Error
- [x] Remove strict JSON schema to avoid LLM escaping issues
- [x] Update prompt to request valid JSON without schema constraints
- [x] Improved error handling with fallback JSON extraction
- [x] Build successful, all 27 tests passing

## Phase 9: Fix Landing Page Redirect
- [x] Remove auto-redirect from Landing page for logged-in users
- [x] Landing page now accessible to all users (logged in or not)
