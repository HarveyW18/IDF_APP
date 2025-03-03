export interface Assistance {
    id: string;
    firebaseUid: string;
    pmrName: string;
    pmrAvatarUrl: string;
    disabilityType: string;
    typeTransport: string;
    departure: string;
    destination: string;
    time: string;
    status : "acceptée" | "en attente";
  }
  