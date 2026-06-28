import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Product from "../modules/product/product.model.js";

dotenv.config();

const UPLOADS_DIR = path.resolve("uploads");
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Turns "product 1.jpeg" into a readable name "Product 1"
 * and a URL-safe slug "product-1".
 */
const buildNameAndSlug = (filename) => {
  const base = path.basename(filename, path.extname(filename)); // "product 1"
  const cleanBase = base.trim().replace(/\s+/g, " ");

  const name = cleanBase
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "); // "Product 1"

  const slug = cleanBase
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, ""); // "product-1"

  return { name, slug };
};

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI not found in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");

    const files = fs
      .readdirSync(UPLOADS_DIR)
      .filter((file) => ALLOWED_EXT.includes(path.extname(file).toLowerCase()));

    if (files.length === 0) {
      console.log("No image files found in uploads/");
      return process.exit(0);
    }

    console.log(`Found ${files.length} images. Seeding products...`);

    let created = 0;
    let skipped = 0;

    for (const [index, filename] of files.entries()) {
      const { name, slug } = buildNameAndSlug(filename);

      const existing = await Product.findOne({ slug });
      if (existing) {
        console.log(`⏭️  Skipped "${slug}" (already exists)`);
        skipped++;
        continue;
      }

      const sku = `SKU-${Date.now()}-${index}`;

      await Product.create({
        name,
        slug,
        description: `${name} — placeholder description, edit me.`,
        price: 999, // placeholder price, edit later
        stock: 10,
        sku,
        category: "Uncategorized",
        images: [
          {
            url: `/uploads/${filename}`,
            filename,
            isPrimary: true,
            order: 0,
          },
        ],
      });

      console.log(`✅ Created product: ${name}`);
      created++;
    }

    console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
