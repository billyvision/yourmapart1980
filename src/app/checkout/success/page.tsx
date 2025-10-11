'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, Package, Mail, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  variationSelections: Record<string, string>;
  templateRef: {
    templateData?: Record<string, unknown>;
  } | null;
}

interface OrderDetails {
  orderId: number;
  orderNumber: string;
  email: string;
  status: string;
  fulfillmentType: string;
  hasDigitalItems: boolean;
  items: OrderItem[];
}

interface RenderProgress {
  total: number;
  completed: number;
  current: string;
  errors: string[];
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [renderProgress, setRenderProgress] = useState<RenderProgress | null>(null);
  const [renderComplete, setRenderComplete] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    // Trigger rendering after order details are loaded
    if (orderDetails && orderDetails.hasDigitalItems && orderDetails.status === 'paid') {
      triggerClientSideRendering();
    }
  }, [orderDetails]);

  async function fetchOrderDetails() {
    try {
      const response = await fetch(`/api/orders/by-session?session_id=${sessionId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrderDetails(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setLoading(false);
    }
  }

  async function triggerClientSideRendering() {
    if (!orderDetails) return;

    try {
      // Count total files to render
      const itemsWithTemplates = orderDetails.items.filter(
        (item) => item.templateRef?.templateData != null
      );

      if (itemsWithTemplates.length === 0) {
        setRenderComplete(true);
        return;
      }

      // Calculate total renders (each item may have multiple formats)
      let totalRenders = 0;
      itemsWithTemplates.forEach((item) => {
        const formats = getFormatsForItem(item.variationSelections);
        totalRenders += formats.length;
      });

      setRenderProgress({
        total: totalRenders,
        completed: 0,
        current: 'Starting rendering...',
        errors: [],
      });

      let completed = 0;
      const errors: string[] = [];

      // Render each item
      for (const item of itemsWithTemplates) {
        const formats = getFormatsForItem(item.variationSelections);

        for (const format of formats) {
          try {
            setRenderProgress((prev) => prev ? {
              ...prev,
              current: `Rendering ${item.productName} (${format.toUpperCase()})...`,
            } : null);

            // Render and upload
            await renderAndUploadItem({
              orderNumber: orderDetails.orderNumber,
              orderId: orderDetails.orderId,
              orderItemId: item.id,
              productName: item.productName,
              templateData: item.templateRef!.templateData!,
              format,
            });

            completed++;
            setRenderProgress((prev) => prev ? {
              ...prev,
              completed,
              current: `Rendered ${item.productName} (${format.toUpperCase()})`,
            } : null);
          } catch (error) {
            const errorMsg = `Failed to render ${item.productName} (${format}): ${
              error instanceof Error ? error.message : 'Unknown error'
            }`;
            console.error(errorMsg);
            errors.push(errorMsg);
            completed++;
            setRenderProgress((prev) => prev ? {
              ...prev,
              completed,
              errors: [...prev.errors, errorMsg],
            } : null);
          }
        }
      }

      setRenderComplete(true);

      if (errors.length > 0) {
        setRenderError(`Some files failed to render: ${errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Error during rendering:', error);
      setRenderError(error instanceof Error ? error.message : 'Unknown error');
      setRenderComplete(true);
    }
  }

  function getFormatsForItem(variationSelections: Record<string, string>): string[] {
    const formatVariation = variationSelections.format || variationSelections.fileFormat;

    if (formatVariation) {
      const formatLower = formatVariation.toLowerCase();
      if (formatLower === 'pdf') return ['pdf'];
      if (formatLower === 'png') return ['png'];
      if (formatLower === 'jpg' || formatLower === 'jpeg') return ['jpg'];
      if (formatLower === 'both' || formatLower === 'pdf+png') return ['pdf', 'png'];
    }

    // Default: PDF
    return ['pdf'];
  }

  async function renderAndUploadItem(params: {
    orderNumber: string;
    orderId: number;
    orderItemId: number;
    productName: string;
    templateData: Record<string, unknown>;
    format: string;
  }) {
    const { orderNumber, orderId, orderItemId, productName, templateData, format } = params;

    // NOTE: This is a simplified placeholder for the actual rendering logic
    // In production, you would:
    // 1. Dynamically import the MPG export modules
    // 2. Create an off-screen container
    // 3. Render the Konva stage with the template data
    // 4. Export to blob using stage.toDataURL() and dataURLToBlob()
    // 5. Upload the blob

    // For now, create a minimal placeholder to demonstrate the flow
    // This should be replaced with actual MPG rendering
    const blob = await createPlaceholderBlob(format, productName);

    // Upload to API
    const formData = new FormData();
    formData.append('file', blob, `${orderNumber}-${orderItemId}-${productName}.${format}`);
    formData.append('orderItemId', orderItemId.toString());
    formData.append('format', format);
    formData.append('orderNumber', orderNumber);

    const response = await fetch(`/api/orders/${orderId}/render-upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    return await response.json();
  }

  async function createPlaceholderBlob(format: string, productName: string): Promise<Blob> {
    // TODO: Replace with actual MPG rendering
    // This is a placeholder that creates a minimal file

    if (format === 'pdf') {
      // Minimal PDF
      const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>
endobj
5 0 obj
<< /Length 60 >>
stream
BT
/F1 24 Tf
100 700 Td
(${productName}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000214 00000 n
0000000304 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
423
%%EOF`;
      return new Blob([pdfContent], { type: 'application/pdf' });
    } else {
      // Minimal PNG (1x1 transparent pixel)
      const pngDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const response = await fetch(pngDataUrl);
      return await response.blob();
    }
  }

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

  const hasDigitalItems = orderDetails?.hasDigitalItems || false;
  const isRendering = renderProgress && !renderComplete;
  const renderFailed = renderComplete && renderError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-2xl w-full mx-4">
        <div className="border rounded-lg p-8 text-center bg-card">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          {/* Order Details */}
          {orderDetails && (
            <div className="border rounded-lg p-6 mb-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-mono font-semibold">{orderDetails.orderNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Confirmation Sent To</p>
                    <p className="font-semibold">{orderDetails.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rendering Progress */}
          {isRendering && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6 text-left">
              <div className="flex items-start gap-3 mb-4">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 animate-spin" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Generating Your Files...
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    {renderProgress.current}
                  </p>
                  <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(renderProgress.completed / renderProgress.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {renderProgress.completed} of {renderProgress.total} files completed
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Render Complete */}
          {renderComplete && !renderFailed && hasDigitalItems && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Files Ready for Download!
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    All your files have been generated and are ready to download.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Render Error */}
          {renderFailed && (
            <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-6 text-left">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    Processing Issues
                  </h3>
                  <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
                    Some files couldn't be generated automatically. Don't worry - our team will process them manually and notify you when they're ready.
                  </p>
                  {renderProgress && renderProgress.errors.length > 0 && (
                    <details className="text-xs text-orange-700 dark:text-orange-300 mt-2">
                      <summary className="cursor-pointer">Technical details</summary>
                      <ul className="list-disc list-inside mt-1">
                        {renderProgress.errors.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Email Confirmation Notice */}
          <div className="bg-muted/50 border rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">
              <strong>Check your email</strong> for order confirmation and detailed information about your purchase.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {orderDetails && renderComplete && (
              <Button asChild className="w-full" size="lg">
                <Link href={`/dashboard/orders/${orderDetails.orderId}`}>
                  <Download className="w-4 h-4 mr-2" />
                  View Order & Downloads
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com'}`}
              className="text-primary hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
