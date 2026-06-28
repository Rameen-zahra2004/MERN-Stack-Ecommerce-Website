import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../modules/product/product.model.js";

dotenv.config();

/**
 * Maps existing slugs (created during image seeding) to polished
 * boutique-style product details.
 */
const PRODUCT_DETAILS = {
  "product-1": {
    name: "Fluffy Lip Care Set",
    description:
      "A dreamy lip care gift set featuring a moisturizing lip balm, an adorable plush keychain, and a mini makeup palette — wrapped in soft pastel packaging perfect for gifting or treating yourself.",
  },
  "product-4": {
    name: "Pastel Charm Pouch",
    description:
      "A delicate accessory pouch crafted in soft pastel tones, designed to keep your daily essentials organized while adding a touch of boutique elegance to your bag.",
  },
  "product-5": {
    name: "Glow Getter Beauty Kit",
    description:
      "Everything you need for a radiant glow — a curated beauty essentials kit packed with skincare and makeup must-haves in adorable boutique packaging.",
  },
  "product-6": {
    name: "Sparkle Hair Accessory Set",
    description:
      "A charming set of hair clips and accessories that add a sparkle of personality to any hairstyle — perfect for everyday wear or special occasions.",
  },
  "product-7": {
    name: "Mini Makeup Treasure Box",
    description:
      "A compact treasure box filled with mini makeup essentials, designed for on-the-go touch-ups without compromising on style.",
  },
  "product-8": {
    name: "Cute Keychain Collection",
    description:
      "An irresistibly cute keychain collection that turns your everyday keys into a fashion statement — soft, sweet, and full of personality.",
  },
  "product-9": {
    name: "Boutique Jewelry Set",
    description:
      "An elegant jewelry set featuring delicate pieces designed to complement any outfit, bringing a refined boutique touch to your everyday look.",
  },
  "product-11": {
    name: "Dreamy Nail Art Kit",
    description:
      "A complete nail art kit with vibrant colors and tiny embellishments, designed for anyone who loves expressing creativity at their fingertips.",
  },
  "product-12": {
    name: "Soft Glow Skincare Duo",
    description:
      "A gentle skincare duo formulated to nourish and refresh your skin, leaving behind a natural, soft glow you'll love.",
  },
  "product-13": {
    name: "Whimsical Bow Hair Clip",
    description:
      "A charming bow-shaped hair clip that adds a whimsical, feminine touch to any hairstyle — simple, sweet, and effortlessly stylish.",
  },
  "product-16": {
    name: "Boutique Tote Bag",
    description:
      "A spacious yet stylish tote bag designed for everyday use, blending function with boutique-level aesthetics for life on the move.",
  },
  "product-18": {
    name: "Sweetheart Cosmetic Pouch",
    description:
      "A sweet little cosmetic pouch designed to organize your beauty essentials in style, making every makeup bag a little more delightful.",
  },
  "product-19": {
    name: "Charm Bracelet Set",
    description:
      "A delicate charm bracelet set featuring intricate detailing, perfect for layering or wearing solo as a subtle statement piece.",
  },
  "product-20": {
    name: "Glow Up Skincare Bundle",
    description:
      "A thoughtfully curated skincare bundle designed to elevate your self-care routine and leave your skin feeling refreshed and radiant.",
  },
  "product-21": {
    name: "Boutique Scrunchie Set",
    description:
      "A soft, stylish set of scrunchies crafted from premium fabric, gentle on hair while adding a pop of boutique charm to your look.",
  },
  product17: {
    name: "Elegant Earring Collection",
    description:
      "A graceful earring collection featuring versatile designs that transition effortlessly from casual days to elegant evenings.",
  },
  "produt-10": {
    name: "Cozy Self-Care Gift Box",
    description:
      "A cozy self-care gift box filled with thoughtfully selected items, designed to bring comfort and a little luxury to everyday moments.",
  },
  // --- Add these to your existing PRODUCT_DETAILS object ---

  "product-16jpeg77777777": {
    name: "Limited Edition Glow Set",
    description:
      "A limited edition glow set featuring an exclusive mix of skincare and beauty essentials, crafted for those who love something a little extra special.",
  },
  "product-337": {
    name: "Velvet Touch Cosmetic Set",
    description:
      "A velvet-soft cosmetic set designed for everyday glam, blending rich texture with boutique-level finishing for a flawless touch.",
  },
  "product-339": {
    name: "Pearl Shine Jewelry Box",
    description:
      "An elegant jewelry box adorned with pearl-inspired detailing, perfect for storing and showcasing your favorite delicate pieces.",
  },
  "product-3333": {
    name: "Twinkle Star Hair Pins",
    description:
      "A set of star-shaped hair pins that add a subtle sparkle to any hairstyle, perfect for both everyday wear and special occasions.",
  },
  "product-50000": {
    name: "Royal Blossom Perfume Set",
    description:
      "A royal-inspired perfume set featuring delicate floral notes in elegant boutique packaging, perfect for gifting or personal indulgence.",
  },
  "product-409999": {
    name: "Silk Touch Makeup Brush Set",
    description:
      "A silky-soft makeup brush set designed for flawless application, combining premium bristles with a chic boutique aesthetic.",
  },
  "product-3399999": {
    name: "Crystal Charm Anklet",
    description:
      "A delicate crystal-embellished anklet that adds a touch of sparkle to any summer outfit, designed for effortless boutique style.",
  },
  product17: {
    name: "Golden Hour Lipgloss Duo",
    description:
      "A duo of shimmering lipglosses inspired by golden hour tones, designed to give your lips a soft, radiant glow.",
  },
  product334: {
    name: "Petal Soft Hand Cream Set",
    description:
      "A petal-soft hand cream set infused with gentle, nourishing ingredients — a small luxury for everyday self-care.",
  },
  product336: {
    name: "Shimmer Eyeshadow Palette",
    description:
      "A versatile shimmer eyeshadow palette featuring boutique-curated shades for both subtle daytime looks and glamorous evenings.",
  },
  product40000: {
    name: "Blossom Scented Candle",
    description:
      "A delicately scented candle with soft floral notes, designed to bring a cozy, boutique-inspired ambiance to any space.",
  },
  product66666: {
    name: "Mini Charm Necklace Set",
    description:
      "A set of mini charm necklaces designed for layering, adding a playful yet elegant touch to any outfit.",
  },
  product677777: {
    name: "Satin Ribbon Scrunchie Pack",
    description:
      "A pack of satin ribbon scrunchies offering a smooth, gentle hold while adding a refined boutique touch to your hairstyle.",
  },
  productt7777888: {
    name: "Glow Essence Face Mist",
    description:
      "A refreshing face mist infused with glow-boosting essence, perfect for an instant midday pick-me-up.",
  },
  productt88888888888888: {
    name: "Boutique Signature Gift Set",
    description:
      "Our signature boutique gift set, combining a curated mix of bestsellers — the perfect introduction to our brand for any beauty lover.",
  },
  "produt-10": {
    name: "Cozy Self-Care Gift Box",
    description:
      "A cozy self-care gift box filled with thoughtfully selected items, designed to bring comfort and a little luxury to everyday moments.",
  },
};

const updateProducts = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI not found in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");

    let updated = 0;
    let notFound = 0;

    for (const [slug, details] of Object.entries(PRODUCT_DETAILS)) {
      const result = await Product.findOneAndUpdate(
        { slug },
        {
          name: details.name,
          description: details.description,
          price: 999,
        },
        { new: true },
      );

      if (result) {
        console.log(`✅ Updated "${slug}" → ${details.name}`);
        updated++;
      } else {
        console.log(`⚠️  No product found with slug "${slug}"`);
        notFound++;
      }
    }

    console.log(`\nDone. Updated: ${updated}, Not found: ${notFound}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Update failed:", err.message);
    process.exit(1);
  }
};

updateProducts();
