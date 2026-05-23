// import { configureStore } from "@reduxjs/toolkit";
// import productReducer from "../Slices/productSlice";
// import userReducer from "../AdminSlices/userSlice";
// import formReducer from "../Slices/formSlice";
// import signinReducer from "../Slices/signinSlice";
// import cartReducer from "../AdminSlices/cartSlice";
// import searchReducer from "../Slices/searchSlice";
// import dashboardReducer from "../Slices/dashBoardSlice";
// import revenueReducer from "../Slices/revenueSlice";
// import activeUsersReducer from "../Slices/activeuserSlice";
// import commentsReducer from "../Slices/commentSlice";
// import adminProductReducer from "../AdminSlices/productmanagmentSlice";

// import systemReducer from "../AdminSlices/systemSlice";
// import exportReducer from "../AdminSlices/exportdeleteSlice";
// import profileReducer from "../AdminSlices/profileSlice";
// import rolesReducer from "../AdminSlices/rolesSlice";
// import activityReducer from "../AdminSlices/activitySlice";
// import securityReducer from "../AdminSlices/securitySlice";
// import themeReducer from "../AdminSlices/themeSlice";
// import loginsReducer from "../AdminSlices/adminLoginSlice";
// import orderDetailReducer from "../Slices/orderSlice";
// import userSettingsReducer from "../Slices/userSettingSlice";
// import wishListReducer from "../Slices/wishListSlice";
// export default configureStore({
//   reducer: {
//     products: productReducer,
//     user: userReducer,
//     form: formReducer,
//     signinuser: signinReducer,
//     cart: cartReducer,
//     search: searchReducer,
//     dashboard: dashboardReducer,
//     revenue: revenueReducer,
//     activeUsers: activeUsersReducer,
//     comments: commentsReducer,
//     adminProducts: adminProductReducer,

//     system: systemReducer,
//     export: exportReducer,
//     profile: profileReducer,
//     roles: rolesReducer,
//     activity: activityReducer,
//     security: securityReducer,
//     theme: themeReducer,
//     logins: loginsReducer,
//     orderDetail: orderDetailReducer,
//     userSettings: userSettingsReducer,
//     wishlist: wishListReducer,
//   },
// });
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../Slices/productSlice";
import userReducer from "../AdminSlices/userSlice";
import formReducer from "../Slices/formSlice";
import signinReducer from "../Slices/signinSlice";
import cartReducer from "../AdminSlices/cartSlice";
import searchReducer from "../Slices/searchSlice";
import dashboardReducer from "../Slices/dashBoardSlice";
import revenueReducer from "../Slices/revenueSlice";
import activeUsersReducer from "../Slices/activeuserSlice";
import commentsReducer from "../Slices/commentSlice";
import adminProductReducer from "../AdminSlices/productmanagmentSlice";
import systemReducer from "../AdminSlices/systemSlice";
import exportReducer from "../AdminSlices/exportdeleteSlice";
import profileReducer from "../AdminSlices/profileSlice";
import rolesReducer from "../AdminSlices/rolesSlice";
import activityReducer from "../AdminSlices/activitySlice";
import securityReducer from "../AdminSlices/securitySlice";
import themeReducer from "../AdminSlices/themeSlice";
import loginsReducer from "../AdminSlices/adminLoginSlice";
import orderDetailReducer from "../Slices/orderSlice";
import userSettingsReducer from "../Slices/userSettingSlice";
import wishListReducer from "../Slices/wishListSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    user: userReducer,
    form: formReducer,
    signinuser: signinReducer,
    cart: cartReducer,
    search: searchReducer,
    dashboard: dashboardReducer,
    revenue: revenueReducer,
    activeUsers: activeUsersReducer,
    comments: commentsReducer,
    adminProducts: adminProductReducer,
    system: systemReducer,
    export: exportReducer,
    profile: profileReducer,
    roles: rolesReducer,
    activity: activityReducer,
    security: securityReducer,
    theme: themeReducer,
    logins: loginsReducer,
    orderDetail: orderDetailReducer,
    userSettings: userSettingsReducer,
    wishlist: wishListReducer,
  },
});

export default store;