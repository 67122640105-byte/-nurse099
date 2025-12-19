
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_STAFF } from '../constants';
import { StaffMember } from '../types';

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_TH = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

interface AssignedShift {
  staffId: string;
  staffName: string;
  shiftType: 'morning' | 'afternoon' | 'night';
}

const ScheduleManagement: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2023);
  const [selectedMonth, setSelectedMonth] = useState(9); // ตุลาคม (0-indexed)
  const [hoveredStaff, setHoveredStaff] = useState<StaffMember | null>(null);
  
  // สถานะการบันทึก
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // สถานะการจัดเวร (Date String -> AssignedShift[])
  const [schedule, setSchedule] = useState<Record<string, AssignedShift[]>>({});
  
  // สถานะ Modal การจัดเวร
  const [isAssigning, setIsAssigning] = useState<number | null>(null);
  const [selectedShiftType, setSelectedShiftType] = useState<'morning' | 'afternoon' | 'night'>('morning');

  // โหลดข้อมูลจาก LocalStorage เมื่อเปลี่ยนเดือนหรือปี
  useEffect(() => {
    const saved = localStorage.getItem('thepsatri_schedules');
    if (saved) {
      const allSchedules = JSON.parse(saved);
      // เราเก็บข้อมูลทั้งหมดไว้ใน Object เดียว โดยใช้คีย์ที่รวมปีและเดือนไว้ด้วย หรือกรองเอาเฉพาะเดือนที่เลือก
      setSchedule(allSchedules || {});
    }
  }, []);

  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const firstDayOfWeek = useMemo(() => {
    return new Date(selectedYear, selectedMonth, 1).getDay();
  }, [selectedYear, selectedMonth]);

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [daysInMonth, firstDayOfWeek]);

  // คำนวณสรุปภาระงานรายบุคคล
  const workloadSummary = useMemo(() => {
    const summary: Record<string, { morning: number; afternoon: number; night: number; total: number }> = {};
    
    MOCK_STAFF.forEach(s => {
      summary[s.id] = { morning: 0, afternoon: 0, night: 0, total: 0 };
    });

    // กรองเฉพาะเวรในเดือนและปีที่เลือกเพื่อสรุปภาระงาน
    // Fix: Using Object.keys and explicit lookup to resolve 'unknown' type inference issue with Object.entries destructured values
    Object.keys(schedule).forEach((dateKey) => {
      if (dateKey.startsWith(`${selectedYear}-${selectedMonth}-`)) {
        const shifts = schedule[dateKey];
        if (Array.isArray(shifts)) {
          shifts.forEach((shift: AssignedShift) => {
            if (summary[shift.staffId]) {
              summary[shift.staffId][shift.shiftType]++;
              summary[shift.staffId].total++;
            }
          });
        }
      }
    });

    return summary;
  }, [schedule, selectedMonth, selectedYear]);

  const isStaffUnavailable = (staff: StaffMember, day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);
    const dayNameEn = WEEKDAYS_EN[date.getDay()];
    return staff.unavailableDays?.includes(dayNameEn);
  };

  const handleAssignStaff = (staff: StaffMember, day: number) => {
    const dateKey = `${selectedYear}-${selectedMonth}-${day}`;
    const currentDayShifts = schedule[dateKey] || [];
    
    if (currentDayShifts.some(s => s.staffId === staff.id && s.shiftType === selectedShiftType)) {
      setSchedule({
        ...schedule,
        [dateKey]: currentDayShifts.filter(s => !(s.staffId === staff.id && s.shiftType === selectedShiftType))
      });
    } else {
      setSchedule({
        ...schedule,
        [dateKey]: [...currentDayShifts, { staffId: staff.id, staffName: staff.name, shiftType: selectedShiftType }]
      });
    }
  };

  const removeShift = (dateKey: string, staffId: string, type: string) => {
    setSchedule({
      ...schedule,
      [dateKey]: schedule[dateKey].filter(s => !(s.staffId === staffId && s.shiftType === type))
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    // บันทึกลง LocalStorage
    setTimeout(() => {
      const saved = localStorage.getItem('thepsatri_schedules');
      const allSchedules = saved ? JSON.parse(saved) : {};
      
      // รวมข้อมูลใหม่เข้ากับข้อมูลเดิม (Update/Merge)
      const updatedSchedules = { ...allSchedules, ...schedule };
      localStorage.setItem('thepsatri_schedules', JSON.stringify(updatedSchedules));
      
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const getShiftColor = (type: string) => {
    switch(type) {
      case 'morning': return 'bg-pink-100 text-primary border-pink-200';
      case 'afternoon': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'night': return 'bg-purple-100 text-purple-600 border-purple-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 right-8 z-[100] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8">
          <span className="material-symbols-outlined">check_circle</span>
          <div className="font-bold">บันทึกตารางเวรเรียบร้อยแล้ว!</div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-text-main dark:text-white">จัดตารางเวรบุคลากร</h2>
          <p className="text-text-muted">เลือกพยาบาลและกะการทำงานเพื่อวางแผนตารางเวรประจำเดือน</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => {
                if(confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลตารางเวรที่ยังไม่ได้บันทึก?')) {
                    setSchedule({});
                }
            }}
            className="px-4 py-2 text-sm font-bold text-text-muted hover:text-red-500 transition-colors"
          >
            ล้างตารางทั้งหมด
          </button>
          
          <div className="flex items-center gap-2 bg-surface-light dark:bg-surface-dark px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-text-main dark:text-white outline-none"
            >
              {THAI_MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-text-main dark:text-white outline-none"
            >
              {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y + 543}</option>)}
            </select>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`bg-primary hover:bg-pink-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-pink-200 dark:shadow-none ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
          >
            <span className="material-symbols-outlined">{isSaving ? 'sync' : 'save'}</span>
            {isSaving ? 'กำลังบันทึก...' : 'บันทึกตารางเวร'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left: Workload Summary Panel */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-main dark:text-white">
              <span className="material-symbols-outlined text-primary">analytics</span>
              สรุปภาระงาน (เวร)
            </h3>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {MOCK_STAFF.map(staff => {
                const stats = workloadSummary[staff.id];
                return (
                  <div 
                    key={staff.id}
                    onMouseEnter={() => setHoveredStaff(staff)}
                    onMouseLeave={() => setHoveredStaff(null)}
                    className={`flex flex-col gap-2 p-3 rounded-2xl transition-all border ${
                      hoveredStaff?.id === staff.id 
                        ? 'bg-primary/5 border-primary/20 shadow-sm scale-[1.02]' 
                        : 'bg-gray-50 dark:bg-white/5 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={staff.avatar} className="w-8 h-8 rounded-full" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate dark:text-white">{staff.name}</p>
                        <p className="text-[10px] text-text-muted">{staff.ward}</p>
                      </div>
                      <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{stats.total}</span>
                    </div>
                    
                    <div className="flex gap-1">
                      <div className="h-1 flex-1 bg-pink-200 dark:bg-pink-900/30 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(stats.morning / 10) * 100}%` }}></div>
                      </div>
                      <div className="h-1 flex-1 bg-orange-200 dark:bg-orange-900/30 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: `${(stats.afternoon / 10) * 100}%` }}></div>
                      </div>
                      <div className="h-1 flex-1 bg-purple-200 dark:bg-purple-900/30 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${(stats.night / 10) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">
                <span>สัญลักษณ์กะ</span>
                <span className="material-symbols-outlined text-[14px]">info</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/20">
                  <span className="text-[10px] font-bold text-primary">เช้า</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                  <span className="text-[10px] font-bold text-orange-600">บ่าย</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20">
                  <span className="text-[10px] font-bold text-purple-600">ดึก</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Management Calendar Grid */}
        <div className="xl:col-span-3 bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden relative">
          {isSaving && (
            <div className="absolute inset-0 z-10 bg-white/50 dark:bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="font-bold text-primary">กำลังบันทึกข้อมูล...</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-7 mb-6 gap-2">
            {WEEKDAYS_TH.map(day => (
              <div key={day} className="text-center text-xs font-extrabold text-text-muted uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {calendarDays.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} className="min-h-[120px] bg-gray-50/30 dark:bg-white/5 rounded-2xl border border-dashed border-gray-100 dark:border-gray-800 opacity-20"></div>;
              
              const dateKey = `${selectedYear}-${selectedMonth}-${day}`;
              const assigned = schedule[dateKey] || [];
              
              return (
                <div 
                  key={day} 
                  onClick={() => setIsAssigning(day)}
                  className={`group relative min-h-[120px] bg-white dark:bg-surface-dark border rounded-2xl p-2 transition-all flex flex-col cursor-pointer ${
                    isAssigning === day 
                      ? 'ring-2 ring-primary border-primary bg-primary/5 shadow-inner' 
                      : 'border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-primary/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-extrabold text-text-muted">{day}</span>
                    {assigned.length > 0 && (
                      <span className="text-[10px] font-black bg-primary text-white size-5 flex items-center justify-center rounded-full shadow-sm animate-in zoom-in">
                        {assigned.length}
                      </span>
                    )}
                  </div>
                  
                  {/* Hover Status Indicator */}
                  {hoveredStaff && (
                    <div className="absolute top-2 right-2">
                      {isStaffUnavailable(hoveredStaff, day) ? (
                        <div className="flex items-center gap-1 text-[8px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[12px]">block</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Assigned Shifts List */}
                  <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1 max-h-[80px]">
                    {assigned.map((s, i) => (
                      <div 
                        key={`${s.staffId}-${i}`} 
                        onClick={(e) => { e.stopPropagation(); removeShift(dateKey, s.staffId, s.shiftType); }}
                        className={`group/item flex items-center justify-between gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold border transition-all hover:scale-105 active:scale-95 ${getShiftColor(s.shiftType)}`}
                      >
                        <span className="truncate">{s.staffName.split(' ')[1] || s.staffName}</span>
                        <span className="material-symbols-outlined text-[10px] hidden group-hover/item:block text-red-400">cancel</span>
                      </div>
                    ))}
                  </div>

                  {assigned.length === 0 && !hoveredStaff && (
                    <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-primary/30 text-3xl">add_circle</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal จัดเวร */}
      {isAssigning && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-light dark:bg-surface-dark w-full max-w-lg rounded-3xl shadow-2xl p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-text-main dark:text-white">จัดเวรวันที่ {isAssigning} {THAI_MONTHS[selectedMonth]}</h3>
                <p className="text-sm text-text-muted">เลือกกะการทำงานและรายชื่อพยาบาล</p>
              </div>
              <button 
                onClick={() => setIsAssigning(null)}
                className="size-10 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* เลือกกะ */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl">
              {[
                { id: 'morning', label: 'เช้า', icon: 'wb_twilight' },
                { id: 'afternoon', label: 'บ่าย', icon: 'wb_sunny' },
                { id: 'night', label: 'ดึก', icon: 'dark_mode' }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedShiftType(type.id as any)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                    selectedShiftType === type.id 
                      ? 'bg-white dark:bg-surface-dark shadow-md text-primary' 
                      : 'text-text-muted hover:text-text-main dark:hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined">{type.icon}</span>
                  <span className="text-xs font-bold">{type.label}</span>
                </button>
              ))}
            </div>

            {/* รายชื่อพยาบาลสำหรับเลือก */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {MOCK_STAFF.map(staff => {
                const unavailable = isStaffUnavailable(staff, isAssigning);
                const dateKey = `${selectedYear}-${selectedMonth}-${isAssigning}`;
                const isAssigned = schedule[dateKey]?.some(s => s.staffId === staff.id && s.shiftType === selectedShiftType);
                const assignedOtherShift = schedule[dateKey]?.find(s => s.staffId === staff.id && s.shiftType !== selectedShiftType);
                
                return (
                  <button
                    key={staff.id}
                    disabled={!!assignedOtherShift}
                    onClick={() => handleAssignStaff(staff, isAssigning)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                      isAssigned 
                        ? 'border-primary bg-primary/10 shadow-sm' 
                        : assignedOtherShift
                          ? 'opacity-40 grayscale cursor-not-allowed bg-gray-100 dark:bg-white/5 border-transparent'
                          : unavailable 
                            ? 'border-red-100 bg-red-50/50 opacity-60' 
                            : 'border-gray-50 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:border-primary/30'
                    }`}
                  >
                    <img src={staff.avatar} className="size-10 rounded-full border border-gray-200" alt="" />
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-bold ${isAssigned ? 'text-primary' : 'dark:text-white'}`}>{staff.name}</p>
                      <p className="text-[10px] text-text-muted">{staff.ward}</p>
                    </div>
                    {isAssigned && (
                      <span className="material-symbols-outlined text-primary animate-in zoom-in">check_circle</span>
                    )}
                    {assignedOtherShift && (
                      <div className="text-[10px] font-bold text-text-muted">ขึ้นกะอื่นแล้ว</div>
                    )}
                    {unavailable && !isAssigned && !assignedOtherShift && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                        <span className="material-symbols-outlined text-sm">block</span>
                        ไม่สะดวก
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setIsAssigning(null)}
              className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-pink-200 dark:shadow-none hover:bg-pink-600 active:scale-[0.98] transition-all"
            >
              เสร็จสิ้นการจัดเวรวันนี้
            </button>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f4257b44; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ScheduleManagement;
