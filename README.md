# DRIP — Premium Fast-Fashion E-Commerce with 3D AI Try-On

DRIP is a premium, contemporary fast-fashion e-commerce platform featuring an integrated **3D AI Fitting Room (Avatar Studio)** and a **Personalized Style DNA Scanner**. The application couples high-fidelity streetwear aesthetic collections with machine-learning-driven digital draping simulations to solve sizing uncertainty and return friction in online shopping.

---

## 🛠 Technology Stack

### Core Frameworks & Libraries
* **Frontend**: React 19, Next.js 16.1 (App Router, Turbopack, SSR/CSR rendering split)
* **Styling & Theme**: Tailwind CSS v4 (incorporating CSS-variable custom color mappings), Lucide Icons, dynamic `@import` Google Font families
* **State Management**: Zustand with persistent client-side middleware (`localStorage` syncing)
* **Image Compression**: `browser-image-compression` (safeguards selfie uploads by shrinking canvas memory footprints before transmission)

### Scraper & Engine Integration
* **Product Importer Scraper**: Node fetch pipeline parsing HTML metadata headers (`og:image`, `og:title`)
* **VTON (Virtual Try-On) Engine**: Backed by dynamic API bindings (`REPLICATE_API_TOKEN`, `HF_TOKEN`, `PIAPI_KEY`). Integrates a robust 4-second delay canvas simulation fallback to guarantee high-fidelity draping drapes even if API keys are missing.
* **Database**: Static local SQL-grade array profiles mapped in `src/data/products.ts`, synced client-side with Supabase auth metadata.

---

## ⚡ Core Features & Folder Navigation

### 1. 3D Trial Studio (Avatar Studio)
* **Path**: [`src/app/avatar-studio/page.tsx`](file:///e:/New%20folder/drip-app/src/app/avatar-studio/page.tsx)
* **Description**: The core fitting room sandbox. Supports:
  * Male (Alex) and Female (Sophia) base models.
  * Custom body photo upload (integrated with automatic client-side compression).
  * Wardrobe filters dynamically mapping database items.
  * Draping trigger states feeding garment coordinates to VTON API.

### 2. Custom Product URL Importer
* **API Path**: [`src/app/api/import-product/route.ts`](file:///e:/New%20folder/drip-app/src/app/api/import-product/route.ts)
* **Studio Drawer Entry**: Wardrobe panel $\rightarrow$ `Custom Imports` tab $\rightarrow$ `Import URL` card.
* **Description**: Let's users scan and import garments from H&M, Zara, Nike, or any fashion retailer by pasting a product link. The scraper grabs details and places the custom dress in the user's try-on closet.

#### Scraper Security Architecture:
* **SSRF Mitigation**: Runs a DNS lookup on hostnames prior to fetching, blocking all local, private, loopback (`127.0.0.0/8`, `10.0.0.0/8`, `192.168.0.0/16`), and link-local (AWS metadata `169.254.169.254`) ranges.
* **Port Restrictions**: Intercepts requests pointing to custom ports, restricting traffic exclusively to standard `80` (HTTP) and `443` (HTTPS) ports.
* **Denial of Service Capping**: Verifies `Content-Length` headers, throwing an error for payloads $> 2\text{MB}$.
* **Timeout Enforcement**: Enforces a strict 5-second connection deadline using `AbortController` to prevent Slowloris attacks.
* **XSS Mitigation**: Sanitizes scraped names (stripping HTML tags) and validates that the scraped image URL matches a secure `http:`/`https:` protocol.

### 3. Style DNA Blueprint
* **Page Path**: [`src/app/profile/style-dna/page.tsx`](file:///e:/New%20folder/drip-app/src/app/profile/style-dna/page.tsx)
* **Component Path**: [`src/components/StyleDNAOnboarding.tsx`](file:///e:/New%20folder/drip-app/src/components/StyleDNAOnboarding.tsx)
* **Description**: A multi-step styling scanner wizard. Captures shoulder/hip dimensions via digital tailor calipers, scans skin undertones, style vibes (minimalist, streetwear, classic, bohemian), and budget bounds. Generates a blueprint card and filters the catalog for personalized matches using `src/lib/productMatcher.ts`.

### 4. Product buys Section
* **Path**: [`src/app/product/[id]/page.tsx`](file:///e:/New%20folder/drip-app/src/app/product/%5Bid%5D/page.tsx)
* **Description**: The e-commerce details page. Employs a scrolling-free design:
  * **Buy Column**: Contains price, brand, colors, sizes, AI styling advice, and checkout actions (fixed on screen).
  * **Image Column**: Capped height portrait views (`sticky top-28`).
  * **Grid Column (Below image)**: A 3-column grid containing Materials, Express Shipping details, and SEO FAQs.

---

## 🎨 Branding System & Color Palette
The app uses a premium editorial design system defined in `src/app/globals.css`:
* **Maroon (`--color-drip-maroon`)**: `#7A0C16` (deep burgundy luxury accent)
* **Cream (`--color-drip-cream`)**: `#FAF4EE` (warm text background contrast)
* **Navy (`--color-drip-navy`)**: `#1A1A2E` (midnight background)
* **Coral (`--color-drip-coral`)**: `#E94560` (vibrant CTA highlight)
* **Green (`--color-drip-green`)**: `#1DB954` (AI Match approval badge)

---

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env.local` containing:
   ```env
   # API Keys (optional; falls back to canvas VTON simulation if empty)
   REPLICATE_API_TOKEN=your_token
   HF_TOKEN=your_token
   ```

3. **Start the local server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.
