// src/data/kitchensData.js
// Mock / dummy data for kitchen collections until backend database is integrated

export const KITCHEN_MODELS = [
  {
    id: "chic",
    title: "Chic",
    eyebrow: "Model",
    tagline: "High-contrast finishes and clean hardware.",
    desc: "A bold, statement kitchen — high-contrast finishes and clean hardware for a space that stands out.",
    mainImage: "https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060",
    variations: [
      "https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060",
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280",
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843",
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278",
    ],
    details: [
      {
        title: "Cabinetry",
        copy: "Soft-close hinges and hand-finished panel work, built to hold up to daily use without losing its edge.",
        image: "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280",
      },
      {
        title: "Surfaces",
        copy: "Countertop and backsplash materials chosen to match the tone of the model, with finishes that resist heat and stains.",
        image: "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843",
      },
    ],
  },
  {
    id: "organic",
    title: "Organic Modern",
    eyebrow: "Model",
    tagline: "Warm, natural materials and soft lines.",
    desc: "Warm, natural materials and soft lines — a kitchen that feels grounded and lived-in without giving up a modern edge.",
    mainImage: "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280",
    variations: [
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280",
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278",
      "https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060",
    ],
    details: [
      {
        title: "Cabinetry",
        copy: "Constructed with natural wood grain panels, moisture-resistant sealing, and integrated push-to-open latches.",
        image: "https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060",
      },
      {
        title: "Surfaces",
        copy: "Honed natural stone countertops with matching waterfall edges for an unbroken, organic kitchen flow.",
        image: "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278",
      },
    ],
  },
  {
    id: "contemporary",
    title: "Contemporary",
    eyebrow: "Model",
    tagline: "Minimal handles, flat panels, and a restrained palette.",
    desc: "Minimal handles, flat panels, and a restrained palette — built for a clean, uncluttered everyday kitchen.",
    mainImage: "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843",
    variations: [
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843",
      "https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060",
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278",
      "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280",
    ],
    details: [
      {
        title: "Cabinetry",
        copy: "Architectural matte lacquer surfaces with seamless laser edge-banding that repels fingerprints and spills.",
        image: "https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280",
      },
      {
        title: "Surfaces",
        copy: "Ultra-compact sintered porcelain counters engineered to withstand extreme heat, knife marks, and heavy daily cooking.",
        image: "https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060",
      },
    ],
  },
];

// Dictionary mapped by ID for fast lookup by modelId param
export const KITCHEN_MODELS_DATA = KITCHEN_MODELS.reduce((acc, model) => {
  acc[model.id] = model;
  return acc;
}, {});
