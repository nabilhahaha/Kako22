export const generateId = () =>
  Math.random().toString(36).slice(2, 9) + Date.now().toString(36);

export const getDaysRemaining = (expiryDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

export const getNetQty = (salesMan, custName, itemId, data) =>
  data
    .filter(
      (row) =>
        row.salesMan === salesMan &&
        row.custName === custName &&
        row.itemId === itemId
    )
    .reduce((sum, row) => sum + Number(row.invQtyCases), 0);

export const getUniqueValues = (data, key) =>
  [...new Set(data.map((row) => row[key]))].filter(Boolean).sort();

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ar-EG');
};

export const getDaysColor = (days) => {
  if (days < 0) return 'text-gray-500';
  if (days <= 30) return 'text-red-600';
  if (days <= 90) return 'text-orange-500';
  return 'text-green-600';
};

export const getStatusLabel = (status) => {
  const labels = {
    pending: 'معلق',
    tm_approved: 'موافقة TM',
    tm_rejected: 'رفض TM',
    rm_approved: 'موافقة نهائية',
    rm_rejected: 'رفض نهائي',
  };
  return labels[status] || status;
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    tm_approved: 'bg-blue-100 text-blue-800',
    tm_rejected: 'bg-red-100 text-red-800',
    rm_approved: 'bg-green-100 text-green-800',
    rm_rejected: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
