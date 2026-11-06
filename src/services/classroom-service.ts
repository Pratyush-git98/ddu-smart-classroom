import type {
  Classroom,
  ClassroomFacility,
  ClassroomFilterParams,
  RoomEquipment,
  RoomStatus,
  RoomType,
} from "@/types";
import { mockDelay } from "./api-client";

type CatalogSeed = Omit<Classroom, "facilities"> & { facilities?: ClassroomFacility[] };

function deriveFacilities(room: {
  type: RoomType;
  hasAirConditioning: boolean;
  equipment: RoomEquipment[];
  computerCount?: number;
}): ClassroomFacility[] {
  const facilities: ClassroomFacility[] = [];
  if (room.equipment.some((item) => item.type === "LASER_PROJECTOR")) {
    facilities.push("PROJECTOR");
  }
  if (room.equipment.some((item) => item.type === "SMART_BOARD")) {
    facilities.push("SMART_BOARD");
  }
  if (room.type === "COMPUTER_LAB" || (room.computerCount ?? 0) > 0) {
    facilities.push("COMPUTERS");
  }
  if (room.hasAirConditioning) {
    facilities.push("AIR_CONDITIONING");
  }
  return facilities;
}

const CATALOG_SEED: CatalogSeed[] = [
  {
    id: "iet-cs-101",
    roomNumber: "CR-101",
    name: "CSE Smart Lecture Hall",
    campusId: "IET",
    block: "Block A (CSE & IT)",
    floor: 1,
    capacity: 75,
    type: "SMART_LECTURE_HALL",
    status: "OCCUPIED",
    currentOccupancy: 62,
    currentLecture: {
      subject: "Operating Systems (KCS-501)",
      facultyName: "Dr. Arvind Tripathi",
      courseCode: "B.Tech CSE - 5th Sem",
      endTime: "11:00 AM",
    },
    equipment: [
      { id: "eq-1", type: "SMART_BOARD", name: "86\" 4K Interactive Display", isOnline: true },
      { id: "eq-2", type: "LASER_PROJECTOR", name: "Optoma 5000L Projector", isOnline: true },
      { id: "eq-3", type: "MIC_AUDIO", name: "Sennheiser Dual Mic", isOnline: true },
      { id: "eq-4", type: "LECTURE_CAPTURE", name: "PTZ Auto-Tracking Camera", isOnline: true },
      { id: "eq-5", type: "IOT_HVAC", name: "Smart Dual AC Unit", isOnline: true },
      { id: "eq-6", type: "BIOMETRIC_ATTENDANCE", name: "RFID Biometric Console", isOnline: true },
    ],
    hasAirConditioning: true,
    hasRecordingSetup: true,
    isAccessibleForDisabled: true,
    blueprintUrl: null,
  },
  {
    id: "iet-cs-102",
    roomNumber: "CR-102",
    name: "Advanced AI & Cloud Lab",
    campusId: "IET",
    block: "Block A (CSE & IT)",
    floor: 1,
    capacity: 50,
    type: "COMPUTER_LAB",
    status: "AVAILABLE",
    currentOccupancy: 0,
    computerCount: 50,
    equipment: [
      { id: "eq-7", type: "SMART_BOARD", name: "75\" Interactive Touchscreen", isOnline: true },
      { id: "eq-8", type: "MIC_AUDIO", name: "Ceiling Array Mic", isOnline: true },
      { id: "eq-9", type: "IOT_HVAC", name: "Central Climate Controller", isOnline: true },
      { id: "eq-10", type: "BIOMETRIC_ATTENDANCE", name: "Wall Scanner A", isOnline: true },
    ],
    hasAirConditioning: true,
    hasRecordingSetup: false,
    isAccessibleForDisabled: true,
    blueprintUrl: null,
  },
  {
    id: "iet-cs-204",
    roomNumber: "CR-204",
    name: "CSE Tutorial Studio",
    campusId: "IET",
    block: "Block A (CSE & IT)",
    floor: 2,
    capacity: 28,
    type: "TUTORIAL_ROOM",
    status: "AVAILABLE",
    currentOccupancy: 0,
    equipment: [{ id: "eq-39", type: "LASER_PROJECTOR", name: "Ceiling LCD Projector", isOnline: true }],
    hasAirConditioning: false,
    hasRecordingSetup: false,
    isAccessibleForDisabled: true,
    blueprintUrl: null,
  },
  {
    id: "iet-ec-201",
    roomNumber: "EC-201",
    name: "Signal Processing Smart Room",
    campusId: "IET",
    block: "Block B (ECE & EE)",
    floor: 2,
    capacity: 65,
    type: "SMART_LECTURE_HALL",
    status: "AVAILABLE",
    currentOccupancy: 0,
    equipment: [
      { id: "eq-11", type: "LASER_PROJECTOR", name: "Epson PowerLite Laser", isOnline: true },
      { id: "eq-12", type: "MIC_AUDIO", name: "Wireless Lapel System", isOnline: true },
      { id: "eq-13", type: "IOT_HVAC", name: "Eco Cool Smart AC", isOnline: true },
    ],
    hasAirConditioning: true,
    hasRecordingSetup: true,
    isAccessibleForDisabled: false,
    blueprintUrl: null,
  },
  {
    id: "iet-me-301",
    roomNumber: "ME-301",
    name: "CAD / CAM Computing Lab",
    campusId: "IET",
    block: "Block C (ME & Civil)",
    floor: 3,
    capacity: 40,
    type: "COMPUTER_LAB",
    status: "AVAILABLE",
    currentOccupancy: 0,
    computerCount: 40,
    equipment: [
      { id: "eq-40", type: "LASER_PROJECTOR", name: "Short-throw Projector", isOnline: true },
      { id: "eq-41", type: "IOT_HVAC", name: "Split AC Cluster", isOnline: true },
    ],
    hasAirConditioning: true,
    hasRecordingSetup: false,
    isAccessibleForDisabled: false,
    blueprintUrl: null,
  },
  {
    id: "iet-conf-110",
    roomNumber: "IET-CF1",
    name: "HoD Conference Room",
    campusId: "IET",
    block: "Central Administration Wing",
    floor: 1,
    capacity: 18,
    type: "CONFERENCE_ROOM",
    status: "AVAILABLE",
    currentOccupancy: 0,
    equipment: [
      { id: "eq-42", type: "SMART_BOARD", name: "65\" Boardroom Display", isOnline: true },
      { id: "eq-43", type: "MIC_AUDIO", name: "Table Conference Mics", isOnline: true },
      { id: "eq-44", type: "IOT_HVAC", name: "Room AC", isOnline: true },
    ],
    hasAirConditioning: true,
    hasRecordingSetup: false,
    isAccessibleForDisabled: true,
    blueprintUrl: null,
  },
  {
    id: "iet-sh-01",
    roomNumber: "IET-SH1",
    name: "IET Main Seminar Hall",
    campusId: "IET",
    block: "Central Administration Wing",
    floor: 0,
    capacity: 220,
    type: "SEMINAR_HALL",
    status: "RESERVED",
    currentLecture: {
      subject: "Annual Technical Symposium 2026",
      facultyName: "Dean Academics & IET Council",
      courseCode: "All Engineering Branches",
      endTime: "01:00 PM",
    },
    equipment: [
      { id: "eq-14", type: "SMART_BOARD", name: "Dual Stage LED Display", isOnline: true },
      { id: "eq-15", type: "LASER_PROJECTOR", name: "Dual Laser Projection System", isOnline: true },
      { id: "eq-16", type: "MIC_AUDIO", name: "8-Channel Podium & Handheld Mics", isOnline: true },
      { id: "eq-17", type: "LECTURE_CAPTURE", name: "Broadcast 3-Camera Rig", isOnline: true },
      { id: "eq-18", type: "IOT_HVAC", name: "VRF Central Air Conditioning", isOnline: true },
    ],
    hasAirConditioning: true,
    hasRecordingSetup: true,
    isAccessibleForDisabled: true,
    blueprintUrl: null,
  },
  {
    id: "db-lt-01",
    roomNumber: "DB-LT1",
    name: "Tiered Lecture Theatre 1",
    campusId: "DEEKSHA_BHAWAN",
    block: "Ground Floor East Wing",
    floor: 0,
    capacity: 140,
    type: "SMART_LECTURE_HALL",
    status: "OCCUPIED",
    currentOccupancy: 128,
    currentLecture: {
      subject: "Managerial Economics (MBA-102)",
      facultyName: "Prof. Sudhir Srivastava",
      courseCode: "Dept. of Commerce & MBA",
      endTime: "11:30 AM",
    },
    equipment: [
      { id: "eq-19", type: "SMART_BOARD", name: "Maxhub 98\" Interactive Flat Panel", isOnline: true },
      { id: "eq-20", type: "MIC_AUDIO", name: "Acoustic Stage Mic Array", isOnline: true },
      { id: "eq-21", type: "LECTURE_CAPTURE", name: "AI Camera With Speaker Tracking", isOnline: true },
      { id: "eq-22", type: "IOT_HVAC", name: "Central Chilled Water AC", isOnline: true },
      { id: "eq-23", type: "BIOMETRIC_ATTENDANCE", name: "Dual RFID Turnstiles", isOnline: true },
    ],
    hasAirConditioning: true,
    hasRecordingSetup: true,
    isAccessibleForDisabled: true,
    blueprintUrl: null,
  },
  {
    id: "db-lt-02",
    roomNumber: "DB-LT2",
    name: "Tiered Lecture Theatre 2",
    campusId: "DEEKSHA_BHAWAN",
    block: "Ground Floor West Wing",
    floor: 0,
    capacity: 140,
    type: "SMART_LECTURE_HALL",
    status: "AVAILABLE",
    currentOccupancy: 0,
    equipment: [
      { id: "eq-24", type: "SMART_BOARD", name: "Maxhub 98\" Interactive Flat Panel", isOnline: true },
      { id: "eq-25", type: "MIC_AUDIO", name: "Acoustic Stage Mic Array", isOnline: true },
      { id: "eq-26", type: "LECTURE_CAPTURE", name: "AI Camera With Speaker Tracking", isOnline: true },
      { id: "eq-27", type: "IOT_HVAC", name: "Central Chilled Water AC", isOnline: true },
    ],
    hasAirConditioning: true,
    hasRecordingSetup: true,
    isAccessibleForDisabled: true,
    blueprintUrl: null,
  },
  {
    id: "db-lt-03",
    roomNumber: "DB-LT3",
    name: "Executive Lecture Theatre 3",
    campusId: "DEEKSHA_BHAWAN",
    block: "First Floor East Wing",
    floor: 1,
    capacity: 120,
    type: "SMART_LECTURE_HALL",
    status: "RESERVED",
    currentLecture: {
      subject: "Inter-University Faculty Development",
      facultyName: "Academic Staff College",
      courseCode: "FD-2026",
      endTime: "02:00 PM",
    },
    equipment: [
      { id: "eq-28", type: "SMART_BOARD", name: "ViewSonic IFP 86\"", isOnline: true },
      { id: "eq-29", type: "LASER_PROJECTOR", name: "Panasonic Laser Projector", isOnline: true },
      { id: "eq-30", type: "MIC_AUDIO", name: "Wireless Lapel System", isOnline: true },
      { id: "eq-31", type: "IOT_HVAC", name: "HVAC Zone Controller", isOnline: true },
    ],
    hasAirConditioning: true,
    hasRecordingSetup: true,
    isAccessibleForDisabled: true,
    blueprintUrl: null,
  },
  {
    id: "db-sem-201",
    roomNumber: "DB-SM2",
    name: "Commerce Seminar Room",
    campusId: "DEEKSHA_BHAWAN",
    block: "First Floor East Wing",
    floor: 1,
    capacity: 48,
    type: "SEMINAR_HALL",
    status: "AVAILABLE",
    currentOccupancy: 0,
    equipment: [
      { id: "eq-45", type: "LASER_PROJECTOR", name: "Wall Projector", isOnline: true },
      { id: "eq-46", type: "MIC_AUDIO", name: "Podium Mic", isOnline: true },
    ],
    hasAirConditioning: false,
    hasRecordingSetup: false,
    isAccessibleForDisabled: true,
    blueprintUrl: null,
  },
  {
    id: "db-lab-210",
    roomNumber: "DB-CL1",
    name: "Business Analytics Lab",
    campusId: "DEEKSHA_BHAWAN",
    block: "Second Floor Central",
    floor: 2,
    capacity: 36,
    type: "COMPUTER_LAB",
    status: "AVAILABLE",
    currentOccupancy: 0,
    computerCount: 36,
    equipment: [
      { id: "eq-47", type: "SMART_BOARD", name: "Lab Display", isOnline: true },
      { id: "eq-48", type: "IOT_HVAC", name: "Split AC", isOnline: true },
    ],
    hasAirConditioning: true,
    hasRecordingSetup: false,
    isAccessibleForDisabled: true,
    blueprintUrl: null,
  },
  {
    id: "db-lt-05",
    roomNumber: "DB-LT5",
    name: "Interactive Hall 5",
    campusId: "DEEKSHA_BHAWAN",
    block: "Second Floor Central",
    floor: 2,
    capacity: 110,
    type: "SMART_LECTURE_HALL",
    status: "MAINTENANCE",
    currentOccupancy: 0,
    equipment: [
      { id: "eq-32", type: "SMART_BOARD", name: "Interactive Display", isOnline: false, lastPing: "10 mins ago" },
      { id: "eq-33", type: "IOT_HVAC", name: "HVAC Unit (Filter Servicing)", isOnline: false },
    ],
    hasAirConditioning: true,
    hasRecordingSetup: false,
    isAccessibleForDisabled: true,
    blueprintUrl: null,
  },
  {
    id: "db-auditorium",
    roomNumber: "DB-AUD",
    name: "Deeksha Bhawan Main Auditorium",
    campusId: "DEEKSHA_BHAWAN",
    block: "Central Auditorium Block",
    floor: 0,
    capacity: 550,
    type: "THEATRE_AUDITORIUM",
    status: "AVAILABLE",
    currentOccupancy: 0,
    equipment: [
      { id: "eq-34", type: "SMART_BOARD", name: "Giant Digital Backdrop LED Wall", isOnline: true },
      { id: "eq-35", type: "LASER_PROJECTOR", name: "Dual Christie Digital Cinema System", isOnline: true },
      { id: "eq-36", type: "MIC_AUDIO", name: "16-Channel JBL Line Array & Shure Mics", isOnline: true },
      { id: "eq-37", type: "LECTURE_CAPTURE", name: "Full Broadcast HD Studio Rig", isOnline: true },
      { id: "eq-38", type: "IOT_HVAC", name: "Central Automated HVAC", isOnline: true },
    ],
    hasAirConditioning: true,
    hasRecordingSetup: true,
    isAccessibleForDisabled: true,
    blueprintUrl: null,
  },
];

