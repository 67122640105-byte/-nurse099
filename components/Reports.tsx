
import React, { useState, useEffect, useMemo } from 'react';

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const WEEKDAYS_TH = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

interface AssignedShift {
  staffId: string;
  staffName: string;
  shiftType: 'morning' | 'afternoon' | 'night';
}

const Reports: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2023);
  const [selectedMonth, setSelectedMonth] = useState(9); // ตุลาคม
  const [allSchedules, setAllSchedules] = useState<Record<string, AssignedShift[]>>({});

  useEffect(() => {
    const saved = localStorage.getItem('thepsatri_schedules');
    if (saved) {
      setAllSchedules(JSON.parse(saved));
    }
  }, []);

  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const reportData = useMemo(() => {
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${selectedYear}-${selectedMonth}-${d}`;
      const shifts = allSchedules[dateKey] || [];
      if (shifts.length > 0) {
        const dayOfWeek = new Date(selectedYear, selectedMonth, d).getDay();
        days.push({ day: d, weekday: WEEKDAYS_TH[dayOfWeek], shifts });
      }
    }
    return days;
  }, [allSchedules, selectedMonth, selectedYear, daysInMonth]);

  const getShiftBadge = (type: string) => {
    switch (type) {
      case 'morning': return <span className="px-2 py-0.5 rounded-full bg-pink-100 text-primary text-[10px] font-bold">เช้า</span>;
      case 'afternoon': return <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold">บ่าย</span>;
      case 'night': return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 text-[10px] font-bold">ดึก</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-text-main dark:text-white">รายงานตารางเวร</h2>
          <p className="text-text-muted mt-1">สรุปข้อมูลการปฏิบัติงานรายเดือน</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-surface-dark px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <span className="material-symbols-outlined text-text-muted text-sm">event</span>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold outline-none"
            >
              {THAI_MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold outline-none"
            >
              {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y + 543}</option>)}
            </select>
          </div>
          <button className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
            <span className="material-symbols-outlined text-sm">print</span>
            พิมพ์รายงาน
          </button>
        </div>
      </div>

      {reportData.length > 0 ? (
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">วันที่</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">พยาบาลที่ปฏิบัติหน้าที่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {reportData.map((item) => (
                  <tr key={item.day} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5 align-top">
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-text-main dark:text-white">{item.day}</span>
                        <span className="text-xs font-bold text-text-muted">{item.weekday}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-4">
                        {item.shifts.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-2xl min-w-[180px]">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-bold text-text-main dark:text-white">{s.staffName}</span>
                              {getShiftBadge(s.shiftType)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-dark p-20 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center gap-4">
          <div className="size-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-text-muted opacity-30">event_busy</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-main dark:text-white">ไม่มีข้อมูลตารางเวร</h3>
            <p className="text-text-muted text-sm mt-1">ไม่พบข้อมูลการจัดเวรในเดือน {THAI_MONTHS[selectedMonth]} {selectedYear + 543}</p>
          </div>
          <button 
            onClick={() => window.location.hash = '#schedule_mgmt'} // This won't work directly with current App state, but gives user context
            className="text-primary font-bold text-sm hover:underline mt-2"
          >
            ไปที่เมนูจัดตารางเวร
          </button>
        </div>
      )}
    </div>
  );
};

export default Reports;
