const GOOGLE_API_KEY = "AIzaSyBvAplrV7rAAsAJrP110Tct1FCJWF2oYrg";

const BASE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const BASE_DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json";

/**
 * Convertit une adresse en coordonnées GPS via Google Maps Geocoding API.
 */
export const obtenirCoordonnees = async (adresse: string): Promise<string | null> => {
    try {
        const response = await fetch(`${BASE_GEOCODE_URL}?address=${encodeURIComponent(adresse)}&key=${GOOGLE_API_KEY}`);
        const data = await response.json();

        if (data.status !== "OK" || !data.results.length) {
            console.warn(`⚠️ Aucune coordonnée trouvée pour : ${adresse}`);
            return null;
        }

        const { lat, lng } = data.results[0].geometry.location;
        console.log(`✅ Adresse trouvée : ${data.results[0].formatted_address} (${lat},${lng})`);
        return `${lat},${lng}`;
    } catch (error) {
        console.error("❌ Erreur lors du géocodage :", error);
        return null;
    }
};

/**
 * Récupère les itinéraires en transports en commun entre deux points via Google Maps Directions API.
 */
export const obtenirItinerairesTransit = async (depart: string, arrivee: string) => {
    const coordsDepart = await obtenirCoordonnees(depart);
    const coordsArrivee = await obtenirCoordonnees(arrivee);

    if (!coordsDepart || !coordsArrivee) {
        throw new Error("❌ Impossible d'obtenir les coordonnées des adresses fournies.");
    }

    try {
        const url = `${BASE_DIRECTIONS_URL}?origin=${coordsDepart}&destination=${coordsArrivee}&mode=transit&alternatives=true&key=${GOOGLE_API_KEY}`;
        console.log("🚀 URL API Google Maps Directions :", url);

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "OK" || !data.routes.length || !data.routes[0].legs || !data.routes[0].legs[0].steps) {
            console.warn("⚠️ Aucune section trouvée dans l'itinéraire.");
            return [];
        }        

        return data.routes.slice(0, 20).map((route: any) => {
            const legs = route.legs || [];
            if (legs.length === 0) return null;

            const sections = legs.flatMap((leg: any) =>
                leg.steps.map((step: any) => {
                    const isTransit = step.travel_mode === "TRANSIT";
                    return {
                        id: step.html_instructions || "Step",
                        type: step.travel_mode.toLowerCase(),
                        departure: {
                            time: isTransit ? leg.departure_time?.text || "" : "",
                            place: { name: isTransit ? step.transit_details?.departure_stop?.name || "Départ inconnu" : "Départ inconnu" },
                        },
                        arrival: {
                            time: isTransit ? leg.arrival_time?.text || "" : "",
                            place: { name: isTransit ? step.transit_details?.arrival_stop?.name || "Arrivée inconnue" : "Arrivée inconnue" },
                        },
                        transport: isTransit
                            ? {
                                mode: step.transit_details.line.vehicle.type.toLowerCase(),
                                name: step.transit_details.line.short_name || step.transit_details.line.name || "Ligne inconnue",
                                category: step.transit_details.line.vehicle.name || "unknown",
                                color: step.transit_details.line.color || "#007AFF",
                                headsign: step.transit_details.headsign || "",
                            }
                            : undefined,
                    };
                })
            );
            

            return {
                summary: { duration: legs.reduce((total: number, leg: any) => total + (leg.duration?.value || 0), 0) },
                sections,
            };
        }).filter(Boolean);
    } catch (error) {
        console.error("❌ Erreur API Google Maps Directions :", error);
        return null;
    }
};

/**
 * ✅ Fonction principale pour récupérer les itinéraires.
 */
export const obtenirItineraires = async (depart: string, arrivee: string) => {
    try {
        console.log(`🔍 Recherche d'itinéraire pour : ${depart} ➡️ ${arrivee}`);
        return await obtenirItinerairesTransit(depart, arrivee);
    } catch (error) {
        console.error("🚨 Erreur lors de l'obtention des itinéraires :", error);
        return null;
    }
};
