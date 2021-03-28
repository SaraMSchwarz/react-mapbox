import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoia3prdiIsImEiOiI5QTV5TzdVIn0.upR1M0jGXbQPvkte-SaQ1w";

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(-92.65880554936408);
  const [lat, setLat] = useState(42.704868874031554);
  const [zoom, setZoom] = useState(13);

  let z = 13;
  let x = -92.65880554936408;
  let y = 42.704868874031554;

  let url = `https://tiles.earthoptics.com/ndvi/${z}/${x}/${y}`;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [lng, lat],
      zoom: zoom,
      maxZoom: 16,
      minZoom: 10,
    });

    // add NDVI tile as a layer (hardcoded to location and zoom level)
    map.on('load', function () {
        map.addSource('NDVI', {
          type: 'raster',
          url: url
        });
        map.addLayer({
          'id': 'NDVI',
          'type': 'raster',
          'source': 'NDVI',
          'layout': {
            'visibility': 'visible'
          }
        })
    //add GeoJSON data layer to map
    map.addSource('Data', {
        type: 'geojson',
        data: 'https://gxlu1hg02b.execute-api.us-east-1.amazonaws.com/default/mockGeoJSONAPI'
    });
    map.addLayer({
        'id': 'Data',
        'type': 'fill',
        'source': 'Data',
        'layout': {
            'visibility': 'visible'
          }
      })    
      });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });
    return () => map.remove();
  }, []);

  return (
    <div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
