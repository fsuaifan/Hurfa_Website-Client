// src/data/productsData.js
// Mock / dummy data for furniture and catalog products until backend database is integrated

export const CATALOG_PRODUCTS = [
  {
    id: "tayf-kitchen-set",
    name: "Tayf Kitchen Set",
    category: "Kitchens",
    price: "JOD 1,450",
    priceNumber: 1450,
    desc: "A minimalist matte kitchen system with integrated handles and soft-close cabinetry.",
    images: [
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843",
      "https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060",
    ],
  },
  {
    id: "oud-collection-sofa",
    name: "Oud Collection Sofa",
    category: "Living Room",
    price: "JOD 680",
    priceNumber: 680,
    desc: "A boucle three-seat sofa with a solid oak frame, part of the Oud living collection.",
    images: [
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278",
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280",
    ],
  },
  {
    id: "wesal-bed-frame",
    name: "Wesal Bed Frame",
    category: "Bedrooms",
    price: "JOD 310",
    priceNumber: 310,
    desc: "Upholstered headboard with a low-profile walnut frame, built for a queen or king mattress.",
    images: [
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280",
      "https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060",
    ],
  },
  {
    id: "kitchen-island-v4",
    name: "Kitchen Island V4",
    category: "Kitchens",
    price: "JOD 1,980",
    priceNumber: 1980,
    desc: "A freestanding kitchen island in warm oak veneer with a honed stone worktop.",
    images: [
      "https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060",
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843",
    ],
  },
  {
    id: "wardrobe-oak",
    name: "Wardrobe — Oak",
    category: "Bedrooms",
    price: "JOD 420",
    priceNumber: 420,
    desc: "A full-height wardrobe in solid oak with soft-close doors and adjustable shelving.",
    images: [
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843",
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278",
    ],
  },
  {
    id: "dresser-six-drawer",
    name: "Dresser — Six Drawer",
    category: "Bedrooms",
    price: "JOD 265",
    priceNumber: 265,
    desc: "A six-drawer dresser with brushed brass hardware and durable protective finish.",
    images: [
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278",
      "https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060",
    ],
  },
];

export const PREMIUM_COLLECTIONS = [
  {
    id: "the-oud-collection",
    name: "The Oud Collection",
    category: "Living Room",
    price: "JOD 2,400",
    desc: "A signature living-room collection built around solid oak framing, subtle warm curves, and boucle upholstery.",
    image: "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278",
  },
  {
    id: "the-wesal-collection",
    name: "The Wesal Collection",
    category: "Bedrooms",
    price: "JOD 1,980",
    desc: "A bedroom collection defined by low-profile walnut woodwork, soft textiles, and serene minimalist balance.",
    image: "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280",
  },
];
