import { useState } from 'react';
import {
  getUniqueValues,
  getDaysRemaining,
  generateId,
  fileToBase64,
  getDaysColor,
} from '../lib/utils';

function PhotoUpload({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <label className="block border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors">
        <input type="file" accept="image/*" onChange={onChange} className="hidden" />
        {value ? (
          <div className="text-center">
            <img src={value} alt="preview" className="max-h-36 mx-auto rounded-lg object-cover" />
            <p className="text-xs text-green-600 mt-2 font-medium">✓ تم تحميل الصورة — انقر لتغييرها</p>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-2">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">انقر لتحميل صورة</p>
          </div>
        )}
      </label>
    </div>
  );
}

export default function SalesRepPage({ user, inventoryData, onSubmit }) {
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [physicalQty, setPhysicalQty] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryPhoto, setExpiryPhoto] = useState(null);
  const [stockPhoto, setStockPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const repName = user.name;
  const repData = inventoryData.filter((row) => row.salesMan === repName);
  const customers = getUniqueValues(repData, 'custName');

  const customerData = repData.filter((row) => row.custName === selectedCustomer);
  const uniqueItemIds = [...new Set(customerData.map((row) => row.itemId))];
  const itemsWithNetQty = uniqueItemIds
    .map((itemId) => {
      const rows = customerData.filter((row) => row.itemId === itemId);
      const netQty = rows.reduce((sum, row) => sum + Number(row.invQtyCases), 0);
      return { itemId, itemDescription: rows[0]?.itemDescription || itemId, netQty };
    })
    .filter((item) => item.netQty > 0);

  const daysRemaining = expiryDate ? getDaysRemaining(expiryDate) : null;

  const handlePhoto = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      if (type === 'expiry') setExpiryPhoto(b64);
      else setStockPhoto(b64);
    } catch {
      setError('فشل تحميل الصورة');
    }
  };

  const handleSubmit = async () => {
    if (!physicalQty || Number(physicalQty) < 0) { setError('يرجى إدخال الكمية الفعلية'); return; }
    if (!expiryDate) { setError('يرجى إدخال تاريخ انتهاء الصلاحية'); return; }
    if (!expiryPhoto) { setError('يرجى تحميل صورة ملصق تاريخ الانتهاء'); return; }
    if (!stockPhoto) { setError('يرجى تحميل صورة المخزون الفعلي'); return; }

    setSubmitting(true);
    setError('');
    const request = {
      id: generateId(),
      salesMan: repName,
      custName: selectedCustomer,
      itemId: selectedItem.itemId,
      itemDescription: selectedItem.itemDescription,
      netQty: selectedItem.netQty,
      physicalQty: Number(physicalQty),
      expiryDate,
      daysRemaining: getDaysRemaining(expiryDate),
      expiryPhoto,
      stockPhoto,
      status: 'pending',
      tmNote: '',
      rmNote: '',
      createdAt: new Date().toISOString(),
    };
    onSubmit(request);
    setSubmitting(false);
    setSubmitted(true);
  };

  const reset = () => {
    setStep(1); setSelectedCustomer(''); setSelectedItem(null);
    setPhysicalQty(''); setExpiryDate(''); setExpiryPhoto(null);
    setStockPhoto(null); setSubmitted(false); setError('');
  };

  if (inventoryData.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-700">لا توجد بيانات</h2>
        <p className="text-gray-500 mt-2">يرجى من Trade Marketing رفع ملف بيانات المخزون أولاً</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">تم تقديم الطلب بنجاح!</h2>
        <p className="text-gray-500 mt-2">سيتم مراجعته من قبَل Trade Marketing</p>
        <button onClick={reset}
          className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          تسجيل منتج آخر
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">تسجيل منتج قرب الانتهاء</h2>

      {/* Step indicator */}
      <div className="flex items-center mb-2">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}>{s}</div>
            {i < 2 && <div className={`flex-1 h-1 mx-1 rounded ${
              step > s ? 'bg-blue-600' : 'bg-gray-200'
            }`} />}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mb-6 px-1">
        <span>اختر العميل</span>
        <span>اختر المنتج</span>
        <span>إدخال البيانات</span>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-700 mb-4">اختر العميل</h3>
          {customers.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm">
              لا يوجد عملاء مرتبطون بك في البيانات
            </div>
          ) : (
            <div className="space-y-2">
              {customers.map((cust) => (
                <button key={cust}
                  onClick={() => { setSelectedCustomer(cust); setStep(2); }}
                  className="w-full text-left border border-gray-200 rounded-lg p-3.5 hover:border-blue-400 hover:bg-blue-50 transition-colors flex justify-between items-center">
                  <span className="font-medium text-gray-800">{cust}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setStep(1)} className="text-blue-600 hover:text-blue-800 text-sm">← رجوع</button>
            <h3 className="font-semibold text-gray-700">اختر المنتج &mdash; {selectedCustomer}</h3>
          </div>
          {itemsWithNetQty.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm">
              لا توجد منتجات بكمية صافية موجبة لهذا العميل
            </div>
          ) : (
            <div className="space-y-2">
              {itemsWithNetQty.map((item) => (
                <button key={item.itemId}
                  onClick={() => { setSelectedItem(item); setStep(3); }}
                  className="w-full text-left border border-gray-200 rounded-lg p-3.5 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <div className="font-medium text-gray-800">{item.itemDescription}</div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    كمية صافية: <span className="font-semibold text-gray-600">{item.netQty} كرتون</span>
                    <span className="mx-2">·</span>ID: {item.itemId}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && selectedItem && (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setStep(2)} className="text-blue-600 hover:text-blue-800 text-sm">← رجوع</button>
            <h3 className="font-semibold text-gray-700">إدخال البيانات</h3>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="font-medium text-blue-800">{selectedItem.itemDescription}</p>
            <p className="text-sm text-blue-600 mt-0.5">
              {selectedCustomer} · كمية صافية في النظام: <strong>{selectedItem.netQty} كرتون</strong>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الكمية الفعلية في المتجر (كرتون)</label>
            <input type="number" min="0" value={physicalQty}
              onChange={(e) => setPhysicalQty(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ انتهاء الصلاحية</label>
            <input type="date" value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {daysRemaining !== null && (
              <p className={`text-sm mt-1 font-semibold ${getDaysColor(daysRemaining)}`}>
                {daysRemaining < 0 ? 'منتهي الصلاحية!' : `${daysRemaining} يوم متبقي`}
              </p>
            )}
          </div>

          <PhotoUpload
            label="صورة ملصق تاريخ الانتهاء"
            value={expiryPhoto}
            onChange={(e) => handlePhoto(e, 'expiry')}
          />

          <PhotoUpload
            label="صورة المخزون الفعلي"
            value={stockPhoto}
            onChange={(e) => handlePhoto(e, 'stock')}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={submitting}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50">
            {submitting ? 'جاري الإرسال...' : 'تقديم الطلب'}
          </button>
        </div>
      )}
    </div>
  );
}
