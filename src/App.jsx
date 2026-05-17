import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SalesRepPage from './pages/SalesRepPage';
import TradeMarketingPage from './pages/TradeMarketingPage';
import RoshenManagerPage from './pages/RoshenManagerPage';
import { loadInventory, saveInventory, loadRequests, saveRequests } from './lib/storage';

const USERS = {
  rep: { password: 'rep123', label: 'مندوب' },
  tm: { password: 'tm123', label: 'Trade Marketing' },
  rm: { password: 'rm123', label: 'Roshen Manager' },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setInventoryData(loadInventory());
    setRequests(loadRequests());
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUploadData = (data) => {
    setInventoryData(data);
    saveInventory(data);
  };

  const handleSubmitRequest = (req) => {
    const next = [...requests, req];
    setRequests(next);
    saveRequests(next);
    showToast('تم تقديم الطلب بنجاح ✓');
  };

  const handleUpdateRequest = (updated) => {
    const next = requests.map((r) => (r.id === updated.id ? updated : r));
    setRequests(next);
    saveRequests(next);
    const msgs = {
      tm_approved: 'تمت الموافقة — أُرسل لـ Roshen Manager ✓',
      tm_rejected: 'تم رفض الطلب',
      rm_approved: 'تمت الموافقة النهائية ✓',
      rm_rejected: 'تم رفض الطلب',
    };
    const isReject = updated.status.includes('rejected');
    showToast(msgs[updated.status] || '', isReject ? 'error' : 'success');
  };

  const login = (role, password, name) => {
    if (!USERS[role] || password !== USERS[role].password) return false;
    setUser({ role, name: name || USERS[role].label });
    return true;
  };

  const logout = () => setUser(null);

  if (!user) {
    return <LoginPage onLogin={login} inventoryData={inventoryData} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 px-4 py-3 rounded-xl shadow-xl text-white font-medium transition-all ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-gray-800 leading-tight">نظام تسجيل قرب الانتهاء</h1>
            <p className="text-xs text-gray-400">Near Expiry Registration</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
              <p className="text-xs text-gray-400">
                {user.role === 'rep' ? 'مندوب' : user.role === 'tm' ? 'Trade Marketing' : 'Roshen Manager'}
              </p>
            </div>
            <button onClick={logout}
              className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors">
              خروج
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {user.role === 'rep' && (
          <SalesRepPage
            user={user}
            inventoryData={inventoryData}
            onSubmit={handleSubmitRequest}
          />
        )}
        {user.role === 'tm' && (
          <TradeMarketingPage
            inventoryData={inventoryData}
            requests={requests}
            onUploadData={handleUploadData}
            onUpdateRequest={handleUpdateRequest}
          />
        )}
        {user.role === 'rm' && (
          <RoshenManagerPage
            requests={requests}
            onUpdateRequest={handleUpdateRequest}
          />
        )}
      </main>
    </div>
  );
}
