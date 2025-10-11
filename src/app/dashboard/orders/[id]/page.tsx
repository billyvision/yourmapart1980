'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Download, Clock, CheckCircle2, AlertCircle, Package, Calendar, Mail } from 'lucide-react';
import Link from 'next/link';

interface DownloadFile {
  id: number;
  orderItemId: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  downloadUrl: string;
  expiresAt: string;
  productName: string;
  format: string;
}

interface OrderInfo {
  id: number;
  orderNumber: string;
  status: string;
  createdAt: string;
  email: string;
}

interface DownloadsResponse {
  success: boolean;
  order: OrderInfo;
  downloads: DownloadFile[];
  expiryNotice: string;
}

interface ErrorResponse {
  error: string;
  status?: string;
  message?: string;
}

export default function OrderDownloadsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const orderId = params.id as string;
  const orderNumber = searchParams.get('orderNumber');
  const email = searchParams.get('email');

  const [data, setData] = useState<DownloadsResponse | null>(null);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchDownloads();
    // Auto-refresh every 30 seconds if files are processing
    const interval = setInterval(() => {
      if (error?.status === 'processing') {
        fetchDownloads();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [orderId, orderNumber, email]);

  async function fetchDownloads() {
    try {
      // Build query params for guest access
      const params = new URLSearchParams();
      if (orderNumber) params.set('orderNumber', orderNumber);
      if (email) params.set('email', email);

      const url = `/api/orders/${orderId}/downloads${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      const json = await response.json();

      if (response.ok) {
        setData(json);
        setError(null);
      } else {
        setError(json);
        setData(null);
      }
    } catch (err) {
      setError({
        error: 'Failed to load downloads',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(file: DownloadFile) {
    try {
      setDownloadingId(file.id);

      // Use the pre-signed URL directly
      const link = document.createElement('a');
      link.href = file.downloadUrl;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function getTimeUntilExpiry(expiresAt: string): string {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const hoursRemaining = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (hoursRemaining < 1) return 'Less than 1 hour';
    if (hoursRemaining < 24) return `${hoursRemaining} hours`;
    return `${Math.floor(hoursRemaining / 24)} days`;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Loading your downloads...</p>
        </div>
      </div>
    );
  }

  // Error: Files processing
  if (error?.status === 'processing') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="border rounded-lg p-8 text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-pulse" />
            <h1 className="text-2xl font-bold mb-2">Your Files Are Being Generated</h1>
            <p className="text-muted-foreground mb-6">{error.message}</p>
            <p className="text-sm text-muted-foreground mb-6">
              This usually takes 2-5 minutes. This page will refresh automatically.
            </p>
            <Button onClick={fetchDownloads} variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              Check Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Error: Other errors
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="border rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-bold mb-2">Unable to Load Downloads</h1>
            <p className="text-muted-foreground mb-6">{error.message || error.error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={fetchDownloads} variant="outline">
                Try Again
              </Button>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Order Downloads</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Paid</span>
            </div>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border rounded-lg">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-mono font-semibold">{data.order.orderNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-semibold">{formatDate(data.order.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{data.order.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expiry Notice */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-100">Download Links Expire Soon</p>
            <p className="text-sm text-blue-800 dark:text-blue-200">{data.expiryNotice}</p>
          </div>
        </div>

        {/* Downloads List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Your Files ({data.downloads.length})</h2>

          {data.downloads.map((file) => (
            <div
              key={file.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{file.productName}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {file.fileName} ({formatFileSize(file.fileSize)})
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-secondary rounded text-xs font-medium uppercase">
                        {file.format}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Expires in {getTimeUntilExpiry(file.expiresAt)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownload(file)}
                  disabled={downloadingId === file.id}
                  size="lg"
                >
                  {downloadingId === file.id ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-8 p-6 border rounded-lg bg-muted/50">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any issues downloading your files or need to regenerate the download links,
            please contact our support team at{' '}
            <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com'}`} className="text-primary hover:underline">
              {process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com'}
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            Include your order number: <span className="font-mono font-semibold">{data.order.orderNumber}</span>
          </p>
        </div>

        {/* Back to Dashboard */}
        {session && (
          <div className="mt-6 text-center">
            <Button asChild variant="ghost">
              <Link href="/dashboard">← Back to Dashboard</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
