var wms = 'http://localhost:8081/geoserver/distritos/wms';

let mapView = new ol.View ({
    center: ol.proj.fromLonLat([-75.015152, -9.189967]),
    zoom: 8,
});

let map = new ol.Map ({
    target: 'map',
    view: mapView,
});

let osmTitle = new ol.layer.Tile ({
    title: 'Open Street Map',
    visible: true,
    source: new ol.source.OSM()
});

map.addLayer(osmTitle);

let water = new ol.layer.Tile({
    title: "Peru Water",
    source: new ol.source.TileWMS({
        url: wms,
        params: {'LAYERS':'distritos:gis_osm_water_a_free_1', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});
map.addLayer(water);

let waterways = new ol.layer.Tile({
    title: "Peru Water Ways",
    source: new ol.source.TileWMS({
        url: wms,
        params: {'LAYERS':'distritos:gis_osm_waterways_free_1', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});
map.addLayer(waterways);

let landuse = new ol.layer.Tile({
    title: "Peru Landuse",
    source: new ol.source.TileWMS({
        url: wms,
        params: {'LAYERS':'distritos:gis_osm_landuse_a_free_1', 'TILED': true},
        serverType: 'geoserver',
        visible: false
    })
});
map.addLayer(landuse);

let natural = new ol.layer.Tile({
    title: "Peru Natural",
    source: new ol.source.TileWMS({
        url: wms,
        params: {'LAYERS':'distritos:gis_osm_natural_a_free_1', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});
map.addLayer(natural);

let pois = new ol.layer.Tile({
    title: "Peru Pois",
    source: new ol.source.TileWMS({
        url: wms,
        params: {'LAYERS':'distritos:gis_osm_pois_a_free_1', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});
map.addLayer(pois);

let roads = new ol.layer.Tile({
    title: "Peru Roads",
    source: new ol.source.TileWMS({
        url: wms,
        params: {'LAYERS':'distritos:gis_osm_roads_free_1', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});
map.addLayer(roads);

let buildings = new ol.layer.Tile({
    title: "Peru Buildings",
    source: new ol.source.TileWMS({
        url: wms,
        params: {'LAYERS':'distritos:gis_osm_buildings_a_free_1', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});
map.addLayer(buildings);

let lolotes = new ol.layer.Tile({
    title: "Los Olivos - Lotes",
    source: new ol.source.TileWMS({
        url: wms,
        params: {'LAYERS':'distritos:LO_LOTES2', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});
map.addLayer(lolotes);

let distritos = new ol.layer.Tile({
    title: "Peru Distritos",
    source: new ol.source.TileWMS({
        url: wms,
        params: {'LAYERS':'distritos:DISTRITOS', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});
map.addLayer(distritos);

let mousePosition = new ol.control.MousePosition({
    className: 'mousePosition',
    projection: 'EPSG:4326',
    coordinateFormat: function(coordinate){return ol.coordinate.format(coordinate,'{y}, {x}', 6);}
});
map.addControl(mousePosition);

let scaleControl = new ol.control.ScaleLine({
    className: 'scaleControl',
    bar: true,
    text: true
});
map.addControl(scaleControl);

let container = document.getElementById('popup');
let content = document.getElementById('popup-content');
let closer = document.getElementById('popup-closer');

let popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    },
});

map.addOverlay(popup);

closer.onclick = function() {
    popup.setPosition(undefined);
    closer.blur();
    return false;
}

map.on('singleclick', function(evt) {
    content.innerHTML = '';
    let resolution = mapView.getResolution();
    let url = waterways.getSource().getFeatureInfoUrl(evt.coordinate, resolution, 'EPSG:3857', {
        'INFO_FORMAT': 'application/json',
        'propertyName': 'name'
    });

    if (url) {
        $.getJSON(url, function(data){
            let feature = data.features[0];
            let props = feature.properties;
            content.innerHTML = "<h3>Nombre:</h3> " + 
                "<p>" + props.name + "</p>";
            popup.setPosition(evt.coordinate);
        });

    } else {
        popup.setPosition(undefined);
    }
});