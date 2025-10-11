'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking order status
    // In a real implementation, you might want to verify the session with your backend
    if (sessionId) {
      setTimeout(() => setLoading(false), 1000);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4">✕</div>
          <h1 className="text-2xl font-bold mb-4">Invalid Session</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find your order. Please check your email for confirmation.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-4">Order Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order is being processed.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 font-medium">
            Check your email for order confirmation and next steps.
          </p>
          <p className="text-xs text-blue-600 mt-2">
            For digital orders: Download links will be available in your dashboard shortly.
          </p>
        </div>
        <div className="space-y-3">
          <Link
            href="/dashboard/orders"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            View My Orders
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
