// Modèle pour les requêtes

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmpassword: string;
    address?: string;
    phone?: string;
}

export interface TrajetRequest {
    depart: string;
    arrivee: string;
}
