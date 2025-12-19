
import { Activity, Announcement, Shift, StaffMember } from './types';

export const MOCK_SHIFTS: Shift[] = [
  {
    id: '1',
    ward: 'แผนกไอซียู (ICU)',
    date: '2023-10-25',
    startTime: '08:00',
    endTime: '16:00',
    partner: 'พยาบาลจอย',
    building: 'อาคาร A',
    floor: 'ชั้น 3',
    notes: 'ตรวจสอบระเบียบการเข้าเยี่ยมผู้ป่วยใหม่ก่อนเริ่มปฏิบัติหน้าที่'
  },
  {
    id: '2',
    ward: 'แผนกฉุกเฉิน (ER)',
    date: '2023-10-27',
    startTime: '16:00',
    endTime: '00:00',
    partner: 'พยาบาลเคน',
    building: 'อาคาร B',
    floor: 'ชั้น 1',
    notes: 'เตรียมพร้อมรับเคสฉุกเฉินจากเทศกาล'
  },
  {
    id: '3',
    ward: 'แผนกไอซียู (ICU)',
    date: '2023-10-28',
    startTime: '08:00',
    endTime: '16:00',
    partner: 'พยาบาลแอนนา',
    building: 'อาคาร A',
    floor: 'ชั้น 3',
    notes: 'ดูแลเคสผ่าตัดหัวใจช่วงเช้า'
  },
  {
    id: '4',
    ward: 'แผนกผู้ป่วยนอก (OPD)',
    date: '2023-10-31',
    startTime: '08:00',
    endTime: '16:00',
    partner: 'พยาบาลแมว',
    building: 'อาคาร C',
    floor: 'ชั้น 2',
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', action: 'ส่งคำขอแลกเวรถึงพยาบาลจอย', date: '24 ต.ค., 10:30 น.', status: 'Pending' },
  { id: '2', action: 'ประกาศตารางเวรเดือนพฤศจิกายน', date: '23 ต.ค., 09:00 น.', status: 'New' },
  { id: '3', action: 'ปฏิบัติหน้าที่เสร็จสิ้น: แผนกฉุกเฉิน', date: '22 ต.ค., 16:00 น.', status: 'Done' }
];

export const MOCK_STAFF: StaffMember[] = [
  { 
    id: '1', 
    name: 'นพ. สมชาย', 
    role: 'หัวหน้าแพทย์', 
    avatar: 'https://picsum.photos/seed/doctor1/200', 
    onDuty: true, 
    ward: 'ICU' 
  },
  { 
    id: '2', 
    name: 'พยาบาล แอนนา', 
    role: 'พยาบาลวิชาชีพอาวุโส', 
    avatar: 'https://picsum.photos/seed/nurse1/200', 
    onDuty: true, 
    ward: 'ICU' 
  },
  { 
    id: '3', 
    name: 'พยาบาล เคน', 
    role: 'พยาบาลวิชาชีพ', 
    avatar: 'https://picsum.photos/seed/nurse2/200', 
    onDuty: true, 
    ward: 'ICU' 
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    department: 'ฝ่ายบุคคล',
    date: 'วันนี้',
    content: 'โครงการฉีดวัคซีนไข้หวัดใหญ่สำหรับบุคลากรจะเริ่มในวันจันทร์หน้า โปรดลงทะเบียนที่คลินิก',
    severity: 'normal'
  },
  {
    id: '2',
    department: 'หัวหน้าวอร์ด',
    date: 'เมื่อวาน',
    content: 'ลิฟต์ B ปิดปรับปรุงชั่วคราว โปรดใช้ลิฟต์บริการ C แทน',
    severity: 'warning'
  }
];
