import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateQRCodeVisual } from "@/lib/qrCode";
import { Machine } from "@/types";
import { QrCode, Download, Printer, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface MachineQRCodeProps {
  machine: Machine;
  open: boolean;
  onClose: () => void;
}

export function MachineQRCode({ machine, open, onClose }: MachineQRCodeProps) {
  const [showMobileView, setShowMobileView] = useState(false);
  const qrMatrix = generateQRCodeVisual(machine.code);

  const handleDownload = () => {
    // إنشاء SVG للـ QR code
    const size = 21;
    const cellSize = 10;
    const padding = 20;
    const totalSize = size * cellSize + padding * 2;
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalSize}" height="${totalSize}">`;
    svg += `<rect width="${totalSize}" height="${totalSize}" fill="white"/>`;
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (qrMatrix[i][j] === "1") {
          svg += `<rect x="${padding + j * cellSize}" y="${padding + i * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        }
      }
    }
    
    svg += `</svg>`;
    
    // تحميل الملف
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `QR_${machine.code}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const size = 21;
    const cellSize = 10;
    const padding = 20;
    const totalSize = size * cellSize + padding * 2;
    
    let html = `
      <html>
        <head>
          <title>QR Code - ${machine.code}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .qr-container { text-align: center; }
            .machine-info { text-align: center; margin-top: 20px; }
            .machine-info h2 { margin: 0; color: #333; }
            .machine-info p { margin: 5px 0; color: #666; }
            @media print {
              body { print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="${totalSize}" height="${totalSize}">
              <rect width="${totalSize}" height="${totalSize}" fill="white"/>
    `;
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (qrMatrix[i][j] === "1") {
          html += `<rect x="${padding + j * cellSize}" y="${padding + i * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        }
      }
    }
    
    html += `
            </svg>
          </div>
          <div class="machine-info">
            <h2>${machine.name}</h2>
            <p>Code: ${machine.code}</p>
            <p>${machine.designation}</p>
            <p>Localisation: ${machine.location}</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-amber-600" />
            QR Code - {machine.code}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* عرض QR Code */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 flex justify-center">
            <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(21, 8px)` }}>
              {qrMatrix.map((row, i) => (
                <div key={i} className="contents">
                  {row.map((cell, j) => (
                    <div
                      key={j}
                      className={cn(
                        "w-2 h-2",
                        cell === "1" ? "bg-slate-900" : "bg-transparent"
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* معلومات الآلة */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-bold text-slate-900">{machine.name}</p>
                <p className="text-sm text-slate-500">{machine.code}</p>
              </div>
              <Badge
                className={cn(
                  machine.status === "running" && "bg-emerald-100 text-emerald-700",
                  machine.status === "maintenance" && "bg-amber-100 text-amber-700",
                  machine.status === "breakdown" && "bg-red-100 text-red-700",
                  machine.status === "stopped" && "bg-slate-100 text-slate-700"
                )}
              >
                {machine.status === "running" && "تشغيل"}
                {machine.status === "maintenance" && "صيانة"}
                {machine.status === "breakdown" && "عطل"}
                {machine.status === "stopped" && "متوقفة"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-slate-500">الموقع</p>
                <p className="font-medium text-slate-700">{machine.location}</p>
              </div>
              <div>
                <p className="text-slate-500">الخط</p>
                <p className="font-medium text-slate-700">{machine.line}</p>
              </div>
              <div>
                <p className="text-slate-500">الورشة</p>
                <p className="font-medium text-slate-700">{machine.workshop}</p>
              </div>
              <div>
                <p className="text-slate-500">الأهمية</p>
                <p className="font-medium text-slate-700">{machine.criticality}</p>
              </div>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 ml-2" />
              تحميل
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 ml-2" />
              طباعة
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowMobileView(!showMobileView)}
            >
              <Smartphone className="h-4 w-4 ml-2" />
              معاينة
            </Button>
          </div>

          {/* معاينة الهاتف */}
          {showMobileView && (
            <div className="bg-slate-900 rounded-xl p-4">
              <div className="bg-white rounded-lg p-4 max-w-[280px] mx-auto">
                <div className="text-center mb-3">
                  <p className="font-bold text-slate-900">{machine.name}</p>
                  <p className="text-xs text-slate-500">{machine.code}</p>
                </div>
                <div className="flex justify-center mb-3">
                  <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(21, 4px)` }}>
                    {qrMatrix.map((row, i) => (
                      <div key={i} className="contents">
                        {row.map((cell, j) => (
                          <div
                            key={j}
                            className={cn(
                              "w-1 h-1",
                              cell === "1" ? "bg-slate-900" : "bg-transparent"
                            )}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-center text-xs text-slate-500">
                  امسح الرمز لفتح Fiche Machine
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}