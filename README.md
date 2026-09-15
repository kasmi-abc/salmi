# Salmi Series — E-commerce Médical (Next.js 14)

Production-ready Next.js 14 (App Router) + Prisma + NextAuth + Zustand + Tailwind.

## Quick start

```bash
npm install
# configurer .env (voir .env.example)
npx prisma db push
npm run db:seed
npm run dev
```

Seed admin: `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `.env` (configure in `.env` - see `.env.example`)
Seed data: 9 produits, 3 avis/produit, 2 promos (SALMI10 -10%, RESIDANAT20 -20%), 1 pack.

## Structure
- `app/page.tsx` landing + hero
- `app/shop` catalogue avec pagination (12/page), filtres category/year/search (q), tri
- `app/shop/[slug]` fiche produit + TOC + PDF preview + avis + stock alert (StockAlert)
- `app/bundles` packs — ajout panier complet (BundleAddToCart)
- `app/cart` & `app/checkout` (shipping dynamique par wilaya via WilayaShipping, promo, invoice)
- `app/track` & `app/track/[id]` suivi commande
- `app/admin` dashboard protégé (overview, produits, commandes, promos, livraison, packs, alertes, avis, settings) + export CSV + etiquette
- `prisma/schema.prisma` models Product, Order, OrderItem, User, Review, PromoCode, Bundle, StockAlert, WilayaShipping
- `app/actions` Server Actions (products, orders, promos, shipping, reviews with rate-limit 2min, bundles, alerts)
- `lib/store.ts` Zustand cart + localStorage persist

## Env
```
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..." # openssl rand -base64 32
ADMIN_USERNAME="..."
ADMIN_PASSWORD="..." # min 16 chars, never commit real value
# Optional - production uploads
# CLOUDINARY_URL="cloudinary://..."
# BLOB_READ_WRITE_TOKEN="..."
```

## Notes
- Checkout shippingFee est dynamique: WilayaShipping > fallback 400 DA Stop Desk / 600 DA Domicile
- Reviews: rate-limit 2min/IP+produit + 5min/name+produit, max 500 chars
- StockAlert: formulaire M'alerter fonctionnel, visible dans Admin > Alertes
