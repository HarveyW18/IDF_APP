import { HERE_API_KEY } from "../../app/config";

const BASE_GEOCODE_URL = "https://geocode.search.hereapi.com/v1/geocode";
const BASE_ROUTING_URL = "https://router.hereapi.com/v8/routes";

/**
 * Convertit une adresse en coordonnées GPS via l'API Here.
 * @param {string} adresse L'adresse à géocoder.
 * @returns {Promise<string | null>} Les coordonnées GPS sous forme "lat,lng".
 */
export const obtenirCoordonnees = async (adresse: string): Promise<string | null> => {
    try {
        const response = await fetch(`${BASE_GEOCODE_URL}?q=${encodeURIComponent(adresse)}&apiKey=${HERE_API_KEY}`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const { lat, lng } = data.items[0].position;
            return `${lat},${lng}`;
        }
    } catch (error) {
        console.error("Erreur lors du géocodage :", error);
    }
    return null;
};

/**
 * Récupère les trajets entre deux points avec différents modes de transport.
 * @param {string} depart Adresse de départ.
 * @param {string} arrivee Adresse d'arrivée.
 * @returns {Promise<any>} Liste des trajets proposés.
 */
export const obtenirItineraires = async (depart: string, arrivee: string): Promise<any> => {
    const coordsDepart = await obtenirCoordonnees(depart);
    const coordsArrivee = await obtenirCoordonnees(arrivee);

    if (!coordsDepart || !coordsArrivee) {
        throw new Error("Impossible d'obtenir les coordonnées des adresses fournies.");
    }

    try {
        const response = await fetch(
            `${BASE_ROUTING_URL}?origin=${coordsDepart}&destination=${coordsArrivee}&transportMode=publicTransport&return=summary&apiKey=${HERE_API_KEY}`
        );
        return await response.json();
    } catch (error) {
        console.error("Erreur API HERE :", error);
        return null;
    }
};
