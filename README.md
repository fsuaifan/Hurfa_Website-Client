# Hurfa — Architectural Interiors & Furniture Client

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![React Router](https://img.shields.io/badge/React_Router-7.1-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Oxlint](https://img.shields.io/badge/Linter-Oxlint-cyan?style=flat-square)](https://oxc.rs/)

**Hurfa** is a modern web application for an architectural design house and bespoke furniture manufacturer established in Amman, Jordan. The frontend presents custom kitchen models, bedroom collections, luxury living room suites, and an interactive e-commerce catalog with dual-language support (English and Arabic) and a full-featured administrative CMS.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running Locally](#running-locally)
- [Available Scripts](#-available-scripts)
- [Application Routes](#-application-routes)
- [Design System & Responsiveness](#-design-system--responsiveness)
- [Internationalization (i18n & RTL)](#-internationalization-i18n--rtl)
- [API Service Layer](#-api-service-layer)
- [Authentication & Role Management](#-authentication--role-management)
- [Build & Deployment](#-build--deployment)

---

## ✨ Key Features

### 🛋️ Architectural Catalog & Product Discovery
- **Responsive Filtering:** Category pill tabs on desktop/tablet, automatically transforming into an accessible, collapsible **hamburger dropdown menu** on mobile screens.
- **Dynamic Sorting:** Sort by default/featured, price (low to high, high to low), and newest arrivals.
- **Product Modal:** Deep-dive modal with image gallery, dimensions, material specs, price calculator, and direct add-to-cart or bespoke inquiry actions.
- **Signature Suites:** Dedicated showcase for premium whole-room collections (e.g., *The Oud Collection*, *The Wesal Collection*).

### 🍳 Kitchens & Bedrooms Showcases
- **Interactive Model Detail Pages:** Split carousels highlighting craftsmanship, cabinetry, surface variations, and detailed architectural specs for models like *Contemporary*, *Modern Chic*, and *Organic Modern*.
- **Bedrooms Showcase:** Full collection display with tailored storage solutions and modular wall closets.

### 🌐 Bilingual Experience & RTL Support
- Instant language switching between **English (LTR)** and **Arabic (RTL)** across all pages.
- Native typography with **Inter** for Latin script and **Cairo** for Arabic script.
- Bidirectional CSS mirroring for paddings, margins, icons, drawers, and modal alignments.

### 🛒 E-Commerce & Floating Cart Drawer
- **Persistent Cart:** Client-side cart backed by `localStorage` with quantity updates and instant price calculation in JOD.
- **Floating Cart Button & Drawer:** Accessible global cart drawer with slide-in animations.
- **Checkout & Order Submission:** Direct order placement connecting to the backend order management API.

### 🛠️ Administrative Portal & CMS Suite
- **Secure Admin Dashboard:** Protected routes (`/admin`, `/editor`) for managing:
  - **Products & Categories:** Full CRUD, image uploads, price adjustments, sale badges.
  - **Banner & Video Manager:** Hero video URL management and homepage media configuration.
  - **Collections & Suites:** Premium collection configuration.
  - **Orders & Inquiries:** Order tracking, status updates, client inquiry management.
  - **ImageKit Integration:** In-browser media asset browser and CDN uploader.

---

## 🛠️ Tech Stack

| Domain | Technology / Library | Version | Description |
| :--- | :--- | :--- | :--- |
| **Core Framework** | [React](https://react.dev/) | `^19.2.8` | Component-based UI library |
| **Build Tool** | [Vite](https://vitejs.dev/) | `^8.2.2` | Ultra-fast development server and optimized bundle builder |
| **Routing** | [React Router DOM](https://reactrouter.com/) | `^7.18.2` | Client-side routing with protected route wrappers |
| **UI Components** | [React-Bootstrap](https://react-bootstrap.github.io/) / [Bootstrap](https://getbootstrap.com/) | `^2.10.10` / `^5.3.8` | Responsive layout grid, modals, offcanvas, and navbars |
| **HTTP Client** | [Axios](https://axios-http.com/) / Fetch API | `^1.20.0` | Centralized REST client with auth headers |
| **Code Quality** | [Oxlint](https://oxc.rs/) | `^1.79.0` | High-performance JavaScript/JSX linter |
| **CDN & Media** | [ImageKit.io](https://imagekit.io/) | — | Dynamic image optimization, transformations, and asset delivery |

---

## 📂 Project Structure

```
Hurfa_Website-Client/
├── index.html                 # Main HTML entry point (Cairo & Inter fonts, viewport config)
├── package.json               # Dependencies and build scripts
├── vite.config.js             # Vite configuration with React plugin
├── src/
│   ├── main.jsx               # Application bootstrap and React DOM render
│   ├── App.jsx                # Root router configuration and layout wrappers
│   ├── index.css              # Global baseline typography, reset, and RTL base rules
│   ├── App.css                # Layout framing, header transitions, and utility classes
│   │
│   ├── components/            # Reusable UI components
│   │   ├── Navbar.jsx         # Responsive top navbar with transparent-to-solid transitions
│   │   ├── Footer.jsx         # Footer with localized links, branding, and contact info
│   │   ├── FloatingCart.jsx   # Global slide-out shopping cart widget
│   │   ├── ProductModal.jsx   # Detailed product view modal with specs & actions
│   │   ├── Home-vid.jsx       # Full-screen architectural hero video player
│   │   ├── KitchenGallery.jsx # Kitchen collection gallery grid
│   │   ├── ModelHero.jsx      # Model detail hero banner
│   │   ├── ModelDetailRows.jsx# Feature & material specification breakdown rows
│   │   ├── AdminProtectedWrapper.jsx # Route guard for administrative routes
│   │   └── imgkitApi.jsx      # ImageKit media browser and asset manager component
│   │
│   ├── pages/                 # Route views & page controllers
│   │   ├── homepage.jsx       # Landing page with video hero, heritage, and category teasers
│   │   ├── products.jsx       # Full catalog with desktop pill tabs & mobile hamburger filter
│   │   ├── Kitchens.jsx       # Kitchen collections overview
│   │   ├── KitchenModelDetail.jsx # Deep-dive view for specific kitchen models
│   │   ├── bedrooms.jsx       # Bedroom collection and closet systems showcase
│   │   ├── aboutUs.jsx        # Company heritage, craftsmanship philosophy, and org chart
│   │   ├── cart.jsx           # Full checkout and cart summary page
│   │   ├── login.jsx          # Customer & admin authentication portal
│   │   ├── signUp.jsx         # Customer account registration
│   │   ├── account.jsx        # User profile, past orders, and saved preferences
│   │   ├── admin.jsx          # Comprehensive administrative management panel
│   │   └── editor.jsx         # Visual content editor and preview tool
│   │
│   ├── context/               # Global state providers
│   │   └── LanguageContext.jsx# Complete English/Arabic translations and RTL provider
│   │
│   ├── services/              # API and external integrations
│   │   └── api.js             # Centralized HTTP service layer connecting to backend
│   │
│   └── css/                   # Modular stylesheets per page & component
│       ├── Navbar.css         # Navbar sizing, transitions, and mobile menu
│       ├── logo.css           # Fluid logo sizing via clamp(), vw, and vh across all breakpoints
│       ├── products.css       # Catalog grid, mobile category dropdown, and filters
│       ├── Kitchens.css       # Kitchen model layout and image treatments
│       ├── bedrooms.css       # Bedroom collection gallery styles
│       ├── aboutUs.css        # Heritage layout and methodology timelines
│       ├── cart.css           # Cart items and checkout form styling
│       ├── admin.css          # Admin table, modal, and CRUD UI styles
│       └── login.css          # Auth form cards and validations
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** `v18.0.0` or higher (Node `v20+` recommended)
- **npm:** `v9.0.0` or higher (or `pnpm` / `yarn`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fsuaifan/Hurfa_Website-Client.git
   cd Hurfa_Website-Client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# URL pointing to the Hurfa backend server
VITE_SERVER_URL=http://localhost:5000

# Optional explicit API base URL (defaults to VITE_SERVER_URL/api)
VITE_API_URL=http://localhost:5000/api
```

> [!NOTE]
> If `VITE_SERVER_URL` is omitted, the API service layer defaults to `http://localhost:5000`.

### Running Locally

Start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the port indicated in your terminal).

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server with Vite HMR at `http://localhost:5173`. |
| `npm run build` | Compiles and minifies the application into the `dist/` directory for production. |
| `npm run preview` | Locally serves the production build from `dist/` to test deployment output. |
| `npm run lint` | Runs `oxlint` to perform fast static analysis and linting across JavaScript and JSX files. |

---

## 🗺️ Application Routes

| Path | View Component | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage` | Public | Hero video, company introduction, category portals |
| `/kitchens` | `Kitchens` | Public | Kitchen models and collection overview |
| `/kitchens/:modelId` | `KitchenModelDetail` | Public | Detailed specifications and gallery for a specific kitchen model |
| `/bedrooms` | `Bedrooms` | Public | Bedroom collections and wall closet solutions |
| `/products` | `Products` | Public | Complete furniture catalog with category filters and sorting |
| `/about` | `AboutUs` | Public | Story, heritage, design philosophy, process, and organization |
| `/cart` | `Cart` | Public | Shopping cart overview, item quantity management, checkout |
| `/login` | `Login` | Public | User and administrator sign-in |
| `/signup` | `SignUp` | Public | Customer account registration |
| `/account` | `Account` | Authenticated | Customer dashboard and order history |
| `/admin` | `Admin` | Admin Only | Administrative management panel for products, categories, orders |
| `/editor` | `Editor` | Admin Only | Live content editor and previewer |

---

## 📐 Design System & Responsiveness

The application is engineered to provide a seamless visual experience across all form factors:

- **Fluid Breakpoints:**
  - **Large Displays & 4K ($\ge 1400\text{px}$):** Expanded grids, proportional typography via `clamp()`.
  - **Standard Desktop ($1200\text{px} - 1399\text{px}$):** 4-column product catalog, full horizontal navigation.
  - **Laptops ($992\text{px} - 1199\text{px}$):** 3-column product catalog.
  - **Tablets ($768\text{px} - 991\text{px}$):** 2-column catalog, mobile navigation toggler.
  - **Phablets & Mobile Landscape ($576\text{px} - 767\text{px}$):** 2-column catalog, mobile category hamburger filter.
  - **Standard Phones ($380\text{px} - 575\text{px}$):** 1-to-2 column adaptive layout, scaled logo (`12vh` / `22vw`), full-width select dropdowns.
  - **Extra Small Phones ($< 380\text{px}$):** Compact single-column layout, touch-friendly tap targets ($\ge 44\text{px}$).

---

## 🌍 Internationalization (i18n & RTL)

The application includes a built-in localization engine via `LanguageContext`:

- **Context Provider:** Wraps the entire application, managing active language (`en` or `ar`) and persisting selection in `localStorage`.
- **Direction Handling:** Automatically toggles `dir="rtl"` and `lang="ar"` on the `<html>` document root.
- **Helper Functions:**
  - `t(key, fallback)`: Translates UI strings.
  - `getLocalizedName(item)`: Extracts Arabic or English name from database entities.
  - `getLocalizedDesc(item)`: Extracts localized description.
  - `getLocalizedTagline(item)`: Extracts localized tagline.

---

## 🔌 API Service Layer

All backend communication is centralized in [`src/services/api.js`](file:///home/fahdsuaifan/Hurfa_Website-Client/src/services/api.js):

- **Auto-Role Ingestion:** Automatically appends `x-role: admin` and `x-user-email` headers when an authenticated admin session is active.
- **Graceful Fallbacks:** If the backend database is unreachable, catalog views fall back to bundled signature collections and default categories to maintain UI integrity.
- **Endpoint Modules:**
  - `api.products` — Product retrieval, creation, updates, and deletes.
  - `api.categories` — Category management.
  - `api.orders` — Order submission and administrative status management.
  - `api.inquiries` — Customer inquiry submission and review.
  - `api.videos` — Homepage banner/hero video management.
  - `api.auth` — Customer and administrator login/registration.

---

## 🔒 Authentication & Role Management

- **Customer Sessions:** Stored in `localStorage` under `hurfa_user` and `hurfa_customer_authenticated`.
- **Administrator Sessions:** Managed via `hurfa_admin_authenticated` in `sessionStorage` or `localStorage`.
- **Route Protection:** Protected routes (`/admin`, `/editor`) are wrapped with `<AdminProtectedWrapper>`, automatically redirecting unauthenticated users to `/login`.
- **Cross-Tab Synchronization:** Listens to `storage` and custom `hurfa-auth-changed` events to dynamically update navbar destinations.

---

## 🚢 Build & Deployment

To create an optimized production build:

```bash
npm run build
```

This generates production assets in the `dist/` directory, ready to be deployed to static hosting platforms such as Vercel, Netlify, Cloudflare Pages, or Railway.

---

## 🏛️ About Hurfa

**Hurfa LLC** is a design house established in Amman, Jordan in 2021, specializing in kitchens, bedrooms, living rooms, and bespoke architectural furniture.

*Crafted with architectural precision, longevity, and functional clarity.*
