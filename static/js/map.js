        var openLayer;
        var features = "/mapfeatures.json";
        var maptiles = [
        {name: "OpenStreetMap_Mapnik", tile: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' })},
        {name: "OpenTopoMap", tile: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)' })},
        {name: "Esri_NatGeoWorldMap", tile: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}", {limZoom: 11, attribution: 'Tiles &copy; Esri &mdash; National Geographic' })},
        {name: "MapTiler", tile: L.tileLayer("https://api.maptiler.com/maps/outdoor/{z}/{x}/{y}.png?key=BzCrc2jUfp7PsqtssatV", {attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>' })},
        ];
        selectedtiles = 2;

        var map = L.map('map').setView([49.699, 15.781], 8); //show ČR
        var drawnItems = L.featureGroup().addTo(map); //map features
        maptiles[selectedtiles].tile.addTo(map);
        //L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);
        
        map.on("zoomend", function(e){ //change tiles to #0 if zoomed over limZoom opion
	        if(map.getZoom() > maptiles[selectedtiles].tile.options.limZoom){
                map.removeLayer(maptiles[selectedtiles].tile);
                maptiles[0].tile.addTo(map);
            }else{
                map.removeLayer(maptiles[0].tile);
                maptiles[selectedtiles].tile.addTo(map);
            }
        });

        //load and show geojson features
        async function fetchData(url) {
            try {
                const response = await fetch(url);
                const data = await response.json();
                return data;
            } catch (err) {
                console.error(err);
            }
        }

        fetchData(features).then((geoJsonData) => {
            const feature = L.geoJSON(geoJsonData, {
                onEachFeature: function (feature, layer) { //assign popup to all features
                    addPopup(layer);
                    drawnItems.addLayer(layer);
                    console.log(layer);
                    if (layer.feature.geometry.type == "Point" && typeof layer.feature.properties.icon != "undefined"){
                        changeicon(layer);
                    }
                },
            });
            
        });


        function changeicon(openLayer){
            if(openLayer.feature.geometry.type == "Point"){
                var tmp_icon = L.icon({
                    iconUrl: "static/" + openLayer.feature.properties.icon,
                    shadowUrl: "static/marker-shadow.png",
                    iconSize: [25, 41],
                    iconAnchor: [15, 40],
                    popupAnchor: [-3, -36],
                    shadowSize: [41, 41],
                    shadowAnchor: [15, 40]
                });
                openLayer.setIcon(tmp_icon);
            }
        }