'use client';

import { useEffect, useState } from 'react';

export default function AdminAnalyticsPage() {
  const [exportStats, setExportStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/mpg/analytics?type=exports')
      .then(res => res.json())
      .then(data => setExportStats(data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">MPG Analytics</h1>

      {exportStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Exports by Format</h3>
            <div className="space-y-2">
              {exportStats.byFormat?.map((item: any) => (
                <div key={item.format} className="flex justify-between">
                  <span className="capitalize">{item.format}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Exports by Size</h3>
            <div className="space-y-2">
              {exportStats.bySize?.map((item: any) => (
                <div key={item.size} className="flex justify-between">
                  <span>{item.size}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
