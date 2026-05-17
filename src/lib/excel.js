import * as XLSX from 'xlsx';

export const parseInventoryExcel = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        const parsed = rows
          .map((row) => ({
            salesMan: String(row['Sales Man'] || '').trim(),
            custName: String(row['Cust Name'] || '').trim(),
            itemDescription: String(row['Item Description'] || '').trim(),
            itemId: String(row['Item Id'] || '').trim(),
            invQtyCases: Number(row['Inv Qty Cases']) || 0,
            isReturn:
              row['IsReturn'] === true ||
              row['IsReturn'] === 'true' ||
              row['IsReturn'] === 1 ||
              row['IsReturn'] === 'Yes',
          }))
          .filter((row) => row.salesMan && row.custName && row.itemId);

        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('فشل قراءة الملف'));
    reader.readAsArrayBuffer(file);
  });
