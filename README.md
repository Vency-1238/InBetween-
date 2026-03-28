# InBetween Candles - Production Vite + Appwrite Storefront

A production-ready, frontend-only e-commerce candle website built with React (Vite), Tailwind CSS, Context API, and Appwrite (Database + Auth + Storage). It is ready to deploy on Vercel.

## Tech Stack

- Frontend: React + Vite
- Styling: Tailwind CSS
- Backend Services: Appwrite Database, Auth, Storage
- State Management: React Context API + localStorage
- Deployment: Vercel

## Pages

- Home (The Pause Collection)
- Cart
- Wishlist
- My Orders
- Admin Login
- Admin Dashboard

## Appwrite Setup

Create these resources in Appwrite:

1. Project: any name
2. Database ID: `candleDB`
3. Collection ID: `products`
4. Orders Collection ID: `orders`
5. Product fields:
   - `name` (string)
   - `description` (string)
   - `imageId` (string)
6. Orders fields:
  - `orderCode` (string)
  - `fullName` (string)
  - `address` (string)
  - `contactNumber` (string)
  - `city` (string)
  - `state` (string)
  - `pincode` (string)
  - `orderNote` (string, optional)
  - `customerUpiId` (string)
  - `paymentUtr` (string)
  - `status` (string)
  - `totalAmount` (string)
  - `itemCount` (integer)
  - `itemsJson` (string)
7. Storage Bucket ID: `candle-images`
8. Auth method: Email/Password enabled (for admin login)

Optional but recommended:
- Set `VITE_ADMIN_EMAIL` to strictly allow a single admin account email.

## Environment Variables

Create `.env` in project root:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_DATABASE_ID=candleDB
VITE_COLLECTION_ID=products
VITE_ORDERS_COLLECTION_ID=orders
VITE_BUCKET_ID=candle-images
VITE_ADMIN_EMAIL=admin@example.com
```

Only `VITE_` prefixed variables are used in Vite frontend builds.

## Local Development

```bash
npm install
npm run dev
```

## Production Build Check

```bash
npm run build
```

## GitHub Push Steps

```bash
git add .
git commit -m "Build production-ready candle e-commerce frontend"
git push origin main
```

## Deploy on Vercel

1. Go to Vercel dashboard.
2. Click **Add New Project**.
3. Import your GitHub repository.
4. Framework preset: **Vite**.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Add environment variables in Project Settings -> Environment Variables:
   - `VITE_APPWRITE_ENDPOINT`
   - `VITE_APPWRITE_PROJECT_ID`
   - `VITE_DATABASE_ID`
   - `VITE_COLLECTION_ID`
  - `VITE_ORDERS_COLLECTION_ID`
   - `VITE_BUCKET_ID`
   - `VITE_ADMIN_EMAIL` (optional but recommended)
8. Deploy.

## Common Vercel Errors and Fixes

1. Build succeeds locally but fails on Vercel:
   - Ensure Node version is compatible with Vite (use Node 20+).
   - Reinstall lockfile locally and commit `package-lock.json`.

2. Appwrite requests fail after deploy:
   - Verify all environment variables are set in Vercel.
   - Confirm Appwrite platform includes your Vercel domain.
   - Ensure endpoint includes `/v1`.

3. Empty product list on Home:
   - Confirm collection ID `products` exists in database `candleDB`.
   - Confirm documents use exact names:
     - `No Plans Today`
     - `Before the Day Begins`
     - `Under Quiet Skies`
   - Confirm each document has a valid `imageId` from bucket `candle-images`.

4. Admin login works locally but not in prod:
   - Confirm Email/Password auth is enabled in Appwrite.
   - If `VITE_ADMIN_EMAIL` is set, verify login email exactly matches.

## Feature Notes

- Home always renders the exact three products of The Pause Collection in fixed order.
- Pricing is fixed:
  - Launch price: `?449` (bold/larger)
  - MRP: `?499` (strikethrough)
  - Badge: `Launch Offer � 10% OFF`
- Cart and Wishlist are persisted via `localStorage`.
- No Express or server-side runtime is used.

## Project Structure

```text
src/
  components/
    AdminRoute.jsx
    Collection.jsx
    Navbar.jsx
    ProductCard.jsx
  context/
    AdminAuthContext.jsx
    ShopContext.jsx
  lib/
    appwrite.js
    constants.js
  pages/
    AdminDashboardPage.jsx
    AdminLoginPage.jsx
    CartPage.jsx
    HomePage.jsx
    WishlistPage.jsx
  services/
    products.js
  App.jsx
  index.css
  main.jsx
```
