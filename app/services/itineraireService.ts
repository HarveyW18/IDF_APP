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
            console.log(`📍 Coordonnées de ${adresse} : ${lat}, ${lng}`);
            return `${lat},${lng}`;
        } else {
            console.warn(`⚠️ Aucune coordonnée trouvée pour : ${adresse}`);
            return null;
        }
    } catch (error) {
        console.error("❌ Erreur lors du géocodage :", error);
        return null;
    }
};

/**
 * Récupère les trajets entre deux points avec différents modes de transport.
 * @param {string} depart Adresse de départ.
 * @param {string} arrivee Adresse d'arrivée.
 * @param {string} modeTransport Mode de transport (car, bicycle, pedestrian, publicTransport).
 * @returns {Promise<any>} Liste des trajets proposés.
 */

const obtenirItinerairesRouting = async (depart: string, arrivee: string, modeTransport: "car" | "bicycle" | "pedestrian") => {
    const coordsDepart = await obtenirCoordonnees(depart);
    const coordsArrivee = await obtenirCoordonnees(arrivee);

    if (!coordsDepart || !coordsArrivee) {
        throw new Error("❌ Impossible d'obtenir les coordonnées des adresses fournies.");
    }

    try {
        const url = `${BASE_ROUTING_URL}?origin=${coordsDepart}&destination=${coordsArrivee}&transportMode=${modeTransport}&return=summary,travelSummary,intermediatePlaces,actions&alternatives=3&routingMode=fastest&apiKey=${HERE_API_KEY}`;
        
        console.log("🚀 Appel API Routing HERE : ", url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("📩 Réponse brute API Routing HERE :", JSON.stringify(data, null, 2));

        if (!data.routes || data.routes.length === 0) {
            throw new Error("❌ Aucun itinéraire trouvé.");
        }

        return data.routes;
    } catch (error) {
        console.error("❌ Erreur API HERE Routing :", error);
        return null;
    }
};


const obtenirItinerairesTransit = async (depart: string, arrivee: string) => {
    const coordsDepart = await obtenirCoordonnees(depart);
    const coordsArrivee = await obtenirCoordonnees(arrivee);

    if (!coordsDepart || !coordsArrivee) {
        throw new Error("❌ Impossible d'obtenir les coordonnées des adresses fournies.");
    }

    try {
        const url = `https://transit.router.hereapi.com/v8/routes?origin=${coordsDepart}&destination=${coordsArrivee}&return=summary,actions,travelSummary&alternatives=3&departureTime=now&apiKey=${HERE_API_KEY}`;

        console.log("🚀 Appel API HERE Public Transit : ", url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("📩 Réponse brute API HERE Public Transit :", JSON.stringify(data, null, 2));

        if (!data.routes || data.routes.length === 0) {
            throw new Error("❌ Aucun itinéraire en transport en commun trouvé.");
        }

        return data.routes;
    } catch (error) {
        console.error("❌ Erreur API HERE Public Transit :", error);
        return null;
    }
};

export const obtenirItineraires = async (
    depart: string,
    arrivee: string,
    modeTransport: "car" | "bicycle" | "pedestrian" | "publicTransport" = "car" // 🚀 Ajoute une valeur par défaut !
): Promise<any> => {
    try {
        console.log(`🔍 Recherche d'itinéraire pour : ${depart} ➡️ ${arrivee} (Mode: ${modeTransport})`);

        if (!modeTransport) {
            console.warn("⚠️ Mode de transport non spécifié, utilisation du mode 'car' par défaut.");
            modeTransport = "car"; // 🔥 Sécurise en forçant "car" si undefined
        }

        if (modeTransport === "publicTransport") {
            return await obtenirItinerairesTransit(depart, arrivee);
        } else {
            return await obtenirItinerairesRouting(depart, arrivee, modeTransport);
        }
    } catch (error) {
        console.error("🚨 Erreur lors de l'obtention des itinéraires :", error);
        return null;
    }
};

