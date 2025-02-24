// Modèle pour les utilisateurs

export interface User {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    address?: string;
    phone?: string;
    role: "user" | "admin" | "agent";
    createdAt: Date;
}
