# i2e Webfuel - AI-Powered Website Builder

## Project Overview

i2e Webfuel is a full-stack SaaS platform designed for South African small businesses to create AI-optimized websites. The platform automatically optimizes every generated website for AI Visibility (AVO Lite), ensuring websites appear in AI search engines like ChatGPT, Perplexity, and Google AI Overview—not just traditional Google search.

## Brand Identity

- **Platform Name:** i2e Webfuel
- **Tagline:** "Fuel Your AI Visibility"
- **Target Market:** South African small businesses
- **Currency:** South African Rand (ZAR)
- **Brand Colors:** Black, Orange (#FF3800), Silver
- **Design Style:** Clean, modern, futuristic but professional

## Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS 4
- **Backend:** Node.js + Express + tRPC 11
- **Database:** MySQL (via Drizzle ORM)
- **Authentication:** Manus OAuth + Email/Password
- **AI Engine:** Google Gemini 2.5 Flash
- **Payments:** Paystack & PayFast (South African)
- **File Storage:** S3 (via Manus)

## Project Structure

```
i2e-webfuel/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx          # Landing page with hero, features, FAQ
│   │   │   ├── Auth.tsx             # Authentication (Sign up, Login, Verify, Reset)
│   │   │   ├── Pricing.tsx          # Pricing page with subscription tiers
│   │   │   ├── Dashboard.tsx        # User dashboard with AVO score
│   │   │   ├── WebsiteBuilder.tsx   # 7-step website builder form
│   │   │   ├── AIGeneration.tsx     # AI generation screen with preview
│   │   │   ├── DomainSettings.tsx   # Domain configuration
│   │   │   ├── AdminPanel.tsx       # Admin dashboard
│   │   │   ├── Support.tsx          # Support/Contact page
│   │   │   ├── Privacy.tsx          # Privacy Policy
│   │   │   ├── Terms.tsx            # Terms & Conditions
│   │   │   └── Home.tsx             # Dashboard wrapper
│   │   ├── components/
│   │   │   └── CookieBanner.tsx     # POPIA cookie consent
│   │   ├── App.tsx                  # Main router
│   │   └── index.css                # Brand colors & design tokens
│   └── public/
│       └── robots.txt               # AI crawler configuration
├── server/
│   ├── routers.ts                   # tRPC procedures
│   ├── db.ts                        # Database query helpers
│   └── _core/                       # Framework internals
├── drizzle/
│   └── schema.ts                    # Database schema
└── shared/
    └── const.ts                     # Shared constants
```

## Key Features

### 1. Landing Page
- Hero section with compelling headline
- "How It Works" section (3-step process)
- Features showcase highlighting AVO Lite
- Testimonials section
- FAQ section optimized for AI search
- Footer with links and social media

### 2. User Authentication
- Sign up with email and password
- Login with email/password
- Google OAuth integration
- Email verification flow
- Password reset functionality

### 3. User Dashboard
- Website overview and status
- AVO Score widget (0-100 scale)
- Quick action links
- Notification center
- Website management interface

### 4. Website Builder (7-Step Form)
- **Step 1:** Business information (name, tagline, industry, location)
- **Step 2:** Business description (what they do, target customers, services)
- **Step 3:** Brand vibe selection (Professional, Friendly, Bold, Elegant, Energetic)
- **Step 4:** Color preference (5 presets + custom hex)
- **Step 5:** Contact details (phone, email, address, social media)
- **Step 6:** Logo and business photos (optional)
- **Step 7:** Product/service images (up to 10, optional)

### 5. AI Generation Screen
- Animated loading states for each generation step
- Desktop/mobile preview toggle
- Generated website preview in browser mockup
- AVO Score display
- "Go Live" and "Make Changes" buttons

### 6. Pricing Page
- **Starter:** R99/month (1-page website)
- **Growth:** R450/month (Multi-page website)
- Feature comparison
- FAQ section

### 7. Domain Settings
- Free subdomain (businessname.i2ewebfuel.co.za)
- Custom domain configuration
- DNS record instructions
- SSL certificate status

### 8. Admin Panel
- User management (list, search, status)
- Website management (list, status, AVO scores)
- Revenue overview and analytics
- Payment history

### 9. POPIA Compliance
- Privacy Policy page
- Terms & Conditions page
- Cookie Banner with consent management

### 10. Support/Contact
- Contact form
- Multiple support channels (email, phone, WhatsApp)
- FAQ section

## AVO Lite Implementation

Every generated website automatically includes:

1. **AI-Friendly robots.txt** - Explicitly allows GPTBot, ChatGPT-User, Google-Extended, ClaudeBot, PerplexityBot, Applebot
2. **llms.txt** - Static file with business information for AI crawlers
3. **LocalBusiness Schema Markup** - JSON-LD schema with business details
4. **AI-Optimized Copy** - Definition-first, front-loaded, plain language writing
5. **Clean HTML Semantics** - Proper heading hierarchy, tel: and mailto: links, descriptive alt tags
6. **Auto Sitemap & Ping** - XML sitemap generated and pinged to Google/Bing
7. **Meta Tags** - Auto-generated title and description from form data

## Database Schema

### Users Table
- id, openId, name, email, loginMethod, role, plan, status, createdAt, updatedAt, lastSignedIn

### Websites Table
- id, userId, businessName, industry, status, avoScore, domain, customDomain, subdomain, generatedContent, createdAt, updatedAt

### FormData Table
- id, websiteId, businessName, tagline, industry, location, city, province, description, targetCustomers, services (JSON), brandVibe, colorPreference, phone, email, address, socialMedia (JSON), logoUrl, photoUrls (JSON), productImageUrls (JSON), createdAt, updatedAt

### Payments Table
- id, userId, websiteId, amount, currency, gateway, status, transactionId, invoiceNumber, date, createdAt, updatedAt

### SupportTickets Table
- id, userId, subject, message, status, priority, createdAt, updatedAt

### Notifications Table
- id, userId, title, message, type, read, createdAt

## Design System

### Colors
- **Primary:** Orange (#FF3800) - Brand accent, CTAs, highlights
- **Secondary:** Black (#000000) - Text, backgrounds, sidebar
- **Tertiary:** Silver (#B3B3B3) - Borders, muted elements
- **Background:** White (#FFFFFF)
- **Foreground:** Black (#000000)

### Typography
- **Headings:** Bold, clear hierarchy
- **Body:** Clean, readable sans-serif
- **Code:** Monospace for technical content

### Components
- Buttons with hover states
- Cards with subtle shadows
- Forms with clear labels
- Tables with alternating rows
- Progress bars for multi-step forms
- Modal dialogs for confirmations

## Responsive Design

All pages are mobile-first responsive:
- Mobile: 320px+
- Tablet: 640px+
- Desktop: 1024px+
- Large Desktop: 1280px+

## South African Localization

- Currency: ZAR (South African Rand)
- Provinces: All 9 SA provinces in dropdowns
- Payment Methods: Paystack (cards) and PayFast (EFT, SnapScan, Zapper, Mobicred)
- English Spelling: South African English throughout
- Support: Local support team and contact information
- Compliance: POPIA (Protection of Personal Information Act) compliant

## Getting Started

### Development
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Environment Variables
Required environment variables are automatically injected by Manus:
- DATABASE_URL
- JWT_SECRET
- VITE_APP_ID
- OAUTH_SERVER_URL
- VITE_OAUTH_PORTAL_URL
- BUILT_IN_FORGE_API_URL
- BUILT_IN_FORGE_API_KEY
- VITE_FRONTEND_FORGE_API_KEY
- VITE_FRONTEND_FORGE_API_URL

## Next Steps

### Phase 1-3 (Completed)
- ✅ Landing page
- ✅ Authentication UI
- ✅ Pricing page
- ✅ Dashboard
- ✅ Website builder form
- ✅ AI generation screen
- ✅ POPIA compliance pages
- ✅ Support/Contact page
- ✅ Domain settings
- ✅ Admin panel

### Phase 4-5 (In Progress)
- [ ] Integrate tRPC procedures with UI components
- [ ] Implement Gemini 2.5 Flash API integration
- [ ] Implement Paystack/PayFast payment integration
- [ ] Implement file upload handling
- [ ] Complete backend procedures for all features
- [ ] Performance optimization
- [ ] Final testing and QA

## Support

For questions or issues, contact the development team or visit the Support page at `/support`.

---

**Last Updated:** April 2026
**Version:** 1.0.0-beta
