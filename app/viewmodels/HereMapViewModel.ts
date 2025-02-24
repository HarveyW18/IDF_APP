import { HERE_API_KEY } from "../config";

export const getHereMapHTML = (): string => {
    return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://js.api.here.com/v3/3.1/mapsjs-core.js"></script>
            <script src="https://js.api.here.com/v3/3.1/mapsjs-service.js"></script>
            <script src="https://js.api.here.com/v3/3.1/mapsjs-ui.js"></script>
            <script src="https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"></script>
            <style> 
                html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                    console.log("HERE Maps en cours de chargement...");
                    var platform = new H.service.Platform({ apikey: '${HERE_API_KEY}' });
                    var layers = platform.createDefaultLayers();
                    var map = new H.Map(
                        document.getElementById('map'),
                        layers.vector.normal.map,
                        {
                            center: { lat: 48.8566, lng: 2.3522 },
                            zoom: 13
                        }
                    );
                    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
                    H.ui.UI.createDefault(map, layers);
                    console.log("HERE Maps chargé !");
                });
            </script>
        </body>
        </html>
    `;
};

