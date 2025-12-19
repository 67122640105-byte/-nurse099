
import React, { useState } from 'react';
import { MOCK_SHIFTS } from '../constants';
import { Shift } from '../types';

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const WEEKDAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

const MySchedule: React.FC = () => {
  // ตั้งค่าเป็นเดือนตุลาคม 2023 ตามบริบทของแอป
  const [currentYear] = useState(2023);
  const [currentMonth] = useState(9); // ตุลาคม (0-indexed)
  
  const [selectedDate, setSelectedDate] = useState<string | null>('2023-10-25');

  // สร้างอาร์เรย์ของวันในเดือน
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const calendarDays = [];
  // เพิ่มช่องว่างสำหรับวันก่อนหน้าของสัปดาห์
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // เพิ่มวันที่จริง
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const getShiftForDay = (day: number) => {
    const dateStr = `2023-10-${day.toString().padStart(2, '0')}`;
    return MOCK_SHIFTS.find(s => s.date === dateStr);
  };

  const selectedShift = MOCK_SHIFTS.find(s => s.date === selectedDate);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-main dark:text-white">ตารางเวรของฉัน</h2>
          <p className="text-text-muted mt-1">{THAI_MONTHS[currentMonth]} {currentYear + 543}</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ปฏิทินหลัก */}
        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 mb-4">
            {WEEKDAYS.map(wd => (
              <div key={wd} className="text-center text-sm font-bold text-text-muted py-2">{wd}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 md:gap-3">
            {calendarDays.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} className="h-16 md:h-24"></div>;
              
              const dateStr = `2023-10-${day.toString().padStart(2, '0')}`;
              const shift = getShiftForDay(day);
              const isSelected = selectedDate === dateStr;
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative h-16 md:h-24 rounded-2xl flex flex-col items-center justify-center transition-all group border-2 ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-transparent hover:border-primary/30 hover:bg-primary/5'
                  }`}
                >
                  <span className={`text-lg font-bold ${
                    shift 
                      ? 'text-primary' 
                      : 'text-text-main dark:text-white'
                  }`}>
                    {day}
                  </span>
                  
                  {shift && (
                    <div className="mt-1 flex flex-col items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                      <span className="hidden md:block text-[9px] font-bold text-primary mt-1 truncate max-w-full px-1">
                        {shift.ward.split(' ')[1] || shift.ward}
                      </span>
                    </div>
                  )}
                  
                  {!shift && day === 25 && (
                    <div className="absolute top-1 right-1">
                      <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* รายละเอียดเวร */}
        <div className="flex flex-col gap-6">
          <div className="bg-primary p-6 rounded-3xl text-white shadow-xl shadow-pink-200 dark:shadow-none animate-in fade-in slide-in-from-right-5">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">event_note</span>
              ข้อมูลเวรประจำวัน
            </h3>
            
            {selectedShift ? (
              <div className="space-y-6">
                <div>
                  <p className="text-xs opacity-80 uppercase font-bold tracking-wider mb-1">วันที่ปฏิบัติงาน</p>
                  <p className="text-lg font-bold">{selectedDate} (ตุลาคม)</p>
                </div>
                
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined">medical_services</span>
                    <span className="font-bold text-lg">{selectedShift.ward}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <span className="material-symbols-outlined text-[18px]">alarm</span>
                    <span>{selectedShift.startTime} - {selectedShift.endTime} น.</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs opacity-80 font-bold mb-1">สถานที่</p>
                    <p className="text-sm font-medium">{selectedShift.building}</p>
                    <p className="text-sm">{selectedShift.floor}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80 font-bold mb-1">คู่เวร</p>
                    <p className="text-sm font-medium">{selectedShift.partner}</p>
                  </div>
                </div>

                {selectedShift.notes && (
                  <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                    <p className="text-xs font-bold mb-1">หมายเหตุ:</p>
                    <p className="text-xs leading-relaxed">{selectedShift.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 bg-white text-primary py-2.5 rounded-xl font-bold text-sm hover:bg-pink-50 transition-colors shadow-lg">
                    แจ้งเข้าเวร (Clock-in)
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl transition-colors">
                    <span className="material-symbols-outlined">swap_horiz</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center opacity-80">
                <span className="material-symbols-outlined text-5xl mb-3">event_available</span>
                <p className="font-bold">ไม่มีการจัดเวรในวันนี้</p>
                <p className="text-sm">คุณสามารถพักผ่อนได้อย่างเต็มที่!</p>
              </div>
            )}
          </div>

          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">สรุปเวรในเดือนนี้</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg text-primary">
                    <span className="material-symbols-outlined">wb_twilight</span>
                  </div>
                  <span className="text-sm font-medium">เวรเช้า (08:00)</span>
                </div>
                <span className="font-bold">12 เวร</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-500">
                    <span className="material-symbols-outlined">wb_sunny</span>
                  </div>
                  <span className="text-sm font-medium">เวรบ่าย (16:00)</span>
                </div>
                <span className="font-bold">4 เวร</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-500">
                    <span className="material-symbols-outlined">dark_mode</span>
                  </div>
                  <span className="text-sm font-medium">เวรดึก (00:00)</span>
                </div>
                <span className="font-bold">2 เวร</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySchedule;
