
import React, { useState } from 'react';
import { StaffMember } from '../types';
import { MOCK_STAFF } from '../constants';

const DAYS = [
  { en: 'Monday', th: 'วันจันทร์' },
  { en: 'Tuesday', th: 'วันอังคาร' },
  { en: 'Wednesday', th: 'วันพุธ' },
  { en: 'Thursday', th: 'วันพฤหัสบดี' },
  { en: 'Friday', th: 'วันศุกร์' },
  { en: 'Saturday', th: 'วันเสาร์' },
  { en: 'Sunday', th: 'วันอาทิตย์' }
];

const StaffDirectory: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>(MOCK_STAFF);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: '',
    ward: '',
    phone: '',
    avatar: 'https://picsum.photos/seed/' + Math.random() + '/200',
    unavailableDays: [],
    availableDays: []
  });

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.ward.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDay = (dayEn: string, type: 'available' | 'unavailable') => {
    const field = type === 'available' ? 'availableDays' : 'unavailableDays';
    const currentDays = formData[field] || [];
    if (currentDays.includes(dayEn)) {
      setFormData({ ...formData, [field]: currentDays.filter(d => d !== dayEn) });
    } else {
      setFormData({ ...formData, [field]: [...currentDays, dayEn] });
    }
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff: StaffMember = {
      id: Date.now().toString(),
      name: formData.name || 'ไม่ระบุชื่อ',
      role: 'พยาบาลวิชาชีพ',
      avatar: formData.avatar || `https://picsum.photos/seed/${Date.now()}/200`,
      onDuty: false,
      ward: formData.ward || 'แผนกทั่วไป',
      phone: formData.phone,
      availableDays: formData.availableDays,
      unavailableDays: formData.unavailableDays
    };
    setStaffList([newStaff, ...staffList]);
    setIsModalOpen(false);
    setFormData({ name: '', ward: '', phone: '', avatar: '', availableDays: [], unavailableDays: [] });
  };

  const getDayLabel = (enName: string) => {
    return DAYS.find(d => d.en === enName)?.th || enName;
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-main dark:text-white">รายชื่อพยาบาล</h2>
          <p className="text-text-muted">จัดการข้อมูลบุคลากรและความพร้อมในการปฏิบัติงาน</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-pink-200 dark:shadow-none"
        >
          <span className="material-symbols-outlined">person_add</span>
          เพิ่มพยาบาลใหม่
        </button>
      </div>

      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">search</span>
        <input 
          type="text" 
          placeholder="ค้นหาตามชื่อหรือแผนก..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map(nurse => (
          <div key={nurse.id} className="bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <img src={nurse.avatar} alt={nurse.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/10" />
              <div className="flex-1">
                <h4 className="text-lg font-bold text-text-main dark:text-white">{nurse.name}</h4>
                <p className="text-primary text-sm font-bold">{nurse.ward}</p>
                <div className="flex items-center gap-1 text-text-muted text-xs mt-1">
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  {nurse.phone || 'ไม่ได้ระบุเบอร์โทร'}
                </div>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-gray-50 dark:border-white/5">
              <div>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">วันที่สะดวก</p>
                <div className="flex flex-wrap gap-1">
                  {nurse.availableDays?.length ? nurse.availableDays.map(d => (
                    <span key={d} className="text-[10px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                      {getDayLabel(d)}
                    </span>
                  )) : <span className="text-[10px] text-text-muted italic">ไม่ระบุ</span>}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mb-1">วันที่ไม่สะดวก</p>
                <div className="flex flex-wrap gap-1">
                  {nurse.unavailableDays?.length ? nurse.unavailableDays.map(d => (
                    <span key={d} className="text-[10px] bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full font-medium">
                      {getDayLabel(d)}
                    </span>
                  )) : <span className="text-[10px] text-text-muted italic">ไม่มี</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Nurse Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface-light dark:bg-surface-dark w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">ลงทะเบียนพยาบาลใหม่</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-main dark:hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-muted">ชื่อ-นามสกุล</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="เช่น พยาบาลสมศรี ใจดี"
                    className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-muted">แผนก / วอร์ด</label>
                  <input 
                    required
                    type="text" 
                    value={formData.ward}
                    onChange={(e) => setFormData({...formData, ward: e.target.value})}
                    placeholder="เช่น ICU, ฉุกเฉิน"
                    className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-muted">เบอร์โทรศัพท์</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="08X-XXX-XXXX"
                    className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-muted">URL รูปภาพ</label>
                  <input 
                    type="url" 
                    value={formData.avatar}
                    onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                    placeholder="https://..."
                    className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-text-muted block">ตั้งค่าความสะดวกในการเข้าเวร</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Available Days */}
                  <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      วันที่สะดวก
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {DAYS.map(day => (
                        <label key={day.en} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox"
                            checked={formData.availableDays?.includes(day.en)}
                            onChange={() => toggleDay(day.en, 'available')}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-xs font-medium text-text-muted group-hover:text-text-main dark:group-hover:text-white">{day.th}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Unavailable Days */}
                  <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
                    <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">block</span>
                      วันที่ไม่สะดวก
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {DAYS.map(day => (
                        <label key={day.en} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox"
                            checked={formData.unavailableDays?.includes(day.en)}
                            onChange={() => toggleDay(day.en, 'unavailable')}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-xs font-medium text-text-muted group-hover:text-text-main dark:group-hover:text-white">{day.th}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 font-bold text-text-muted hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-3 bg-primary hover:bg-pink-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-200 dark:shadow-none"
                >
                  ลงทะเบียนพยาบาล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDirectory;
