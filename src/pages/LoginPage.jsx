import { useState } from 'react';
import { getUniqueValues } from '../lib/utils';

const ROLES = [
  { value: 'rep', label: 'مندوب (Sales Rep)', password: 'rep123' },
  { value: 'tm', label: 'Trade Marketing', password: 'tm123' },
  { value: 'rm', label: 'Roshen Manager', password: 'rm123' },
];

export default function LoginPage({ onLogin, inventoryData }) {
  const [role, setRole] = useState('');
  const [repName, setRepName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const salesManNames = getUniqueValues(inventoryData, 'salesMan');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!role) { setError('يرجى اختيار الدور'); return; }
    if (role === 'rep' && !repName) { setError('يرجى اختيار الاسم'); return; }

    const roleConfig = ROLES.find((r) => r.value === role);
    if (!roleConfig || password !== roleConfig.password) {
      setError('كلمة المرور غير صحيحة');
      return;
    }

    onLogin(role, password, role === 'rep' ? repName : roleConfig.label);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">نظام تسجيل قرب الانتهاء</h1>
          <p className="text-gray-400 text-sm mt-1">Near Expiry Registration System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value); setRepName(''); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">اختر الدور...</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {role === 'rep' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
              {salesManNames.length > 0 ? (
                <select
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">اختر اسمك...</option>
                  {salesManNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                  لا توجد بيانات حتى الآن. يرجى من Trade Marketing رفع ملف البيانات أولاً.
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={role === 'rep' && salesManNames.length === 0}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}
