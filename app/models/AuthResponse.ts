// Modèle pour les réponses d'authentification

import { User } from "./User";

export interface AuthResponse {
    user: User | null;
    token?: string;
    error?: string;
}
