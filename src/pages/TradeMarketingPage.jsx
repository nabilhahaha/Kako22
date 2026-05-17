import { useState } from 'react';
import { parseInventoryExcel } from '../lib/excel';
import { getStatusLabel, getStatusColor, formatDate, getDaysColor } from '../lib/utils';

function RequestCard({ request, onApprove, onReject, onPhotoClick }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-800 truncate">{request.itemDescription}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusColor(request.status)}`}>
              {getStatusLabel(request.status)}
            </span>
          </div>
          <div className="text-sm text-gray-500 space-y-0.5">
            <p>المندوب: {request.salesMan} · العميل: {request.custName}</p>
            <p>كمية صافية: <span className="font-medium text-gray-700">{request.netQty}</span> · فعلية: <span className="font-medium text-gray-700">{request.physicalQty}</span> كرتون</p>
            <p>
              انتهاء: {formatDate(request.expiryDate)} ·
              <span className={`font-semibold ${getDaysColor(request.daysRemaining)}`}>
                {' '}{request.daysRemaining < 0 ? 'منتهي!' : `${request.daysRemaining} يوم`}
              </span>
            </p>
            {request.tmNote && (
              <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400 font-medium">ملاحظة TM:</p>
                <p className="text-sm text-gray-700">{request.tmNote}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1.5 shrink-0">
          {request.expiryPhoto && (
            <button onClick={() => onPhotoClick(request.expiryPhoto)}
              className="relative group">
              <img src={request.expiryPhoto} alt="ملصق" className="w-14 h-14 object-cover rounded-lg border" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all" />
            </button>
          )}
          {request.stockPhoto && (
            <button onClick={() => onPhotoClick(request.stockPhoto)}
              className="relative group">
              <img src={request.stockPhoto} alt="مخزون" className="w-14 h-14 object-cover rounded-lg border" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all" />
            </button>
          )}
        </div>
      </div>

      {request.status === 'pending' && (
        <div className="flex gap-2 mt-4">
          <button onClick={() => onApprove(request)}
            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            ✅ موافقة + نص ترويجي
          </button>
          <button onClick={() => onReject(request)}
            className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
            ❌ رفض
          </button>
        </div>
      )}
    </div>
  );
}

export default function TradeMarketingPage({ inventoryData, requests, onUploadData, onUpdateRequest }) {
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [modal, setModal] = useState(null);
  const [note, setNote] = useState('');
  const [photoModal, setPhotoModal] = useState(null);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const processedRequests = requests.filter((r) => r.status !== 'pending');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg(null);
    try {
      const data = await parseInventoryExcel(file);
      if (data.length === 0) {
        setUploadMsg({ type: 'error', text: 'الملف فارغ أو لا يحتوي على بيانات صحيحة' });
        return;
      }
      onUploadData(data);
      setUploadMsg({ type: 'success', text: `تم تحميل ${data.length} سجل بنجاح` });
    } catch {
      setUploadMsg({ type: 'error', text: 'خطأ في قراءة الملف. تأكد من أن الملف بصيغة Excel' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const openModal = (request, type) => { setModal({ request, type }); setNote(''); };

  const confirmAction = () => {
    if (!note.trim()) return;
    onUpdateRequest({
      ...modal.request,
      status: modal.type === 'approve' ? 'tm_approved' : 'tm_rejected',
      tmNote: note,
    });
    setModal(null);
    setNote('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">لوحة Trade Marketing</h2>

      {/* Upload */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">رفع ملف البيانات</h3>
        {inventoryData.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 text-sm text-green-700">
            ✓ يوجد {inventoryData.length} سجل محمّل حالياً
          </div>
        )}
        <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 transition-colors text-center">
          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleUpload} disabled={uploading} className="hidden" />
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-gray-600 font-medium">{uploading ? 'جاري الرفع...' : 'انقر لرفع ملف Excel'}</p>
          <p className="text-xs text-gray-400 mt-1">الأعمدة: Sales Man, Cust Name, Item Description, Item Id, Inv Qty Cases, IsReturn</p>
        </label>
        {uploadMsg && (
          <div className={`mt-3 rounded-lg p-3 text-sm ${
            uploadMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-600'
          }`}>{uploadMsg.text}</div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[['pending', `معلقة (${pendingRequests.length})`], ['processed', `محدّثة (${processedRequests.length})`]].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}>{label}</button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {(activeTab === 'pending' ? pendingRequests : processedRequests).length === 0 ? (
          <div className="bg-white rounded-xl border p-10 text-center text-gray-400">لا توجد طلبات</div>
        ) : (
          (activeTab === 'pending' ? pendingRequests : processedRequests).map((r) => (
            <RequestCard key={r.id} request={r}
              onApprove={(req) => openModal(req, 'approve')}
              onReject={(req) => openModal(req, 'reject')}
              onPhotoClick={setPhotoModal}
            />
          ))
        )}
      </div>

      {/* Action Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-2">
              {modal.type === 'approve' ? '✅ موافقة على الطلب' : '❌ رفض الطلب'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{modal.request.itemDescription} — {modal.request.custName}</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {modal.type === 'approve' ? 'النص الترويجي *' : 'سبب الرفض *'}
            </label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)}
              placeholder={modal.type === 'approve' ? 'أدخل النص الترويجي...' : 'أدخل سبب الرفض...'}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {!note.trim() && <p className="text-xs text-red-500 mt-1">هذا الحقل مطلوب</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={confirmAction} disabled={!note.trim()}
                className={`flex-1 py-2 px-4 rounded-lg text-white font-medium transition-colors disabled:opacity-40 ${
                  modal.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
                }`}>تأكيد</button>
              <button onClick={() => setModal(null)}
                className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {photoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setPhotoModal(null)}>
          <img src={photoModal} alt="صورة" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}
