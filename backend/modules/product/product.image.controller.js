// import Product from "./product.model.js";

// /*
// =========================
// UPLOAD IMAGES
// =========================
// */
// export const uploadProductImagesController = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const product = await Product.findById(id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No images uploaded",
//       });
//     }

//     const images = req.files.map((file, index) => ({
//       url: `/uploads/${file.filename}`,
//       filename: file.filename,
//       mimeType: file.mimetype,
//       size: file.size,
//       isPrimary: product.images.length === 0 && index === 0,
//       order: product.images.length + index,
//     }));

//     product.images.push(...images);

//     await product.save();

//     res.status(200).json({
//       success: true,
//       message: "Images uploaded successfully",
//       data: product,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /*
// =========================
// DELETE IMAGE
// =========================
// */
// export const deleteProductImageController = async (req, res, next) => {
//   try {
//     const { id, imageId } = req.params;

//     const product = await Product.findById(id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     const imageIndex = product.images.findIndex(
//       (img) => img._id.toString() === imageId,
//     );

//     if (imageIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "Image not found",
//       });
//     }

//     const removed = product.images[imageIndex];

//     product.images.splice(imageIndex, 1);

//     if (removed.isPrimary && product.images.length > 0) {
//       product.images[0].isPrimary = true;
//     }

//     await product.save();

//     res.status(200).json({
//       success: true,
//       message: "Image deleted successfully",
//       data: product,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /*
// =========================
// REORDER IMAGES
// =========================
// */
// export const reorderProductImagesController = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { order } = req.body; // array of image IDs

//     const product = await Product.findById(id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     product.images.sort(
//       (a, b) =>
//         order.indexOf(a._id.toString()) - order.indexOf(b._id.toString()),
//     );

//     product.images.forEach((img, index) => {
//       img.order = index;
//     });

//     await product.save();

//     res.status(200).json({
//       success: true,
//       message: "Images reordered successfully",
//       data: product,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
import fs from "fs";
import path from "path";
import Product from "./product.model.js";
import { MAX_IMAGES_PER_PRODUCT } from "../../middleware/upload.js";

const UPLOADS_DIR = path.resolve("uploads");

/*
=========================
UPLOAD IMAGES
=========================
*/
export const uploadProductImagesController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    if (product.images.length + req.files.length > MAX_IMAGES_PER_PRODUCT) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${MAX_IMAGES_PER_PRODUCT} images allowed per product. This product already has ${product.images.length}.`,
      });
    }

    const images = req.files.map((file, index) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      isPrimary: product.images.length === 0 && index === 0,
      order: product.images.length + index,
    }));

    product.images.push(...images);
    try {
      await product.save();
    } catch (saveError) {
      // Clean up files that were written to disk but couldn't be saved to DB
      await Promise.allSettled(
        req.files.map((file) =>
          fs.promises.unlink(path.join(UPLOADS_DIR, file.filename)),
        ),
      );
      throw saveError; // re-throw so next(error) sends the response
    }

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/*
=========================
DELETE IMAGE
=========================
*/
export const deleteProductImageController = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const imageIndex = product.images.findIndex(
      (img) => img._id.toString() === imageId,
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const removed = product.images[imageIndex];

    product.images.splice(imageIndex, 1);

    if (removed.isPrimary && product.images.length > 0) {
      product.images[0].isPrimary = true;
    }

    await product.save();

    const filePath = path.join(UPLOADS_DIR, removed.filename);
    fs.promises.unlink(filePath).catch((err) => {
      if (err.code !== "ENOENT") {
        console.warn(`⚠️  Failed to delete file: ${filePath}`, err.message);
      }
    });

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/*
=========================
REORDER IMAGES
=========================
*/
export const reorderProductImagesController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const currentIds = product.images.map((img) => img._id.toString());

    if (!Array.isArray(order) || order.length !== currentIds.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid order array — must include all current image IDs",
      });
    }

    const isValidOrder = order.every((imgId) => currentIds.includes(imgId));

    if (!isValidOrder) {
      return res.status(400).json({
        success: false,
        message: "Order array contains unknown image IDs",
      });
    }

    product.images.sort(
      (a, b) =>
        order.indexOf(a._id.toString()) - order.indexOf(b._id.toString()),
    );

    product.images.forEach((img, index) => {
      img.order = index;
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: "Images reordered successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
