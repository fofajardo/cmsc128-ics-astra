"use client";

import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl/maplibre"; // Use 'react-map-gl' but with Maplibre styles
import "maplibre-gl/dist/maplibre-gl.css"; // Required for Maplibre
import Image from "next/image";
import axios from "axios";

const JobMap = ({ address }) => {
  const [coords, setCoords] = useState([0, 0]); // Coordinates for the map [longitude, latitude]
  const [loading, setLoading] = useState(true); // To track if the data is still loading
  const [error, setError] = useState(null); // To handle any errors

  useEffect(() => {
    const fetchCoords = async () => {
      setLoading(true);
      setError(null);

      try {
        // fetch coordinates of address using geocoding API (nominatim, open-sourced)
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: address,
            format: "json",
            limit: 1
          },
          headers: {
            "User-Agent": "ICS-ASTRA (cmsc128a22l@gmail.com)"
          }
        });

        const result = response.data[0];

        if (result) {
          // update coordinates state
          setCoords([parseFloat(result.lon), parseFloat(result.lat)]);
        } else {
          setError("Location not found.");
        }
      } catch (err) {
        setError("Geocoding failed.");
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchCoords();
    }
  }, [address]);

  return (
    <div className="w-full h-full relative z-0 border border-astradarkgray rounded-sm overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse w-6 h-6 bg-astraprimary rounded-full animate-throb" />
        </div>
      ) : (
        <ReactMapGL
          mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          initialViewState={{
            latitude: !error ? coords[1] : 14.1651,
            longitude: !error ? coords[0] : 121.2402,
            zoom: 14
          }}

          width="100%"
          height="100%"
          dragPan={true}
          scrollZoom={true}
          doubleClickZoom={true}
          touchZoomRotate={true}
          touchPitch={true}
          cooperativeGestures={false}
        >
          <Marker longitude={!error ? coords[0] : 121.2402} latitude={!error ? coords[1] : 14.1651}>
            {!error ? (
              <Image src="/icons/marker.svg" width={20} height={28.5} alt="loc" className="shrink-0" />
            ) : (
              <></>
            )}
          </Marker>
          {error ?
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-full pointer-events-none z-10">
              <p className='text-astrared'>{error}</p>
            </div> : <></>
          }
        </ReactMapGL>
      )}
    </div>
  );
};

export default JobMap;
