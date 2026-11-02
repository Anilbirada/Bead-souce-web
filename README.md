# BEADSSOURCE – PREMIUM INTERNATIONAL WHOLESALE E-COMMERCE PLATFORM

[![Production Ready](https://img.shields.io/badge/status-production--ready-emerald.svg)](#)
[![Stack](https://img.shields.io/badge/stack-React_19_+_Vite_+_Tailwind_v4_+_Node.js-blue.svg)](#)
[![Client](https://img.shields.io/badge/client-Ramesh_Sir_(SP_Bengaluru)-amber.svg)](#)
[![Compliance](https://img.shields.io/badge/compliance-CPSIA_%7C_Prop_65_%7C_REACH-purple.svg)](#)

---

## 📌 1. PROJECT INFORMATION & BACKGROUND

- **Client:** Ramesh Sir – SP Bengaluru, Karnataka, India
- **Existing Website:** [https://beadssource.com/](https://beadssource.com/)
- **Design & Experience Reference:** [Everful Wholesale](https://www.everfulwholesale.com/)
- **Project Name:** BeadsSource Premium Website Redesign & Production Build
- **Project Type:** Production-Ready Full-Stack Wholesale E-Commerce Platform
- **Repository:** [https://github.com/Anilbirada/Bead-souce-web](https://github.com/Anilbirada/Bead-souce-web)

### Project Genesis & Purpose
BeadsSource is an international manufacturer and wholesale exporter of natural gemstone bead strands, certified lead-free pewter charms, micro-pavé cubic zirconia findings, and finished artisan jewelry based in the historic SP Road jewelry and commercial hub of Bengaluru. 

Guided by the conversion-focused, minimalist e-commerce structure of **Everful Wholesale**, this platform completely modernizes BeadsSource with:
- **Luxury Minimalist Aesthetics:** Warm ivory backgrounds (`#FAF9F5`), champagne gold borders (`#D4AF37`, `#C4A052`), and elegant serif typography (*Cormorant Garamond* and *Playfair Display* paired with *Plus Jakarta Sans*).
- **Zero middleman trading overhead:** Preserving and migrating genuine factory SKUs (e.g. `A12502`, `A5853`, `A8283`, `A1016`, `A912`), real prices ($0.30 to $20.00), authentic product photography, and comprehensive technical specifications.
- **Dedicated Wholesale Features:** Automated volume tier discounts (15% off for 10–49 pk, 30% off for 50+ pk), a multi-product Request a Quote (RFQ) builder, instant SKU search, dual-currency switching (USD $ / INR ₹), and an executive administration suite.

---

## 🔐 2. DATABASE CONFIGURATION & ACCESS PASSWORDS

The platform utilizes a high-performance, atomic JSON database engine residing in the `server/data/` directory. This delivers zero-configuration portability, ACID-compliant persistence, and local fallback data hydration for offline testing.

### 🔑 Pre-Configured Accounts & Credentials

| Account Role | Email / Username | Password | Database Location | Access Rights |
| :--- | :--- | :--- | :--- | :--- |
| **Store Owner / Admin** | `admin@beadssource.com` | `admin` | `server/data/users.json` | **Full Executive Admin Suite**: Add/Edit/Delete Products, Stock Level Adjustments, Order Fulfillment, International Tracking Assignment, RFQ Counter-Offers, Coupon Creation, Revenue KPIs |
| **Wholesale Buyer** | `buyer@boutiquejewels.com` | `buyer` | `server/data/users.json` | **Verified Tier 1 B2B Account**: Tier Discounts, Multi-Product RFQ Builder, Order History, Commercial Invoices |

*(Note: The B2B Auth modal also features 1-click **Quick Demo Login** buttons for immediate testing without manual typing).*

### 🗄️ Database Schema & File Structure
```
server/data/
├── products.json     # 35+ genuine BeadsSource products with SKUs, prices, images & specs
├── categories.json   # 12 master wholesale categories with banner imagery
├── orders.json       # Live customer purchase orders, addresses & tracking codes
├── quotes.json       # Submitted RFQ quotation requests, target pricing & counter-offers
├── coupons.json      # Wholesale promo discount codes (e.g. WHOLESALE10, BULK20)
└── users.json        # User credentials, business profiles, and GSTIN/Tax ID records
```

---

## 🚀 3. STEP-BY-STEP RUN GUIDE (EASY TO UNDERSTAND)

Follow these clear, step-by-step instructions to run the entire platform locally on your machine.

### Prerequisites
Make sure you have Node.js installed on your system:
- **Node.js**: v18.0.0 or newer (v20+ or v26+ recommended)
- **npm**: v9.0.0 or newer

Check your versions by running:
```bash
node -v
npm -v
```

---

### Step 1: Clone the Repository
Open your terminal (PowerShell, Command Prompt, or Bash) and clone the repository:
```bash
git clone https://github.com/Anilbirada/Bead-souce-web.git
cd Bead-souce-web
```

---

### Step 2: Install Project Dependencies
Install all required frontend and backend packages with a single command:
```bash
npm install
```
*(On Windows PowerShell, if execution policy restricts scripts, you can run `cmd /c "npm install"`).*

This installs:
- **Frontend:** `react`, `react-dom`, `lucide-react`, `tailwindcss`, `@tailwindcss/vite`, `vite`
- **Backend:** `express`, `cors`

---

### Step 3: Start the Backend REST API Server (Port 5000)
Start the Node.js Express API server:
```bash
npm run server
```
*Or directly:*
```bash
node server/index.js
```
You will see:
```
BeadsSource Wholesale API running on http://localhost:5000
```
Keep this terminal window running.

---

### Step 4: Start the Frontend Vite Development Server
Open a second terminal window in the project folder and run:
```bash
npm run dev
```
You will see output similar to:
```
  VITE v8.3.5  ready in 845 ms

  ➜  Local:   http://localhost:3000/ (or http://localhost:3001/)
  ➜  Network: http://192.168.x.x:3000/
```

---

### Step 5: Open the Application in your Browser
Navigate to:
```
http://localhost:3000/
```
*(If port 3000 was in use, Vite will automatically start on `http://localhost:3001/`).*

You are now running the complete, live BeadsSource platform!

---

### Step 6: Building for Production (Optional)
To test or generate an optimized production bundle:
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`. You can preview the production build locally with:
```bash
npm run preview
```

---

## 💎 4. MASTER FEATURES & MODULE BREAKDOWN

### 1. Homepage & Visual Merchandising
- **Announcement Bar:** Global currency switcher (**USD $ / INR ₹** with live calculation at ₹86.5/USD), free shipping threshold tracker ($500+), SP Bengaluru direct line (+91 98450 12399), and B2B Wholesale Portal sign-in.
- **Premium Header & Live Search Autocomplete:** Instant debounced search querying product titles, materials, and exact factory SKUs (e.g. `A12502`, `A8283`, `A1016`) with live thumbnail previews.
- **Hero Banner:** Luxury typography, volume tier callouts, and trust badges (5,000+ Designers, 100% Certified Lead-Free Pewter).
- **Featured Categories Grid:** 12 curated wholesale categories with item counts and descriptions.
- **Best-Selling Products:** Top-velocity components with quick-preview modal and 1-click cart/quote actions.
- **New Arrivals:** Fresh container shipments of perfume bottle pendants, carved ovals, and pave connectors.
- **Natural Gemstone Showcase:** Technical spotlights on MOHS mineral hardness, calibrated drill sizes (4mm–12mm), and authentic sourcing.
- **Micro Pavé CZ & Crystal Collection:** AAA-grade prong-set crystals in tarnish-resistant electroplated 18K gold and rhodium brass.
- **Handmade Jewellery Showcase:** Double silk-knotted gemstone malas, baroque pearl bracelets, and lava rock diffuser bracelets.
- **Why Choose BeadsSource:** Highlighting direct factory sourcing, SP Bengaluru showroom presence, California Prop 65 & CPSIA lead-free compliance, and 3–5 day worldwide courier dispatch.
- **Verified Customer Testimonials:** International reviews from jewelry studios and boutique owners in San Francisco, Paris, and Bengaluru.
- **Complete Premium Footer:** Export compliance seals, bank remittance details, SP Road showroom address, and contact lines.

### 2. Product Catalogue (`/catalog`)
- **12 Designated Categories:**
  1. *Natural Gemstone Beads*
  2. *Turquoise Beads & Slabs*
  3. *Crystal Beads*
  4. *Cubic Zirconia (CZ)*
  5. *Jewelry Pendants*
  6. *Jewelry Connectors*
  7. *Jewelry Spacers*
  8. *Jewelry Findings*
  9. *Handmade Necklaces*
  10. *Handmade Bracelets*
  11. *Lead-Free Pewter Charms*
  12. *Accessories & Velvet Displays*
- **Multi-Faceted Filtering:** Filter by category, material/gemstone, price slider, and in-stock inventory.
- **Sorting Options:** Featured Picks, Best Selling, New Arrivals, Price: Low to High, Price: High to Low, Top Rated, and Alphabetical.
- **Grid Layout Controls:** Toggle between 3-column and 4-column responsive product grids.

### 3. Product Detail Page (`/product`)
- **Interactive Image Lightbox:** Full-screen zoom lightbox and thumbnail gallery.
- **Automated Wholesale Tier Table:**
  - **Tier 1 (1–9 packs):** Base catalog price
  - **Tier 2 (10–49 packs):** **15% Volume Discount**
  - **Tier 3 (50+ packs):** **30% Master Bulk Discount**
- **Variation Selectors:** Calibrated finish options (*Antique Gold, Antique Silver, Antique Bronze, 18K Gold Plated*) and pack dimensions.
- **Bulk Multipliers:** Quick-add presets (+10, +25, +50, +100 packs).
- **Direct RFQ Quotation Modal:** Submit custom inquiries or special requirements directly to Ramesh Sir with a single click.
- **Technical Tabbed Information:**
  - *Specifications:* Material composition, hole drill diameter, dimensions, shape, and CPSIA compliance.
  - *Shipping & Packaging:* Export bubble wrap, sealed PE packaging, and air courier dispatch timelines.
  - *Care Instructions:* Tarnish prevention, ultrasonic cleaning advice, and mineral preservation.

### 4. Dedicated Wholesale RFQ (Request a Quote) System (`/quote`)
- **Multi-Product Quotation Builder:** Select multiple products across the catalogue, set target quantities, target unit prices ($), and item-specific customization notes.
- **Project Specifications:** Input expected delivery date, overall target budget, and business credentials (GSTIN / Resale Tax ID).
- **Backend RFQ Processing:** Generates unique tracking IDs (`RFQ-2026-XXX`) accessible in the Customer Dashboard.
- **Admin Counter-Offer Desk:** Admin interface allows Ramesh Sir to review buyer target prices, input counter-offers, provide factory production notes, and approve quotations.

### 5. Wholesale Checkout & Official Commercial Invoice (`/checkout`)
- **Frictionless Multi-Step Checkout:**
  - *Step 1:* Wholesale business credentials, GSTIN / Tax ID, and authorized contact info.
  - *Step 2:* Complete shipping address and courier selection (**DHL Express Worldwide, FedEx International Priority, or SP Road Showroom Pickup**).
  - *Step 3:* Payment method (**Bank Wire Transfer / TT, Domestic UPI / Net Banking, or Credit Card**).
  - *Step 4:* Order summary with coupon redemption (`WHOLESALE10`, `BULK20`, `FREESHIP500`) and tiered volume discounts.
- **Instant Official Commercial Tax Invoice:** Automatically decrements inventory stock, issues an order reference (`ORD-2026-XXXX`), assigns tracking codes, and displays an official printable commercial invoice complete with State Bank of India export account remittance details.

### 6. Administration Suite (`/admin`)
- **Executive KPI Analytics:** Live Gross Wholesale Revenue, Total Active Orders, Pending Quotations, and Low-Stock SKUs (<200 units).
- **Product Management:** Add new products with image URLs, SKUs, and specifications; edit prices; adjust live stock quantities; delete products.
- **Order Management:** Filter orders by status (`Processing`, `Shipped`, `Delivered`, `Cancelled`) and assign international tracking numbers.
- **Quotation Management:** Review customer RFQs, enter counter-offer unit rates, send official response notes, and approve quotes.
- **Coupon Management:** Create new promotional coupon codes with minimum order requirements.

---

## 📡 5. REST API ENDPOINT REFERENCE

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & system time | Public |
| `GET` | `/api/products` | Query products (search, filter, sort) | Public |
| `GET` | `/api/products/:id` | Get single product by ID or slug | Public |
| `POST` | `/api/products` | Create a new wholesale product | Admin |
| `PUT` | `/api/products/:id` | Update product, price, stock, or specs | Admin |
| `DELETE` | `/api/products/:id` | Delete product from database | Admin |
| `GET` | `/api/categories` | Retrieve all 12 wholesale categories | Public |
| `POST` | `/api/auth/login` | Authenticate wholesale user or admin | Public |
| `POST` | `/api/auth/register`| Register new wholesale buyer account | Public |
| `GET` | `/api/orders` | Fetch orders (supports `?email=...`) | User/Admin |
| `POST` | `/api/orders` | Create order & decrement stock | User |
| `PUT` | `/api/orders/:id/status`| Update order status & tracking code | Admin |
| `GET` | `/api/quotes` | Fetch RFQ quotation requests | User/Admin |
| `POST` | `/api/quotes` | Submit multi-product RFQ quotation | User |
| `PUT` | `/api/quotes/:id` | Respond with counter-offer & approve | Admin |
| `POST` | `/api/coupons/validate`| Validate promo coupon & minimum order | Public |
| `GET` | `/api/coupons` | List all promotional coupons | Admin |
| `POST` | `/api/coupons` | Create new promotional discount code | Admin |
| `GET` | `/api/admin/stats` | Executive KPI analytics & sales revenue | Admin |

---

## 🏛️ 6. REGULATORY COMPLIANCE & CERTIFICATIONS

- **US CPSIA & California Prop 65**: All lead-free pewter components contain `< 0.009% (90 ppm)` total lead content. Certified child-safe and compliant for adult fine jewelry manufacturing.
- **European REACH Regulation (EC 1907/2006)**: Tested free from hazardous cadmium and nickel release.
- **Geological Mineral Verification**: Natural quartz, turquoise, agate, amethyst, green fluorite, and jasper are 100% genuine geologic minerals, inspected and graded in SP Bengaluru.

---

## 🤝 7. CONTACT & SHOWROOM

- **Client:** Ramesh Sir
- **Flagship Showroom:** SP Road Commercial Center, Bengaluru, Karnataka 560002, India
- **Direct WhatsApp / Call:** +91 98450 12399
- **Email:** `wholesale@beadssource.com` &bull; `info@beadssource.com`
- **Hours:** Monday &ndash; Saturday: 10:00 AM &ndash; 7:30 PM IST

---

*&copy; 2026 BeadsSource LLC &bull; SP Bengaluru &bull; All Rights Reserved.*
