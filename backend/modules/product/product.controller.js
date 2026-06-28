// import {
//   createProductService,
//   deleteProductService,
//   getProductService,
//   getProductsService,
//   updateProductService,
// } from "./productService.js";

// import {
//   createProductValidation,
// } from "./product.validation.js";

// import {
//   PRODUCT_MESSAGES,
// } from "./product.constants.js";

// /*
// =========================
// CREATE PRODUCT
// =========================
// */

// export const createProductController =
//   async (req, res, next) => {
//     try {
//       const { error, value } =
//         createProductValidation.validate(
//           req.body,
//           {
//             abortEarly: false,
//           }
//         );

//       if (error) {
//         return res.status(400).json({
//           success: false,
//           errors: error.details.map(
//             (e) => e.message
//           ),
//         });
//       }

//       const result =
//         await createProductService(
//           value
//         );

//       return res.status(201).json({
//         success: true,
//         message:
//           PRODUCT_MESSAGES.CREATE_SUCCESS,
//         data: result,
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

// /*
// =========================
// GET ALL PRODUCTS
// =========================
// */

// export const getProductsController =
//   async (req, res, next) => {
//     try {
//       const result =
//         await getProductsService(
//           req.query
//         );

//       return res.status(200).json({
//         success: true,
//         message:
//           PRODUCT_MESSAGES.FETCH_SUCCESS,
//         data: result,
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

// /*
// =========================
// GET SINGLE PRODUCT
// =========================
// */

// export const getProductController =
//   async (req, res, next) => {
//     try {
//       const result =
//         await getProductService(
//           req.params.id
//         );

//       return res.status(200).json({
//         success: true,
//         data: result,
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

// /*
// =========================
// UPDATE PRODUCT
// =========================
// */

// export const updateProductController =
//   async (req, res, next) => {
//     try {
//       const result =
//         await updateProductService(
//           req.params.id,
//           req.body
//         );

//       return res.status(200).json({
//         success: true,
//         message:
//           PRODUCT_MESSAGES.UPDATE_SUCCESS,
//         data: result,
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

// /*
// =========================
// DELETE PRODUCT
// =========================
// */

// export const deleteProductController =
//   async (req, res, next) => {
//     try {
//       const result =
//         await deleteProductService(
//           req.params.id
//         );

//       return res.status(200).json({
//         success: true,
//         message:
//           PRODUCT_MESSAGES.DELETE_SUCCESS,
//         data: result,
//       });
//     } catch (error) {
//       next(error);
//     }
//   };
import {
  createProductService,
  deleteProductService,
  getProductService,
  getProductsService,
  updateProductService,
} from "./productService.js";

import { createProductValidation } from "./product.validation.js";
import { PRODUCT_MESSAGES } from "./product.constants.js";

/*
=========================
CREATE PRODUCT
=========================
*/
export const createProductController = async (req, res, next) => {
  try {
    const { error, value } = createProductValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }

    const result = await createProductService(value);

    return res.status(201).json({
      success: true,
      message: PRODUCT_MESSAGES.CREATE_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
=========================
GET ALL PRODUCTS
=========================
*/
export const getProductsController = async (req, res, next) => {
  try {
    const result = await getProductsService(req.query);

    return res.status(200).json({
      success: true,
      message: PRODUCT_MESSAGES.FETCH_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
=========================
GET SINGLE PRODUCT
=========================
*/
export const getProductController = async (req, res, next) => {
  try {
    const result = await getProductService(req.params.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
=========================
UPDATE PRODUCT
=========================
*/
export const updateProductController = async (req, res, next) => {
  try {
    const result = await updateProductService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: PRODUCT_MESSAGES.UPDATE_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
=========================
DELETE PRODUCT
=========================
*/
export const deleteProductController = async (req, res, next) => {
  try {
    const result = await deleteProductService(req.params.id);

    return res.status(200).json({
      success: true,
      message: PRODUCT_MESSAGES.DELETE_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
