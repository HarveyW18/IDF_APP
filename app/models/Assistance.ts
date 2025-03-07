export interface Assistance {
    id: number;
    firebaseUid: string;
    pmrName: string;
    pmrAvatarUrl: string;
    handicapType: string;
    typeTransport: string;
    price: number;
    departure: string;
    destination: string;
    time: string;
    status : "accepted" | "pending";
  }
  