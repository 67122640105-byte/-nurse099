
import React, { useState } from 'react';

type SettingSection = 'account' | 'privacy' | 'notifications' | 'appearance' | 'content' | 'billing' | 'support';

const Settings: React.FC = () => {
  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordResetDone, setIsPasswordResetDone] = useState(false);
  const [adminUsername, setAdminUsername] = useState('admin');
  const [storedPassword, setStoredPassword] = useState('admin123');
  
  // Form States
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  // Active Tab State
  const [activeTab, setActiveTab] = useState<SettingSection>('account');
  const [isNotifEnabled, setIsNotifEnabled] = useState(true);
  const [preShiftReminder, setPreShiftReminder] = useState(true);

  const menuItems: { id: SettingSection; label: string; icon: string }[] = [
    { id: 'account', label: 'บัญชีผู้ใช้', icon: 'person' },
    { id: 'privacy', label: 'ความปลอดภัย', icon: 'security' },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: 'notifications' },
    { id: 'appearance', label: 'การแสดงผล', icon: 'palette' },
    { id: 'content', label: 'การใช้งาน', icon: 'settings_suggest' },
    { id: 'billing', label: 'การชำระเงิน', icon: 'payments' },
    { id: 'support', label: 'ความช่วยเหลือ', icon: 'help' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === adminUsername && loginPass === storedPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (newPass !== confirmPass) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }
    setStoredPassword(newPass);
    setIsPasswordResetDone(true);
    setError('');
    // Optionally alert success or just proceed
  };

  // Render Functions for Settings Content
  const renderAccount = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-bold mb-6">ข้อมูลโปรไฟล์</h3>
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative group">
            <div className="size-24 rounded-full bg-cover bg-center border-4 border-primary/20 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuB4lZCRuPS90L-_kDgK9GqwIRVOehET9lTlfffpJ9TK3WSVKvusKjtKZSpbx3OGp-HpnWKA5LpKUMiUfGh6DeavboGCi19zteuB659ipbZ_58Nrx6LaFK77du_N99eIdOSwEGhpiccBkT8stO9SaHhzBlnHT3iuL9wXPoAs9sRgYRIpUyqoGmYWpDT6YKclcIvv1j4wzX-S5DraMzMUGzNbQblDFfrRx91cukgQOcxtvWyfNAH9Y_2sgPim-s6Mfnided9_ndWireI')]"></div>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted">ชื่อ-นามสกุล</label>
              <input type="text" defaultValue="มาลี ใจดี" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted">อีเมล</label>
              <input type="email" defaultValue="malee.j@thepsatri.go.th" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">เปิดใช้งานการแจ้งเตือน</h3>
            <p className="text-sm text-text-muted">อนุญาตให้ระบบส่งข้อความแจ้งเตือนถึงคุณ</p>
          </div>
          <button 
            onClick={() => setIsNotifEnabled(!isNotifEnabled)}
            className={`w-14 h-7 rounded-full transition-colors relative ${isNotifEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${isNotifEnabled ? 'left-8' : 'left-1'}`}></div>
          </button>
        </div>
      </div>
      {isNotifEnabled && (
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">alarm_on</span>
              </div>
              <div>
                <p className="text-sm font-bold">แจ้งเตือนเข้าเวรล่วงหน้า</p>
                <p className="text-xs text-text-muted">ส่งการแจ้งเตือนเมื่อใกล้ถึงเวลาเข้าเวร</p>
              </div>
            </div>
            <button 
              onClick={() => setPreShiftReminder(!preShiftReminder)}
              className={`w-12 h-6 rounded-full transition-colors relative ${preShiftReminder ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${preShiftReminder ? 'left-6.5' : 'left-0.5'}`}></div>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-bold mb-6">การปรับแต่งธีม</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border-2 border-primary bg-background-light cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-primary">light_mode</span>
              <div className="size-4 rounded-full border-2 border-primary bg-primary"></div>
            </div>
            <p className="text-sm font-bold text-text-main">โหมดสว่าง (Light)</p>
          </div>
          <div className="p-4 rounded-2xl border-2 border-transparent bg-background-dark cursor-pointer opacity-60 grayscale">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-white/50">dark_mode</span>
              <div className="size-4 rounded-full border-2 border-white/20"></div>
            </div>
            <p className="text-sm font-bold text-white">โหมดมืด (Dark)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div className="bg-white dark:bg-white/5 p-12 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center">
      <div className="size-20 bg-primary/5 rounded-full flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-4xl text-primary/40">construction</span>
      </div>
      <h3 className="text-xl font-bold mb-2">ส่วนงาน {title}</h3>
      <p className="text-text-muted text-sm max-w-sm">กำลังอยู่ระหว่างการพัฒนา</p>
    </div>
  );

  // Conditional Rendering Logic
  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 animate-in fade-in duration-500">
        <div className="max-w-md w-full bg-white dark:bg-surface-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl">
          <div className="text-center mb-8">
            <div className="size-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">lock</span>
            </div>
            <h2 className="text-2xl font-black text-text-main dark:text-white">ยืนยันสิทธิ์ผู้ดูแลระบบ</h2>
            <p className="text-sm text-text-muted mt-2">โปรดระบุ Username และ Password เพื่อเข้าถึงส่วนการตั้งค่า</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">ชื่อผู้ใช้</label>
              <input 
                type="text" 
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="กรอกชื่อผู้ใช้ (admin)"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">รหัสผ่าน</label>
              <input 
                type="password" 
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="กรอกรหัสผ่าน (admin123)"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
              />
            </div>
            {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
            <button type="submit" className="w-full bg-primary hover:bg-pink-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 dark:shadow-none transition-all active:scale-[0.98]">
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isPasswordResetDone) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="max-w-md w-full bg-white dark:bg-surface-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl">
          <div className="text-center mb-8">
            <div className="size-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">password</span>
            </div>
            <h2 className="text-2xl font-black text-text-main dark:text-white">ตั้งรหัสผ่านใหม่</h2>
            <p className="text-sm text-text-muted mt-2">เพื่อความปลอดภัย โปรดกำหนดรหัสผ่านใหม่สำหรับผู้ดูแลระบบ</p>
          </div>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">รหัสผ่านใหม่</label>
              <input 
                type="password" 
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="กำหนดรหัสผ่านใหม่"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">ยืนยันรหัสผ่านใหม่</label>
              <input 
                type="password" 
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
              />
            </div>
            {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
            <button type="submit" className="w-full bg-primary hover:bg-pink-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 dark:shadow-none transition-all active:scale-[0.98]">
              บันทึกรหัสผ่านใหม่
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-extrabold text-text-main dark:text-white">ตั้งค่าระบบ</h2>
          <p className="text-text-muted mt-1">จัดการบัญชีและความพึงพอใจในการใช้งานของคุณ</p>
        </div>
        <button 
          onClick={() => { setIsAuthenticated(false); setIsPasswordResetDone(false); }}
          className="px-4 py-2 bg-gray-100 dark:bg-white/5 text-text-muted hover:text-red-500 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          ออกจากระบบความปลอดภัย
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-72 flex flex-col gap-1 sticky top-8">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === item.id
                  ? 'bg-primary text-white shadow-lg shadow-pink-200 dark:shadow-none'
                  : 'text-text-muted hover:bg-white dark:hover:bg-white/5 hover:text-text-main dark:hover:text-white border border-transparent'
              }`}
            >
              <span className={`material-symbols-outlined ${activeTab === item.id ? 'fill' : ''}`}>
                {item.icon}
              </span>
              <span className="text-sm font-bold">{item.label}</span>
              {activeTab === item.id && (
                <span className="ml-auto material-symbols-outlined text-sm">chevron_right</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 w-full">
          {(() => {
            switch (activeTab) {
              case 'account': return renderAccount();
              case 'notifications': return renderNotifications();
              case 'appearance': return renderAppearance();
              case 'privacy': return renderPlaceholder('ความเป็นส่วนตัวและความปลอดภัย');
              case 'content': return renderPlaceholder('เนื้อหาและการใช้งาน');
              case 'billing': return renderPlaceholder('การชำระเงินและแพ็กเกจ');
              case 'support': return renderPlaceholder('ความช่วยเหลือและข้อมูลระบบ');
              default: return null;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
