import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

const ExportExcel = (data, filename) => {
  if (!data || data.length === 0) {
    return alerts.err("ไม่พบข้อมูลที่ต้องการ export");
  }

  // สร้าง worksheet จากข้อมูล
  const worksheet = XLSX.utils.json_to_sheet(data, {
    origin: "A3", // เริ่มข้อมูลที่แถว 3
  });

  const columns = Object.keys(data[0]);
  const lastCol = XLSX.utils.encode_col(columns.length - 1);

  // Row 1 = ชื่อรายงาน
  worksheet["A1"] = {
    v: filename,
    t: "s",
    s: {
      font: {
        bold: true,
        sz: 16,
        color: { rgb: "FFFFFF" },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
      fill: {
        fgColor: { rgb: "4F81BD" }, // สีฟ้า
      },
    },
  };

  // Merge A1 ถึงคอลัมน์สุดท้าย
  worksheet["!merges"] = [
    {
      s: { r: 0, c: 0 }, // A1
      e: { r: 0, c: columns.length - 1 },
    },
  ];

  // จัด style หัวตาราง (Row 3)
  columns.forEach((_, index) => {
    const cellRef = XLSX.utils.encode_cell({
      r: 2, // row 3
      c: index,
    });

    if (worksheet[cellRef]) {
      worksheet[cellRef].s = {
        font: {
          bold: true,
          color: { rgb: "FFFFFF" },
        },
        fill: {
          fgColor: { rgb: "4F81BD" },
        },
        alignment: {
          horizontal: "center",
        },
      };
    }
  });

  // ปรับความกว้าง column อัตโนมัติ
  worksheet["!cols"] = columns.map((col) => ({
    wch: Math.max(col.length + 5, 20),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, `${filename}.xlsx`);
};

export default ExportExcel;
