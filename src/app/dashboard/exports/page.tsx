'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface ExportHistory {
  id: number;
  exportFormat: string;
  exportSize: string;
  exportQuality: string;
  fileName: string;
  createdAt: string;
}

export default function ExportsPage() {
  const [exports, setExports] = useState<ExportHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mpg/export/history')
      .then(res => res.json())
      .then(data => {
        setExports(data.exports || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="container mx-auto py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Export History</h1>

      {exports.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No exports yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {exports.map((exp) => (
            <div key={exp.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{exp.fileName}</h3>
                <p className="text-sm text-muted-foreground">
                  {exp.exportFormat.toUpperCase()} • {exp.exportSize} • {exp.exportQuality}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(exp.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Download className="w-5 h-5 text-muted-foreground" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
