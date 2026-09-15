import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPass = process.env.ADMIN_PASSWORD || 'adminsalmiseries123**med'
  const hashed = await bcrypt.hash(adminPass, 10)
  await prisma.user.upsert({
    where: { email: 'admin123' },
    update: { password: hashed, name: 'Admin Salmi' },
    create: { email: 'admin123', name: 'Admin Salmi', password: hashed, role: 'admin' },
  })
  console.log(`✔ Admin seeded: admin123 / ${adminPass}`)

  const products = [
    {
      title: 'Pneumologie - Résumé Complet',
      slug: 'pneumologie-resume-complet',
      description: 'Résumé ultra-synthétique de pneumologie couvrant sémiologie, pathologies obstructives/restrictives, cancers bronchiques et conduites à tenir ECN.',
      price: 2500, oldPrice: 3000, discountPercent: 17, category: 'Pneumologie', studyYear: 'RESIDANAT' as const, pages: 184,
      image: '/books/Pneumologie.jpg', featured: true, stockCount: 45,
      tableOfContents: '1. Sémiologie respiratoire\n2. Asthme & BPCO\n3. Infections broncho-pulmonaires\n4. Cancer bronchique\n5. Pathologie pleurale',
      pdfPreview: null, author: 'Dr. Salmi - Major Résidanat 2021', rating: 4.9, reviewsCount: 127,
    },
    {
      title: 'Gynécologie - L’essentiel',
      slug: 'gynecologie-essentiel',
      description: 'Tout le programme de gynécologie en fiches claires : cycle, pathologies ovariennes, cancers gynécologiques et urgences.',
      price: 2800, category: 'Gynécologie', studyYear: 'RESIDANAT' as const, pages: 210,
      image: '/books/Gynecologie.jpg', featured: true, stockCount: 32,
      tableOfContents: '1. Cycle menstruel\n2. Contraception\n3. Pathologie ovarienne\n4. Cancers gynéco\n5. Urgences',
      author: 'Dr. Salmi - Validé par Pr. CHU Alger', rating: 4.8, reviewsCount: 98,
    },
    {
      title: 'Urologie et Néphrologie - Fiches ECN',
      slug: 'urologie-nephrologie-fiches-ecn',
      description: 'Lithiase, infections, tumeurs rénales et vésicales. Algorithmes diagnostiques et thérapeutiques à jour.',
      price: 2200, category: 'Urologie', studyYear: 'RESIDANAT' as const, pages: 152,
      image: '/books/Urologie_et_nephrologie.jpg', featured: true, stockCount: 60,
      author: 'Coll. Salmi Series', rating: 4.7, reviewsCount: 76,
    },
    {
      title: 'Dermatologie - Fiches Visuelles',
      slug: 'dermatologie-fiches-visuelles',
      description: 'Dermatoses courantes, tumeurs cutanées, pathologies bulleuses avec iconographie clinique.',
      price: 2600, category: 'Dermatologie', studyYear: 'YEAR_4' as const, pages: 175,
      image: '/books/Dermatologie.jpg', featured: true, stockCount: 20,
      author: 'Dr. Salmi', rating: 4.9, reviewsCount: 54,
    },
    {
      title: 'ORL - Oto-Rhino-Laryngologie',
      slug: 'orl-oto-rhino-laryngologie',
      description: 'Pathologies ORL complètes : otites, surdité, vertiges, cancers ORL et urgences.',
      price: 2700, category: 'ORL', studyYear: 'YEAR_5' as const, pages: 195,
      image: '/books/ORL.jpg', featured: false, stockCount: 15,
      author: 'Dr. Salmi', rating: 4.6, reviewsCount: 41,
    },
    {
      title: 'Ophtalmologie - Essentiel',
      slug: 'ophtalmologie-essentiel',
      description: 'Œil rouge, cataracte, glaucome, rétinopathies - fiches synthétiques avec schémas.',
      price: 2400, category: 'Ophtalmologie', studyYear: 'YEAR_4' as const, pages: 165,
      image: '/books/ophtalmologie.jpg', featured: false, stockCount: 28,
      author: 'Dr. Salmi', rating: 4.8, reviewsCount: 33,
    },
    {
      title: 'Maladies Systémiques',
      slug: 'maladies-systemiques',
      description: 'Lupus, vascularites, sclérodermie - approche diagnostique et thérapeutique claire.',
      price: 2800, category: 'Médecine Interne', studyYear: 'RESIDANAT' as const, pages: 210,
      image: '/books/maladies_systemiques.jpg', featured: false, stockCount: 0,
      author: 'Dr. Salmi', rating: 4.7, reviewsCount: 29,
    },
    {
      title: 'Médecine de Travail',
      slug: 'medecine-de-travail',
      description: 'Risques professionnels, maladies indemnisables, aptitude et prévention.',
      price: 2200, category: 'Médecine de Travail', studyYear: 'YEAR_5' as const, pages: 140,
      image: '/books/medecine_travail.jpg', featured: false, stockCount: 50,
      author: 'Dr. Salmi', rating: 4.5, reviewsCount: 18,
    },
    {
      title: 'Médecine Légale',
      slug: 'medecine-legale',
      description: 'Thanatologie, coups et blessures, certificats, responsabilité médicale.',
      price: 2100, category: 'Médecine Légale', studyYear: 'YEAR_5' as const, pages: 130,
      image: '/books/medecine_legale2.jpg', featured: false, stockCount: 12,
      author: 'Dr. Salmi', rating: 4.6, reviewsCount: 22,
    },
    {
      title: 'La Gériatrie',
      slug: 'la-geriatrie',
      description: 'Prise en charge du sujet âgé, syndromes gériatriques, polypathologie et thérapeutique adaptée. Fiches synthétiques validées.',
      price: 2700, category: 'Gériatrie', studyYear: 'RESIDANAT' as const, pages: 180,
      image: '/books/geriatrie.jpg', featured: true, stockCount: 35,
      tableOfContents: '1. Vieillissement physiologique\n2. Syndromes gériatriques\n3. Démence & confusion\n4. Chutes et mobilité\n5. Thérapeutique du sujet âgé',
      author: 'Dr. Salmi - Major Résidanat', rating: 4.8, reviewsCount: 0,
    },
    {
      title: "L'interprétation des radiographies thoraciques",
      slug: 'interpretation-radiographies-thoraciques',
      description: 'Guide pratique et illustré pour lire et interpréter les radios thoraciques : sémiologie, pièges et cas cliniques commentés.',
      price: 2900, category: 'Radiologie', studyYear: 'YEAR_4' as const, pages: 165,
      image: '/books/radio-thoracique.jpg', featured: true, stockCount: 40,
      tableOfContents: '1. Bases techniques\n2. Sémiologie radiologique\n3. Syndromes parenchymateux\n4. Pathologies pleurales\n5. Cas cliniques commentés',
      author: 'Dr. Salmi', rating: 4.9, reviewsCount: 0,
    },
  ]

  for (const p of products) {
    const created = await prisma.product.upsert({ where: { slug: p.slug }, update: p as any, create: p as any })
    // seed reviews for first 3 products
    if (['pneumologie-resume-complet','gynecologie-essentiel','urologie-nephrologie-fiches-ecn'].includes(p.slug)) {
      const existing = await prisma.review.count({ where: { productId: created.id } })
      if (existing === 0) {
        await prisma.review.createMany({
          data: [
            { productId: created.id, name: 'Amira B. - Alger', stars: 5, comment: 'Résumé incroyable, clair et complet. A sauvé mon résidanat !', verified: true },
            { productId: created.id, name: 'Yacine M. - Oran', stars: 5, comment: 'Livraison 48h et qualité papier excellente.', verified: true },
            { productId: created.id, name: 'Sara K. - Constantine', stars: 4, comment: 'Très bon, quelques schémas à améliorer mais top.', verified: true },
          ]
        })
      }
    }
  }
  console.log(`✔ Seeded ${products.length} products`)

  // Promo codes
  await prisma.promoCode.upsert({ where: { code: 'SALMI10' }, update: { percent: 10, active: true }, create: { code: 'SALMI10', percent: 10, active: true } })
  await prisma.promoCode.upsert({ where: { code: 'RESIDANAT20' }, update: { percent: 20, active: true }, create: { code: 'RESIDANAT20', percent: 20, active: true } })
  console.log('✔ Promo codes: SALMI10 (-10%), RESIDANAT20 (-20%)')

  // Bundle example
  await prisma.bundle.upsert({
    where: { slug: 'pack-residanat-complet' },
    update: {},
    create: {
      title: 'Pack Résidanat Complet - 5 Livres',
      slug: 'pack-residanat-complet',
      description: 'Pneumologie + Gynécologie + Urologie + Dermatologie + ORL avec -25% vs achat séparé. Inclus PDF previews.',
      price: 9500,
      oldPrice: 12800,
      image: '/books/Pneumologie.jpg',
      active: true,
    }
  })
  console.log('✔ Bundle seeded')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
