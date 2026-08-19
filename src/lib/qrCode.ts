// توليد وإدارة رموز QR للآلات

export interface QRCodeData {
  machineId: string;
  machineCode: string;
  machineName: string;
  timestamp: string;
}

export function generateQRCodeData(machineId: string, machineCode: string, machineName: string): string {
  const data: QRCodeData = {
    machineId,
    machineCode,
    machineName,
    timestamp: new Date().toISOString(),
  };
  
  // تحويل البيانات إلى JSON مشفر
  return btoa(JSON.stringify(data));
}

export function parseQRCodeData(qrData: string): QRCodeData | null {
  try {
    const decoded = atob(qrData);
    return JSON.parse(decoded) as QRCodeData;
  } catch (error) {
    console.error("Invalid QR code data:", error);
    return null;
  }
}

// توليد تمثيل نصي للـ QR (محاكاة)
export function generateQRCodeVisual(machineCode: string): string[][] {
  // توليد مصفوفة 21x21 تمثل QR code
  const size = 21;
  const matrix: string[][] = [];
  
  // بذرة عشوائية ثابتة من كود الآلة
  let seed = 0;
  for (let i = 0; i < machineCode.length; i++) {
    seed = (seed * 31 + machineCode.charCodeAt(i)) % 1000;
  }
  
  for (let i = 0; i < size; i++) {
    matrix[i] = [];
    for (let j = 0; j < size; j++) {
      // أنماط التموضع في الزوايا
      const isFinderPattern = 
        (i < 7 && j < 7) || 
        (i < 7 && j >= size - 7) || 
        (i >= size - 7 && j < 7);
      
      if (isFinderPattern) {
        // نمط التموضع
        const inFinder = 
          (i === 0 || i === 6 || j === 0 || j === 6) ||
          (i >= 2 && i <= 4 && j >= 2 && j <= 4);
        matrix[i][j] = inFinder ? "1" : "0";
      } else {
        // بيانات عشوائية ثابتة
        const value = (seed * (i + 1) * (j + 1)) % 2;
        matrix[i][j] = value === 0 ? "0" : "1";
      }
    }
  }
  
  return matrix;
}