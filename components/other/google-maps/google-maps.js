var blaze = blaze || {};

/**
 *
 *
 * Usage:
 *    <div id="id-front-page-map" style="width:600px;height:300px"
 *    data-component="GoogleMaps" data-api-key="your_api_key" data-lang="en" data-region="US"
 *    data-center-lat="10" data-center-lng="10" data-zoom="9" data-map-type="hybrid"
 *    data-geo-point-lat="10" data-geo-point-lng="10" data-geo-point-title="Geopoint Title" data-geo-point-desc="Geopoint Description">
 *    </div>
 *
 *
 *
 * @param element - HTML element that component will be inserted to
 * @constructor
 */
blaze.components.GoogleMaps = function (element) {
    var zoom,
        geoPointLat,
        geoPointLng,
        geoPointTitle,
        geoPointDesc;

    this.element = element;
    this.template = this.element.dataset.template;
    this.apiKey = this.element.dataset.apiKey;
    if (!this.apiKey) {
        console.error('In order to use Google Maps component you have to provide Google Maps API Key in \'data-api-key\' attribute');
        return;
    }
    this.centerLat = parseFloat(this.element.dataset.centerLat);
    this.centerLng = parseFloat(this.element.dataset.centerLng);
    if (!isFinite(this.centerLat) || !isFinite(this.centerLng)) {
        console.error('In order to use Google Maps component you have to provide valid central point latitude and longitude ' +
            'in \'data-center-lat\' and \'data-center-lng\' attributes');
        return;
    }
    zoom = parseInt(this.element.dataset.zoom, 10);
    this.zoom = !isNaN(zoom)? zoom: 10; // Default zoom level is 10
    this.mapType = this.element.dataset.mapType || 'roadmap'; // Defaults to 'roadmap'
    this.lang = this.element.dataset.lang || 'en'; // Defaults to English
    this.region = this.element.dataset.region || 'US'; // Defaults to US

    // Component can show multiple geo points
    this.geoPoints = [];
    // However, only one geo point can be specified in element's data attributes
    geoPointLat = parseFloat(this.element.dataset.geoPointLat);
    geoPointLng = parseFloat(this.element.dataset.geoPointLng);
    geoPointTitle = this.element.dataset.geoPointTitle || '';
    geoPointDesc = this.element.dataset.geoPointDesc || '';
    if (geoPointLat || geoPointLng) {
        if (isFinite(geoPointLat) && isFinite(geoPointLat)) {
            this.geoPoints.push({
                position: {lat: geoPointLat, lng: geoPointLng},
                title: geoPointTitle,
                description: geoPointDesc
            });
        }
        else {
            console.error('In order to add a Geo Point you have to provide valid point\'s latitude and longitude ' +
                'in \'data-geo-point-lat\' and \'data-geo-point-lng\' attributes');
        }
    }

    // Other geo points can be loaded remotely (not implemented right now)

    this.load();
};

blaze.components.GoogleMaps.prototype.load = function () {
    // TODO: Do we need to support multiple Google Maps on one page?
    // Use version 3 to get the current 3.xx release version
    google.load("maps", "3",{
        other_params : 'key=' + this.apiKey + '&language=' + this.lang + '&region=' + this.region,
        callback: blaze.components.GoogleMaps.prototype.render.bind(this)
    });
};

blaze.components.GoogleMaps.prototype.render = function () {
    var marker,
        mapTypeID,
        infoWindow = new google.maps.InfoWindow({
            content: ""
        }),
        map;
    switch (this.mapType) {
        case 'roadmap':
            mapTypeID = google.maps.MapTypeId.ROADMAP;
            break;
        case 'satellite':
            mapTypeID = google.maps.MapTypeId.SATELLITE;
            break;
        case 'terrain':
            mapTypeID = google.maps.MapTypeId.TERRAIN;
            break;
        case 'hybrid':
            mapTypeID = google.maps.MapTypeId.HYBRID;
            break;
        default:
            mapTypeID = google.maps.MapTypeId.ROADMAP;
    }

    map = new google.maps.Map(this.element,
        {
            zoom: this.zoom,
            center: {lat: this.centerLat, lng: this.centerLng},
            mapTypeId: mapTypeID
        });


    for (var index = 0; index < this.geoPoints.length; index++) {
        marker = new google.maps.Marker({
            position: this.geoPoints[index].position,
            map: map,
            title: this.geoPoints[index].title,
            description: this.geoPoints[index].description
        });

        if (this.geoPoints[index].description) {
            // If description present
            marker.addListener('click', function () {
                infoWindow.setContent(this.description);
                infoWindow.open(map, this);
            });
        }
    }
};

function a () {

}