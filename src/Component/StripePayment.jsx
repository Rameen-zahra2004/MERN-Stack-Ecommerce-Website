import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useStripeCreateIntentMutation, useStripeVerifyPaymentMutation } from "../api/paymentApi";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1f2937",
      fontFamily: "'Inter', sans-serif",
      "::placeholder": { color: "#9ca3af" },
      iconColor: "#6366f1",
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
};

const StripePayment = ({ amount, orderId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState("");

  const [createIntent] = useStripeCreateIntentMutation();
  const [verifyPayment] = useStripeVerifyPaymentMutation();

  const handleCardChange = (event) => {
    setCardError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setCardError("");

    try {
      // Step 1: Create payment intent on backend
      const { data: intentData, error: intentError } = await createIntent({
        amount,
        orderId,
      });

      if (intentError) {
        throw new Error(intentError.data?.message || "Failed to create payment intent");
      }

      const clientSecret = intentData?.clientSecret;

      // Step 2: Confirm card payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Step 3: Verify payment on backend
      const { data: verifyData, error: verifyError } = await verifyPayment({
        paymentIntentId: paymentIntent.id,
        orderId,
      });

      if (verifyError) {
        throw new Error(verifyError.data?.message || "Payment verification failed");
      }

      onSuccess?.(verifyData);
    } catch (err) {
      setCardError(err.message);
      onError?.(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Card Input */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-xl px-4 py-3.5 bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-200">
          <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardChange} />
        </div>
        {cardError && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {cardError}
          </p>
        )}
      </div>

      {/* Amount Display */}
      <div className="flex items-center justify-between bg-indigo-50 rounded-xl px-4 py-3 mb-5">
        <span className="text-sm font-medium text-indigo-700">Total to Pay</span>
        <span className="text-lg font-bold text-indigo-900">
          ${(amount / 100).toFixed(2)}
        </span>
      </div>

      {/* Security Badges */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
          SSL Secured
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Powered by Stripe
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Processing…
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Pay ${(amount / 100).toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
};

export default StripePayment;