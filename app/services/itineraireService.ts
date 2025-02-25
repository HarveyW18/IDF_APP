import { HERE_API_KEY } from "../../app/config";

const BASE_GEOCODE_URL = "https://geocode.search.hereapi.com/v1/geocode";
const BASE_TRANSIT_URL = "https://transit.router.hereapi.com/v8/routes";

// 🔥 Clé d'API brute pour les tests
const HERE_ACCESS_TOKEN = "eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJxT0RtRGpVU0NmenAyZ0J2a0tRNiIsImlhdCI6MTc0MDQ3NzU4MywiZXhwIjoxNzQwNTYzOTgzLCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLnczZ244alhPWHFYam5XOGRHNEFreVEucWNfUUJWclJyaV9TNlk1T1dwMVFNOWU2SmYzTUg0Mzd4RmJRbWJqbE1oOHpEMkFBS0o0Z3lKWGpyS2J1ZW9xcnlJVnhFYTNEbW1XX05Id29Bb20ycjlqOGNLdkNqM0thVmxnelFQRHZNbU1QbU04WnRLMjBRT1JadEpYTTVnbHJ2MVNfWk00WEZHVHJ1VG85TURDNWlYaXdhdUdVNlJWU1I5OTAyVldIVWtnLkRGaXVyR09OLVFRRHlIVVJhbXlMWmZSS01iamVPczBBc1I4elhLYkJpOHM.seRoqLMhXyu9CgvSohxPHclTFZkNR4VUZtJw4p5CBWRPxJvw25-81WO25yoex5JoV3NMd4M8Ex1SwsMk4uaKQtAgWTiCPbIOT_EDn_oeqepoYksWFXTjv_4W7izbzGDF1uFILU1eRNWwzVCA8puuiA1yOIPjcnDXT7zjPHBPfHI2QB2EfcJmlHx3PfvLmmzZtdeOJaWfVU6Zcvmlwuj_t_PZIlu_qm5Wddy6qsRevsfw7IcKizwx3RWyth7tE3eWytrhRkgJlVzy-YsPvqThHO0rcUP-L6nzftqDHQjvk7dhZd3MkO78Ld3luyHoXo12Fpe5KJbvZHoDAkNZugHlWA";

/**
 * Convertit une adresse en coordonnées GPS via l'API de géocodage de HERE.
 */
export const obtenirCoordonnees = async (adresse: string): Promise<string | null> => {
    try {
        const response = await fetch(`${BASE_GEOCODE_URL}?q=${encodeURIComponent(adresse)}&apiKey=${HERE_API_KEY}`);
        const data = await response.json();

        console.log("📩 Réponse API GEOCODING :", JSON.stringify(data, null, 2));

        if (data.items && data.items.length > 0) {
            const { lat, lng } = data.items[0].position;
            console.log(`✅ Adresse trouvée : ${data.items[0].address.label} (${lat},${lng})`);
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
 * Récupère les itinéraires en transports en commun entre deux points.
 */
export const obtenirItinerairesTransit = async (depart: string, arrivee: string) => {
    const coordsDepart = await obtenirCoordonnees(depart);
    const coordsArrivee = await obtenirCoordonnees(arrivee);

    if (!coordsDepart || !coordsArrivee) {
        throw new Error("❌ Impossible d'obtenir les coordonnées des adresses fournies.");
    }

    try {
        // Construction de l'URL identique à cURL
        const url = `https://transit.router.hereapi.com/v8/routes?origin=${coordsDepart}&destination=${coordsArrivee}`;

        console.log("🚀 URL API HERE Public Transit : ", url);

        // Requête avec Bearer Token
        const response = await fetch(url, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${HERE_ACCESS_TOKEN}`
            },
        });

        const data = await response.json();
        console.log("📩 Réponse API Transit :", JSON.stringify(data, null, 2));

        if (!data.routes || data.routes.length === 0) {
            throw new Error("❌ Aucun itinéraire en transport en commun trouvé.");
        }

        // 🔥 Transformer les itinéraires pour inclure `summary.duration`
        const itinerairesTransformes = data.routes.map((route: any) => {
            const sections = route.sections || [];
            if (sections.length === 0) return null;

            // 🕒 Calcul de la durée totale du trajet
            const heureDepart = new Date(sections[0].departure.time);
            const heureArrivee = new Date(sections[sections.length - 1].arrival.time);
            const dureeMinutes = Math.round((heureArrivee.getTime() - heureDepart.getTime()) / 60000);

            return {
                summary: { duration: dureeMinutes * 60 }, // Converti en secondes pour rester cohérent
                sections: sections
            };
        }).filter(Boolean);

        return itinerairesTransformes;
    } catch (error) {
        console.error("❌ Erreur API HERE Public Transit :", error);
        return null;
    }
};


/**
 * ✅ Assure que `obtenirItineraires` est bien exporté
 */
export const obtenirItineraires = async (depart: string, arrivee: string) => {
    try {
        console.log(`🔍 Recherche d'itinéraire en transport en commun pour : ${depart} ➡️ ${arrivee}`);
        return await obtenirItinerairesTransit(depart, arrivee);
    } catch (error) {
        console.error("🚨 Erreur lors de l'obtention des itinéraires :", error);
        return null;
    }
};
