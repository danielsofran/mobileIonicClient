import { GoogleMap } from '@capacitor/google-maps';
import React, {useEffect, useRef} from 'react';
import { CreateMapArgs } from '@capacitor/google-maps/dist/typings/implementation';
import { Geolocation } from '@capacitor/geolocation';

export interface Coords {
  lat: number;
  lng: number;
}

interface MapProps {
  coords?: Coords;
  onCoordsChange?: (coords: Coords) => void;
}

export const ViewMap: React.FC = (props: MapProps) => {
  const mapRef = useRef<HTMLElement>();
  let newMap: GoogleMap;
  const [coords, setCoords] = React.useState<Coords>(props.coords || { lat: 0, lng: 0 })
  const markerId = useRef('')

  const KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  async function createMap() {
    if (!mapRef.current) return;


    const myLocGeo = await Geolocation.getCurrentPosition();
    const myLoc = coords.lat === 0 && coords.lng === 0 ? myLocGeo : { coords: {latitude: coords.lat, longitude: coords.lng }};

    newMap = await GoogleMap.create({
      id: 'my-cool-map',
      element: mapRef.current,
      apiKey: KEY,
      config: {
        center: {
          lat: myLoc.coords.latitude,
          lng: myLoc.coords.longitude,
        },
        zoom: 16,
      },
    } as CreateMapArgs);

    // Set the initial coordinates
    setCoords({
      lat: myLoc.coords.latitude,
      lng: myLoc.coords.longitude,
    });

    // Add a marker for the initial coordinates
    await newMap.addMarker({
      coordinate: {
        lat: myLoc.coords.latitude,
        lng: myLoc.coords.longitude,
      },
      title: 'Initial Location',
    }).then((marker) => {
      markerId.current = marker
    })

    // Set a map click event listener
    await newMap.setOnMapClickListener((event) => {
      const clickedCoords: Coords = {
        lat: event.latitude,
        lng: event.longitude,
      };

      // Update the coordinates state
      setCoords(clickedCoords);
      props.onCoordsChange?.(clickedCoords);

      // Remove the previous marker
      newMap.removeMarker(markerId.current)

      // Add a marker for the clicked coordinates
      newMap.addMarker({
        coordinate: clickedCoords,
        title: 'Selected Location',
      }).then((marker) => {
        markerId.current = marker
      })
    });
  }

  const count = useRef(0);

  useEffect(() => {
    if(count.current === 0) {
      createMap();
      count.current++;
    }
  }, []);

  return (
    <div className="component-wrapper">
      <capacitor-google-map ref={mapRef} style={{
        display: 'inline-block',
          width: 275,
          height: 400
      }}></capacitor-google-map>
    </div>
  )
}