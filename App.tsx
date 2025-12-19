
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ShiftAssistant from './components/ShiftAssistant';
import StaffDirectory from './components/StaffDirectory';
import MySchedule from './components/MySchedule';
import ScheduleManagement from './components/ScheduleManagement';
import Reports from './components/Reports';
import Settings from './components/Settings';
import { MOCK_SHIFTS, MOCK_ACTIVITIES, MOCK_ANNOUNCEMENTS, MOCK_STAFF } from './constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';

const App: React.FC = () => {
  const [currentView, setView] = useState('dashboard');

  // ข้อมูลสำหรับกราฟแท่ง (จำนวนพยาบาลต่อแผนก)
  const chartData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    MOCK_STAFF.forEach(staff => {
      counts[staff.ward] = (counts[staff.ward] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  // ข้อมูลสำหรับกราฟวงกลม (สัดส่วนภาระงานจำลอง)
  const pieData = [
    { name: 'ปฏิบัติหน้าที่ปกติ', value: 65, color: '#f4257b' },
    { name: 'ลาพักผ่อน', value: 15, color: '#ff8ebc' },
    { name: 'แลกเวร/อบรม', value: 20, color: '#fbcfe8' },
  ];

  const renderDashboard = () => (
    <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">
            สวัสดีค่ะ พยาบาลมาลี <span className="text-2xl">🙏</span>
          </h2>
          <p className="text-text-muted mt-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            วันพุธที่ 25 ตุลาคม 2566
          </p>
        </div>
        <button 
          onClick={() => setView('schedule_mgmt')}
          className="hidden md:flex items-center gap-2 bg-primary hover:bg-pink-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-pink-200 dark:shadow-none"
        >
          <span className="material-symbols-outlined text-[20px]">edit_calendar</span>
          จัดการตารางเวร
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          label="จำนวนเวรเดือนนี้" 
          value="18 เวร" 
          icon="calendar_view_month" 
          trend="+2%" 
          trendColor="text-emerald-600 dark:text-emerald-400" 
          iconBg="bg-pink-50 dark:bg-pink-900/20" 
          iconColor="text-primary" 
        />
        <StatCard 
          label="บุคลากรทั้งหมด" 
          value={`${MOCK_STAFF.length} ท่าน`} 
          icon="groups" 
          badge="กำลังออนไลน์" 
          iconBg="bg-orange-50 dark:bg-orange-900/20" 
          iconColor="text-orange-500" 
        />
        <StatCard 
          label="ชั่วโมงการทำงานสะสม" 
          value="144 ชั่วโมง" 
          icon="schedule" 
          trend="+5%" 
          trendColor="text-emerald-600 dark:text-emerald-400" 
          iconBg="bg-blue-50 dark:bg-blue-900/20" 
          iconColor="text-blue-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-text-main dark:text-white">จำนวนพยาบาลแยกตามแผนก</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f4257b11'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f4257b' : '#ff8ebc'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-text-main dark:text-white">สัดส่วนการปฏิบัติงานรวม</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Wide) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Upcoming Shift Card */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex flex-col md:row md:flex-row">
              <div className="w-full md:w-1/3 min-h-[200px] md:min-h-full bg-cover bg-center relative bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDwToo4tfzduzFkqn-215cf0-X0hlu4E5w3ic-g4ETMD6AZoUjuaSMNQhZ8ILNgsdrWvmlihfMhX5MsXscqK5uowtU1C5FZobeaq8bw1S7JLWqFGdtyO5RTgboaYZ3FomphqnXGvoZ234ziyKp_Ux6XjLtGwqHitoaGKfo-Drc463H43gDRyVmxECcpCnwfcHmIabjoA1ys3OxeQ5TrFRG7zmxfGM3oxL3MfiqwmulvDJ3nWUkiAprDmUjj6Uj36YUYnZJHVp8vDR0')]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                <div className="absolute bottom-4 left-4 text-white md:hidden">
                  <p className="font-bold text-lg">แผนก ICU</p>
                  <p className="text-sm opacity-90">อาคาร A, ชั้น 3</p>
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">เวรต่อไป</span>
                  <span className="text-text-muted text-xs font-medium">• เริ่มในอีก 14 ชั่วโมง</span>
                </div>
                <h3 className="text-2xl font-bold text-text-main dark:text-white mb-2">เวรที่จะถึง: แผนกไอซียู (ICU)</h3>
                <div className="flex flex-col gap-1 mb-6">
                  <div className="flex items-center gap-2 text-text-muted">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                    <span>พรุ่งนี้, 08:00 - 16:00</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                    <span>ผู้ร่วมเวร: พยาบาลจอย</span>
                  </div>
                  <div className="flex items-start gap-2 text-text-muted mt-2">
                    <span className="material-symbols-outlined text-[20px] text-orange-400">warning</span>
                    <span className="text-sm leading-relaxed">โปรดตรวจสอบระเบียบการเข้าเยี่ยมใหม่ก่อนเริ่มเวร</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setView('schedule')} className="bg-primary hover:bg-pink-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-pink-200 dark:shadow-none text-sm flex-1 md:flex-none justify-center flex items-center gap-2">
                    ดูรายละเอียด
                  </button>
                  <button className="bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 px-5 py-2.5 rounded-lg font-medium transition-colors text-sm flex-1 md:flex-none justify-center flex items-center gap-2">
                    ติดต่อเพื่อนร่วมงาน
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Hours Progress */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex justify-between items-end mb-3">
              <div>
                <h3 className="text-lg font-bold text-text-main dark:text-white">เป้าหมายชั่วโมงการทำงานรายเดือน</h3>
                <p className="text-sm text-text-muted">ติดตามชั่วโมงทำงานขั้นต่ำที่ต้องปฏิบัติหน้าที่</p>
              </div>
              <p className="text-lg font-bold text-primary">120<span className="text-text-muted font-normal text-sm">/160 ชม.</span></p>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full relative transition-all duration-1000" style={{ width: '75%' }}>
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between mt-3 text-sm">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">ตามเป้าหมาย</span>
              <span className="text-text-muted">เหลืออีก 40 ชั่วโมง</span>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-text-main dark:text-white">กิจกรรมล่าสุด</h3>
              <button className="text-primary text-sm font-bold hover:underline">ดูทั้งหมด</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-muted uppercase bg-gray-50 dark:bg-white/5">
                  <tr>
                    <th className="px-6 py-3 font-medium">กิจกรรม</th>
                    <th className="px-6 py-3 font-medium">วันที่</th>
                    <th className="px-6 py-3 font-medium">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {MOCK_ACTIVITIES.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-text-main dark:text-white">{activity.action}</td>
                      <td className="px-6 py-4 text-text-muted">{activity.date}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          activity.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                          activity.status === 'New' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                          'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        }`}>
                          {activity.status === 'Pending' ? 'รอดำเนินการ' : activity.status === 'New' ? 'ใหม่' : 'สำเร็จ'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Announcements Widget */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <h3 className="text-lg font-bold text-text-main dark:text-white">ประกาศข่าวสาร</h3>
            </div>
            <div className="space-y-4">
              {MOCK_ANNOUNCEMENTS.map((a) => (
                <div key={a.id} className={`p-4 rounded-lg bg-gray-50 dark:bg-white/5 border-l-4 ${a.severity === 'warning' ? 'border-orange-400' : 'border-primary'}`}>
                  <p className="text-xs text-text-muted font-bold mb-1">{a.department} • {a.date}</p>
                  <p className="text-sm font-medium text-text-main dark:text-white leading-relaxed">{a.content}</p>
                </div>
              ))}
            </div>
            <button className="w-full py-2 text-sm text-text-muted hover:text-primary font-medium transition-colors">ดูประกาศทั้งหมด</button>
          </div>

          {/* Who is on Duty */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-main dark:text-white">กำลังปฏิบัติหน้าที่: ICU</h3>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">ออนดีวตี้</span>
            </div>
            <div className="flex flex-col gap-3">
              {MOCK_STAFF.map((staff) => (
                <div key={staff.id} className="flex items-center gap-3">
                  <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-green-500" style={{ backgroundImage: `url('${staff.avatar}')` }}></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-text-main dark:text-white">{staff.name}</p>
                    <p className="text-xs text-text-muted">{staff.role}</p>
                  </div>
                  <button className="bg-gray-100 dark:bg-white/10 p-2 rounded-full text-text-muted hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setView('schedule')}
              className="bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow group"
            >
              <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">event_available</span>
              <span className="text-xs font-bold text-text-main dark:text-white">เวรของฉัน</span>
            </button>
            <button 
              onClick={() => setView('schedule_mgmt')}
              className="bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow group"
            >
              <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">edit_calendar</span>
              <span className="text-xs font-bold text-text-main dark:text-white">จัดตารางเวร</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'staff':
        return <StaffDirectory />;
      case 'schedule':
        return <MySchedule />;
      case 'schedule_mgmt':
        return <ScheduleManagement />;
      case 'reports':
        return <Reports />; // Added Reports component
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center flex-1 p-8 text-center gap-4">
            <span className="material-symbols-outlined text-6xl text-primary/30">construction</span>
            <h2 className="text-2xl font-bold">ส่วนงาน {currentView}</h2>
            <p className="text-text-muted">หน้านี้กำลังอยู่ระหว่างการพัฒนา โปรดกลับมาตรวจสอบใหม่ภายหลัง!</p>
            <button 
              onClick={() => setView('dashboard')}
              className="bg-primary text-white px-6 py-2 rounded-full font-bold"
            >
              กลับหน้าแรก
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <Sidebar currentView={currentView} setView={setView} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-8 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCmhjXQBrareP_EtK5fSMOKLSpIJH_Q5JkaiEbUCEk-aOyFASiT2mj-6RJgTED9cdigUAPa64fHuF5MHjDwWJFqEYFEeh179SUQUFWBG76eKGcyfiXfMllJjHJkQsYflDXfKDbWWnmcKsbUuj81gqoKOz0rxqgo37d4Zr7uXHqSIZkDUUHqWEGKBjdnDTv-Ieq9bxIVXQp2XxJAzQZdATEKGoGaMJ7qBS7JtVGn4fRV1jj92j1GoNWTFnQ7dNKyuuzxHlfX3ho3aq0')]"></div>
            <span className="font-bold text-text-main dark:text-white">รพ. เทพสตรี</span>
          </div>
          <button className="text-text-main dark:text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        {renderContent()}

        {/* AI Assistant FAB */}
        <ShiftAssistant />
      </main>
    </div>
  );
};

export default App;
