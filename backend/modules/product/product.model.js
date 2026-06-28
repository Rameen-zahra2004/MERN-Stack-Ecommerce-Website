// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },

//     slug: {
//       type: String,
//       unique: true,
//       index: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     comparePrice: {
//       type: Number,
//       default: 0,
//     },

//     stock: {
//       type: Number,
//       required: true,
//       min: 0,
//       default: 0,
//     },

//     sku: {
//       type: String,
//       unique: true,
//       index: true,
//     },

//     category: {
//       type: String,
//       index: true,
//     },

//     brand: {
//       type: String,
//       index: true,
//     },

//     images: [
//       {
//         type: String,
//       },
//     ],

//     ratings: {
//       average: {
//         type: Number,
//         default: 0,
//       },
//       count: {
//         type: Number,
//         default: 0,
//       },
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },

//     isFeatured: {
//       type: Boolean,
//       default: false,
//     },

//     tags: [
//       {
//         type: String,
//       },
//     ],
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   }
// );

// /*
// =========================
// INDEXES (PERFORMANCE)
// =========================
// */

// productSchema.index({
//   name: "text",
//   description: "text",
// });

// const Product = mongoose.model(
//   "Product",
//   productSchema
// );

// export default Product;
import mongoose from "mongoose";

/*
=========================
IMAGE SCHEMA
=========================
*/
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    filename: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: true },
);

/*
=========================
PRODUCT SCHEMA
=========================
*/
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    comparePrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    sku: {
      type: String,
      unique: true,
      index: true,
    },

    category: { type: String, index: true },
    brand: { type: String, index: true },

    images: [imageSchema],

    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    tags: [{ type: String }],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
