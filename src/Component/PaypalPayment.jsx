import { useState, useEffect } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import {
  usePaypalCreateOrderMutation,
  usePaypalCaptureOrderMutation,
} from "../api/paymentApi";

const PaypalPayment = ({ amount, orderId, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalError, setPaypalError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [retryKey, setRetryKey] = useState(0); // forces PayPalButtons remount on retry

  const [createOrder] = usePaypalCreateOrderMutation();
  const [captureOrder] = usePaypalCaptureOrderMutation();

  useEffect(() => {
    setPaypalError("");
  }, [amount, orderId]);

  const isAmountValid = Number.isFinite(amount) && amount > 0;
  const isReady = isAmountValid && !!orderId;

  const handleCreateOrder = async () => {
    if (!isReady) {
      const msg = !orderId
        ? "Missing order reference. Please refresh and try again."
        : "Invalid order amount.";
      setPaypalError(msg);
      onError?.(msg);
      throw new Error(msg);
    }

    setPaypalError("");
    setIsProcessing(true);

    try {
      const { data, error } = await createOrder({ amount, orderId });

      if (error) {
        throw new Error(
          error.data?.message ||
            error.message ||
            "Failed to create PayPal order. Please try again.",
        );
      }

      if (!data?.paypalOrderId) {
        throw new Error("PayPal did not return a valid order ID.");
      }

      return data.paypalOrderId;
    } catch (err) {
      const message =
        err.message || "Network error — please check your connection.";
      setPaypalError(message);
      onError?.(message);
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
        throw new Error(
          error.data?.message ||
            error.message ||
            "Payment could not be captured. You have not been charged — please try again.",
        );
      }

      // Defensive check: backend should confirm capture succeeded
      if (
        captureData?.status &&
        captureData.status !== "COMPLETED" &&
        captureData.status !== "success"
      ) {
        throw new Error(
          "Payment was not completed. Please try again or use another method.",
        );
      }

      setIsComplete(true);
      onSuccess?.(captureData);
    } catch (err) {
      setPaypalError(err.message);
      onError?.(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (err) => {
    const message = err?.message?.includes("popup")
      ? "The PayPal window was blocked or closed. Please allow popups and try again."
      : err?.message || "PayPal encountered an unexpected error.";
    setPaypalError(message);
    onError?.(message);
    setIsProcessing(false);
  };

  const handleCancel = () => {
    setPaypalError(
      "Payment was cancelled before completion. You have not been charged.",
    );
    setIsProcessing(false);
  };

  const handleRetry = () => {
    setPaypalError("");
    setRetryKey((k) => k + 1);
  };

  // ── Success state ──
  if (isComplete) {
    return (
      <div className="w-full text-center py-6">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pink-100 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-pink-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="font-semibold text-gray-800">Payment Successful</p>
        <p className="text-sm text-gray-500 mt-1">Thank you for your order!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Amount Display */}
      <div className="flex items-center justify-between bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 mb-5">
        <span className="text-sm font-medium text-pink-700">Total to Pay</span>
        <span className="text-lg font-bold text-pink-700">
          {isAmountValid ? `$${(amount / 100).toFixed(2)}` : "—"}
        </span>
      </div>

      {/* Block payment entirely if amount/order is invalid */}
      {!isReady ? (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl px-4 py-3">
          {!orderId
            ? "We couldn't find your order. Please go back to your cart and try again."
            : "Your order total looks invalid. Please refresh the page."}
        </div>
      ) : (
        <>
          {/* PayPal Buttons */}
          <div className="relative bg-white border border-pink-100 rounded-xl p-3 shadow-sm shadow-pink-100 min-h-[52px]">
            {isProcessing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                <div className="flex items-center gap-2 text-pink-600">
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Processing payment…
                  </span>
                </div>
              </div>
            )}

            <PayPalScriptProvider
              options={{
                "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                currency: "USD",
                intent: "capture",
              }}
            >
              <PayPalButtons
                key={retryKey}
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
                forceReRender={[amount, orderId]}
              />
            </PayPalScriptProvider>
          </div>

          {/* Error Message + Retry */}
          {paypalError && (
            <div className="mt-3 flex items-start gap-2 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl px-4 py-3">
              <svg
                className="w-4 h-4 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p>{paypalError}</p>
                <button
                  onClick={handleRetry}
                  className="mt-1 font-medium text-rose-700 hover:text-rose-800 underline text-xs"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Security Note */}
      <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
        <svg
          className="w-3.5 h-3.5 text-pink-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        Your payment is secured by PayPal
      </div>
    </div>
  );
};

export default PaypalPayment;
