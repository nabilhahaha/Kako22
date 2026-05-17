import { useState } from 'react';
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
              <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <p className="text-xs text-blue-400 font-medium">النص الترويجي من TM:</p>
                <p className="text-sm text-blue-800">{request.tmNote}</p>
              </div>
            )}
            {request.rmNote && (
              <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400 font-medium">ملاحظة المدير:</p>
                <p className="text-sm text-gray-700">{request.rmNote}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1.5 shrink-0">
          {request.expiryPhoto && (
            <button onClick={() => onPhotoClick(request.expiryPhoto)} className="relative group">
              <img src={request.expiryPhoto} alt="ملصق" className="w-14 h-14 object-cover rounded-lg border" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all" />
            </button>
          )}
          {request.stockPhoto && (
            <button onClick={() => onPhotoClick(request.stockPhoto)} className="relative group">
              <img src={request.stockPhoto} alt="مخزون" className="w-14 h-14 object-cover rounded-lg border" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all" />
            </button>
          )}
        </div>
      </div>

      {request.status === 'tm_approved' && (
        <div className="flex gap-2 mt-4">
          <button onClick={() => onApprove(request)}
            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            ✅ موافقة نهائية
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

export default function RoshenManagerPage({ requests, onUpdateRequest }) {
  const [modal, setModal] = useState(null);
  const [note, setNote] = useState('');
  const [banner, setBanner] = useState(null);
  const [photoModal, setPhotoModal] = useState(null);
  const [activeTab, setActiveTab] = useState('queue');

  const queue = requests.filter((r) => r.status === 'tm_approved');
  const decisions = requests.filter((r) => r.status === 'rm_approved' || r.status === 'rm_rejected');

  const openModal = (request, type) => { setModal({ request, type }); setNote(''); };

  const confirm = () => {
    const updated = {
      ...modal.request,
      status: modal.type === 'approve' ? 'rm_approved' : 'rm_rejected',
      rmNote: note,
    };
    onUpdateRequest(updated);

    const isApprove = modal.type === 'approve';
    setBanner({
      message: isApprove
        ? `✅ تمت الموافقة النهائية على: ${updated.itemDescription}`
        : `❌ تم رفض: ${updated.itemDescription}`,
      type: isApprove ? 'success' : 'error',
    });
    setTimeout(() => setBanner(null), 5000);
    setModal(null);
    setNote('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">لوحة Roshen Manager</h2>

      {/* Notification Banner */}
      {banner && (
        <div className={`mb-5 p-4 rounded-xl text-white font-medium shadow-lg animate-pulse ${
          banner.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {banner.message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[['queue', `قائمة الانتظار (${queue.length})`], ['decisions', `القرارات (${decisions.length})`]].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}>{label}</button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {(activeTab === 'queue' ? queue : decisions).length === 0 ? (
          <div className="bg-white rounded-xl border p-10 text-center text-gray-400">
            {activeTab === 'queue' ? 'لا توجد طلبات في انتظار الموافقة' : 'لا توجد قرارات بعد'}
          </div>
        ) : (
          (activeTab === 'queue' ? queue : decisions).map((r) => (
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
              {modal.type === 'approve' ? '✅ موافقة نهائية' : '❌ رفض الطلب'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{modal.request.itemDescription} — {modal.request.custName}</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات (اختياري)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="أضف ملاحظاتك هنا..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="flex gap-2 mt-4">
              <button onClick={confirm}
                className={`flex-1 py-2 px-4 rounded-lg text-white font-medium transition-colors ${
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
