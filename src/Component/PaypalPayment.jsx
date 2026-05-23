import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { usePaypalCreateOrderMutation, usePaypalCaptureOrderMutation } from "../api/paymentApi";

const PaypalPayment = ({ amount, orderId, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalError, setPaypalError] = useState("");

  const [createOrder] = usePaypalCreateOrderMutation();
  const [captureOrder] = usePaypalCaptureOrderMutation();

  const handleCreateOrder = async () => {
    setPaypalError("");
    setIsProcessing(true);

    try {
      const { data, error } = await createOrder({ amount, orderId });

      if (error) {
        throw new Error(error.data?.message || "Failed to create PayPal order");
      }

      return data?.paypalOrderId;
    } catch (err) {
      setPaypalError(err.message);
      onError?.(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async (data) => {
    setIsProcessing(true);
    setPaypalError("");

    try {
      const { data: captureData, error } = await captureOrder({
        paypalOrderId: data.orderID,
        orderId,
      });

      if (error) {
        throw new Error(error.data?.message || "Failed to capture PayPal payment");
      }

      onSuccess?.(captureData);
    } catch (err) {
      setPaypalError(err.message);
      onError?.(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (err) => {
    const message = err?.message || "PayPal encountered an error";
    setPaypalError(message);
    onError?.(message);
    setIsProcessing(false);
  };

  const handleCancel = () => {
    setPaypalError("Payment was cancelled.");
    setIsProcessing(false);
  };

  return (
    <div className="w-full">
      {/* Amount Display */}
      <div className="flex items-center justify-between bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 mb-5">
        <span className="text-sm font-medium text-yellow-800">Total to Pay</span>
        <span className="text-lg font-bold text-yellow-900">
          ${(amount / 100).toFixed(2)}
        </span>
      </div>

      {/* PayPal Buttons */}
      <div className="relative">
        {isProcessing && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span className="text-sm font-medium">Processing payment…</span>
            </div>
          </div>
        )}

        <PayPalScriptProvider
          options={{
            "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
            currency: "USD",
          }}
        >
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "pay",
              height: 48,
            }}
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            onError={handleError}
            onCancel={handleCancel}
            disabled={isProcessing}
          />
        </PayPalScriptProvider>
      </div>

      {/* Error Message */}
      {paypalError && (
        <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {paypalError}
        </div>
      )}

      {/* Security Note */}
      <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
        <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
        </svg>
        Your payment is secured by PayPal
      </div>
    </div>
  );
};

export default PaypalPayment;