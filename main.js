import maplibregl from 'maplibre-gl'
import * as pmtiles from 'pmtiles'

let protocol = new pmtiles.Protocol()
maplibregl.addProtocol('pmtiles', protocol.tile)

import 'maplibre-gl/dist/maplibre-gl.css'
import './style.css'

const map = new maplibregl.Map({
  container: 'map',
  hash: true,
  center: [-96.6, 39], // starting position [lng, lat]
  zoom: 4, // starting zoom
  style: {
    version: 8,
    name: 'Bright',
    sources: {
      us_counties_unemployment: {
        type: 'vector',
        url: 'pmtiles:///tiles/us_counties_unemployment.pmtiles'
      }
    },
    layers: [
      {
        id: 'unemployment',
        source: 'us_counties_unemployment',
        'source-layer': 'us_counties_unemployment',
        type: 'fill',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'unemployment_rate'],
            0,
            '#ffffb2',
            2,
            '#fed976',
            4,
            '#feb24c',
            6,
            '#fd8d3c',
            8,
            '#f03b20',
            10,
            '#bd0026'
          ],
          'fill-opacity': 1
        }
      },
      {
        id: 'county-lines',
        source: 'us_counties_unemployment',
        'source-layer': 'us_counties_unemployment',
        type: 'line',
        paint: {
          'line-color': 'black',
          'line-width': {
            base: 0.1,
            stops: [
              [4, 0.1],
              [13, 0.5],
              [20, 6]
            ]
          }
        }
      }
    ]
  }
})

map.addControl(
  new maplibregl.NavigationControl({
    showZoom: true,
    showCompass: true
  }),
  'bottom-right'
)

map.addControl(
  new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  }),
  'bottom-right'
)

map.addControl(
  new maplibregl.ScaleControl({
    maxWidth: 200,
    unit: 'imperial'
  }),
  'bottom-left'
)
