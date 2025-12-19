
import React from 'react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'หน้าแรก', icon: 'dashboard' },
    { id: 'schedule', label: 'ตารางเวรของฉัน', icon: 'calendar_month' },
    { id: 'staff', label: 'รายชื่อพยาบาล', icon: 'groups' },
    { id: 'schedule_mgmt', label: 'จัดตารางเวร', icon: 'edit_calendar' },
    { id: 'reports', label: 'รายงาน', icon: 'description' }, // Added Reports menu
    { id: 'settings', label: 'ตั้งค่า', icon: 'settings' },
  ];

  return (
    <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-gray-100 dark:border-gray-800 flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-20">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-3">
          <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 shadow-sm border border-primary/20 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFN4FmKbo7co9GQr_rlPib7BzM3Qp8hrlf54IfV7GM5OqzBNJiaF6yk7UEnUOrIPE287Wc8PKVntnSFIE4rHPdCfEQy0sdxLOBjQCWuzyupSCFlZNij-aVFP7GaP0wiVHxeqntmSnRBpstgww0k6D8mMdo5dOdpkums9fJ6_hUckzOCDaodk78p8AIrtnUx1OZqvpG-BsJMn-lPb4IY8Aq1D163OvX9H_sigoMcA1nZ1P4aqBI1SD4p7T38vKZgn6vE_yV1YC-vTs')]"></div>
          <div className="flex flex-col">
            <h1 className="text-text-main dark:text-white text-base font-bold leading-tight">รพ. เทพสตรี</h1>
            <p className="text-primary text-xs font-medium">ระบบพยาบาล</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full text-left ${
                currentView === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:bg-gray-50 dark:hover:bg-white/5 hover:text-text-main dark:hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined ${currentView === item.id ? 'fill' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-sm ${currentView === item.id ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
          <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuB4lZCRuPS90L-_kDgK9GqwIRVOehET9lTlfffpJ9TK3WSVKvusKjtKZSpbx3OGp-HpnWKA5LpKUMiUfGh6DeavboGCi19zteuB659ipbZ_58Nrx6LaFK77du_N99eIdOSwEGhpiccBkT8stO9SaHhzBlnHT3iuL9wXPoAs9sRgYRIpUyqoGmYWpDT6YKclcIvv1j4wzX-S5DraMzMMN_hIrdnUx1OZqvpG-BsJMn-lPb4IY8Aq1D163OvX9H_sigoMcA1nZ1P4aqBI1SD4p7T38vKZgn6vE_yV1YC-vTs')]"></div>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-text-main dark:text-white">มาลี ใจดี</p>
            <p className="text-xs text-text-muted">หัวหน้าพยาบาล</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
