// أدوات التصدير والطباعة

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return "";
        if (typeof value === "object") return JSON.stringify(value).replace(/,/g, ";");
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(data: any[], filename: string) {
  // تصدير كملف CSV يمكن فتحه في Excel
  exportToCSV(data, filename);
}

export function printReport(title: string, content: string) {
  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
          padding: 20px;
          color: #1e293b;
          background: #fff;
        }
        .report-header {
          background: #1e293b;
          color: #fff;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .report-header h1 { font-size: 20px; }
        .report-header .company { font-size: 14px; opacity: 0.8; }
        .report-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .report-meta div { font-size: 13px; }
        .report-meta span { font-weight: bold; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background: #f59e0b;
          color: #1e293b;
          padding: 10px;
          text-align: right;
          font-size: 13px;
          font-weight: bold;
        }
        td {
          padding: 8px 10px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 12px;
        }
        tr:nth-child(even) { background: #f8fafc; }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }
        .kpi-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
        }
        .kpi-card .value { font-size: 24px; font-weight: bold; color: #f59e0b; }
        .kpi-card .label { font-size: 12px; color: #64748b; margin-top: 5px; }
        .status-good { color: #059669; font-weight: bold; }
        .status-warning { color: #d97706; font-weight: bold; }
        .status-danger { color: #dc2626; font-weight: bold; }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 2px solid #e2e8f0;
          font-size: 12px;
          color: #64748b;
          display: flex;
          justify-content: space-between;
        }
        .signature {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
        }
        .signature div {
          text-align: center;
          width: 200px;
        }
        .signature .line {
          border-top: 1px solid #1e293b;
          margin-top: 50px;
          padding-top: 5px;
          font-size: 12px;
        }
        @media print {
          body { padding: 0; }
          .report-header { border-radius: 0; }
        }
      </style>
    </head>
    <body>
      ${content}
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

export function generateReportHeader(title: string, period: string) {
  return `
    <div class="report-header">
      <div>
        <h1>${title}</h1>
        <div class="company">FERDI PLAST - نظام إدارة الصيانة GMAO Pro</div>
      </div>
      <div>${new Date().toLocaleDateString("ar-DZ")}</div>
    </div>
    <div class="report-meta">
      <div>الفترة: <span>${period}</span></div>
      <div>تاريخ التقرير: <span>${new Date().toLocaleDateString("ar-DZ")}</span></div>
      <div>المرجع: <span>MNT-PS-02</span></div>
    </div>
  `;
}

export function generateTable(data: any[], columns: { key: string; label: string }[]) {
  if (data.length === 0) return "<p>لا توجد بيانات</p>";
  
  const headerRow = columns.map(col => `<th>${col.label}</th>`).join("");
  const bodyRows = data.map(row => 
    `<tr>${columns.map(col => `<td>${row[col.key] || ""}</td>`).join("")}</tr>`
  ).join("");
  
  return `
    <table>
      <thead><tr>${headerRow}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  `;
}

export function generateKPICards(kpis: { label: string; value: string; status: string }[]) {
  return `
    <div class="kpi-grid">
      ${kpis.map(kpi => `
        <div class="kpi-card">
          <div class="value">${kpi.value}</div>
          <div class="label">${kpi.label}</div>
          <div class="status-${kpi.status}">${kpi.status === "good" ? "جيد" : kpi.status === "warning" ? "تحذير" : "خطر"}</div>
        </div>
      `).join("")}
    </div>
  `;
}

export function generateReportFooter() {
  return `
    <div class="footer">
      <div>FERDI PLAST - GMAO Pro</div>
      <div>عملية الصيانة MNT-PS-02</div>
      <div>تم الإنشاء بواسطة النظام</div>
    </div>
    <div class="signature">
      <div>
        <div class="line">إمضاء مسؤول الصيانة</div>
      </div>
      <div>
        <div class="line">إمضاء المدير</div>
      </div>
    </div>
  `;
}