export interface Assistance {
    id: string;
    firebaseUid: string;
    pmrName: string;
    pmrAvatarUrl: string;
    disabilityType: string;
    departure: string;
    destination: string;
    time: string;
    status : "acceptée" | "en attente";
  }
  