export const MOCK_CLASSROOMS: Classroom[] = CATALOG_SEED.map((room) => ({
  ...room,
  facilities: room.facilities ?? deriveFacilities(room),
}));

export async function getClassrooms(params?: ClassroomFilterParams): Promise<Classroom[]> {
  await mockDelay(60);

  let result = [...MOCK_CLASSROOMS];

  if (params?.campusId && params.campusId !== "ALL") {
    result = result.filter((room) => room.campusId === params.campusId);
  }

  if (params?.status && params.status !== "ALL") {
    result = result.filter((room) => room.status === params.status);
  }

  if (params?.roomType && params.roomType !== "ALL") {
    result = result.filter((room) => room.type === params.roomType);
  }

  if (params?.minCapacity) {
    const min = params.minCapacity;
    result = result.filter((room) => room.capacity >= min);
  }

  if (params?.searchQuery) {
    const q = params.searchQuery.toLowerCase();
    result = result.filter(
      (room) =>
        room.roomNumber.toLowerCase().includes(q) ||
        room.name.toLowerCase().includes(q) ||
        room.block.toLowerCase().includes(q)
    );
  }

  if (params?.hasRecording !== undefined) {
    result = result.filter((room) => room.hasRecordingSetup === params.hasRecording);
  }

  return result;
}

