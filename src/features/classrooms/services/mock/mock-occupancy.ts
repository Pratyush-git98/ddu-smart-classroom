import type { OccupancyBlock } from "../availability";

export const MOCK_ROOM_OCCUPANCY: Record<string, OccupancyBlock[]> = {
  "iet-cs-101": [{ startTime: "09:00", endTime: "11:00", label: "Operating Systems (KCS-501)" }],
  "iet-cs-102": [{ startTime: "14:00", endTime: "16:00", label: "AI Lab batch B" }],
  "iet-ec-201": [{ startTime: "11:00", endTime: "12:00", label: "Signals tutorial" }],
  "iet-me-301": [{ startTime: "15:00", endTime: "17:00", label: "CAD practical" }],
  "iet-conf-110": [{ startTime: "10:00", endTime: "11:00", label: "Department meeting" }],
  "iet-sh-01": [{ startTime: "10:00", endTime: "13:00", label: "Technical symposium" }],
  "db-lt-01": [{ startTime: "10:00", endTime: "12:00", label: "Managerial Economics" }],
  "db-lt-03": [{ startTime: "11:00", endTime: "14:00", label: "Faculty development" }],
  "db-lab-210": [{ startTime: "09:00", endTime: "10:00", label: "Analytics lab" }],
  "db-auditorium": [{ startTime: "16:00", endTime: "17:00", label: "Rehearsal hold" }],
};
