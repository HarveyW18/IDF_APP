const BASE_API_URL = "https://localhost:7247/api/Reservation/demande-assistance";

/**
 * 🔥 Envoie une demande d'assistance PMR au backend
 */
export const creerReservationAssistance = async (token: string, reservationData: any) => {
    try {
        const response = await fetch(`${BASE_API_URL}/demande-assistance`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(reservationData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erreur lors de la création de la réservation");
        }

        console.log("✅ Réservation réussie :", data);
        return data;
    } catch (error) {
        console.error("❌ Erreur création réservation :", error);
        return null;
    }
};
