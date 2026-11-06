/**
 * Core Application Constants for DDUGU Smart Classroom System
 */

export const ACADEMIC_PERIODS = [
  { id: "P1", periodNumber: 1, startTime: "09:00", endTime: "10:00", label: "09:00 AM - 10:00 AM" },
  { id: "P2", periodNumber: 2, startTime: "10:00", endTime: "11:00", label: "10:00 AM - 11:00 AM" },
  { id: "P3", periodNumber: 3, startTime: "11:00", endTime: "12:00", label: "11:00 AM - 12:00 PM" },
  { id: "P4", periodNumber: 4, startTime: "12:00", endTime: "13:00", label: "12:00 PM - 01:00 PM" },
  { id: "LUNCH", periodNumber: 0, startTime: "13:00", endTime: "14:00", label: "01:00 PM - 02:00 PM (Recess/Lunch)" },
  { id: "P5", periodNumber: 5, startTime: "14:00", endTime: "15:00", label: "02:00 PM - 03:00 PM" },
  { id: "P6", periodNumber: 6, startTime: "15:00", endTime: "16:00", label: "03:00 PM - 04:00 PM" },
  { id: "P7", periodNumber: 7, startTime: "16:00", endTime: "17:00", label: "04:00 PM - 05:00 PM" },
] as const;

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DDUGU_DEPARTMENTS = [
  { code: "CSE", name: "Computer Science & Engineering", campus: "IET" as const },
  { code: "ECE", name: "Electronics & Communication Engineering", campus: "IET" as const },
  { code: "ME", name: "Mechanical Engineering", campus: "IET" as const },
  { code: "CE", name: "Civil Engineering", campus: "IET" as const },
  { code: "IT", name: "Information Technology", campus: "IET" as const },
  { code: "AS", name: "Applied Sciences & Humanities", campus: "IET" as const },
  { code: "MGMT", name: "Commerce & Business Studies", campus: "DEEKSHA_BHAWAN" as const },
  { code: "ARTS", name: "Faculty of Arts & Languages", campus: "DEEKSHA_BHAWAN" as const },
  { code: "SCI", name: "Faculty of Sciences", campus: "DEEKSHA_BHAWAN" as const },
] as const;

export const SMART_EQUIPMENT_TYPES = [
  { id: "SMART_BOARD", name: "Interactive Smart Board", icon: "Tv" },
  { id: "LASER_PROJECTOR", name: "Ultra-HD Laser Projector", icon: "Projector" },
  { id: "MIC_AUDIO", name: "Wireless Collar Mic & Sound System", icon: "Mic" },
  { id: "LECTURE_CAPTURE", name: "AI Auto-Tracking Lecture Camera", icon: "Video" },
  { id: "IOT_HVAC", name: "Automated HVAC & Climate Control", icon: "Wind" },
  { id: "BIOMETRIC_ATTENDANCE", name: "RFID / Biometric Punch Station", icon: "Fingerprint" },
] as const;

export const DEFAULT_PAGE_SIZE = 10;