export async function getClassroomById(id: string): Promise<Classroom | null> {
  await mockDelay(50);
  const found = MOCK_CLASSROOMS.find((r) => r.id === id);
  return found ?? null;
}

export async function getCampusClassroomStats() {
  await mockDelay(40);
  const ietRooms = MOCK_CLASSROOMS.filter((r) => r.campusId === "IET");
  const dbRooms = MOCK_CLASSROOMS.filter((r) => r.campusId === "DEEKSHA_BHAWAN");

  const countByStatus = (rooms: Classroom[], status: RoomStatus) =>
    rooms.filter((r) => r.status === status).length;

  return {
    total: MOCK_CLASSROOMS.length,
    available: MOCK_CLASSROOMS.filter((r) => r.status === "AVAILABLE").length,
    occupied: MOCK_CLASSROOMS.filter((r) => r.status === "OCCUPIED").length,
    reserved: MOCK_CLASSROOMS.filter((r) => r.status === "RESERVED").length,
    maintenance: MOCK_CLASSROOMS.filter((r) => r.status === "MAINTENANCE").length,
    iet: {
      total: ietRooms.length,
      available: countByStatus(ietRooms, "AVAILABLE"),
      occupied: countByStatus(ietRooms, "OCCUPIED"),
      reserved: countByStatus(ietRooms, "RESERVED"),
    },
    deekshaBhawan: {
      total: dbRooms.length,
      available: countByStatus(dbRooms, "AVAILABLE"),
      occupied: countByStatus(dbRooms, "OCCUPIED"),
      reserved: countByStatus(dbRooms, "RESERVED"),
    },
  };
}
