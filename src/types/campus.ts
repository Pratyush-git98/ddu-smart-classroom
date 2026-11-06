export type CampusLocationId = "IET" | "DEEKSHA_BHAWAN";

export interface CampusBlock {
  id: string;
  campusId: CampusLocationId;
  name: string;
  floors: number;
  totalRooms: number;
}

export interface CampusMetadata {
  id: CampusLocationId;
  name: string;
  shortCode: string;
  description: string;
  wings: readonly string[];
  badgeClass: string;
  accentColor: string;
  totalClassrooms: number;
  activeSensors: number;
}

