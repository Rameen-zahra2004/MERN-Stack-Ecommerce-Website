import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/payment",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({

    stripeCreateIntent: builder.mutation({
      query: (body) => ({
        url: "/stripe/intent",
        method: "POST",
        body,
      }),
    }),

    stripeVerifyPayment: builder.mutation({
      query: (body) => ({
        url: "/stripe/verify",
        method: "POST",
        body,
      }),
    }),

    stripeRefund: builder.mutation({
      query: (body) => ({
        url: "/stripe/refund",
        method: "POST",
        body,
      }),
    }),


    paypalCreateOrder: builder.mutation({
      query: (body) => ({
        url: "/paypal/create",
        method: "POST",
        body,
      }),
    }),

    paypalCaptureOrder: builder.mutation({
      query: (body) => ({
        url: "/paypal/capture",
        method: "POST",
        body,
      }),
    }),

    paypalRefund: builder.mutation({
      query: (body) => ({
        url: "/paypal/refund",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useStripeCreateIntentMutation,
  useStripeVerifyPaymentMutation,
  useStripeRefundMutation,
  usePaypalCreateOrderMutation,
  usePaypalCaptureOrderMutation,
  usePaypalRefundMutation,
} = paymentApi;