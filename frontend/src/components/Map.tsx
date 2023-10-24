import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup  } from "react-leaflet";
import { DivIconOptions } from "leaflet";
import L from "leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import "leaflet/dist/leaflet.css";


import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ReactDOMServer from "react-dom/server";



type Props = {
  data: {
    Latitude: number;
    Longitude: number;
    loudness: string;
    date: string;
    time: string;
    Address: string;
  }[];
  loudnessFilter?: string;
  timeRangeFilter?: string;
  width: number;
  height: number;
};

function NoiseColorLevel(loudness: string) {
  let iconClass = "";
  if (loudness === "ไม่รบกวน") {
    iconClass = "text-[#5fb21b]";
  } else if (loudness === "รบกวนเล็กน้อย") {
    iconClass = "text-[#9fc819]";
  } else if (loudness === "รบกวนพอสมควร") {
    iconClass = "text-[#efc142]";
  } else if (loudness === "รบกวนอย่างมาก") {
    iconClass = "text-[#f9a919]";
  } else if (loudness === "รบกวนอย่างมากที่สุด") {
    iconClass = "text-[#fe0200]";
  }
  return iconClass;
}



const Map = ({ data, loudnessFilter, timeRangeFilter }: Props) => {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const filterData = () => {
      let filtered = data;

      if (loudnessFilter) {
        filtered = filtered.filter((markerData) => markerData.loudness === loudnessFilter);
      }

      if (timeRangeFilter) {
        filtered = filtered.filter((markerData) => {
          const currentDate = new Date();
          const markerDate = new Date(markerData.date);
  
          // Set the time of currentDate to 00:00:00 to compare only dates
          currentDate.setHours(0, 0, 0, 0);
  
          if (timeRangeFilter === '1H') {
            // Filter for last 1 hour
            const oneHourAgo = new Date(currentDate.getTime() - 60 * 60 * 1000);
            return markerDate >= oneHourAgo && markerDate <= currentDate;
          } else if (timeRangeFilter === '1D') {
            // Filter for last 1 day
            const oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
            return markerDate >= oneDayAgo && markerDate <= currentDate;
          } else if (timeRangeFilter === '1W') {
            // Filter for last 1 week
            const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
            return markerDate >= oneWeekAgo && markerDate <= currentDate;
          } else if (timeRangeFilter === '1M') {
            // Filter for last 1 month
            const oneMonthAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
            return markerDate >= oneMonthAgo && markerDate <= currentDate;
          }
  
          return true; // Return true for no time range filter
        });
      }
  
      setFilteredData(filtered);
    };
  
    filterData();
  }, [data, loudnessFilter, timeRangeFilter]);

  const showFilterMessage = filteredData.length !== data.length && (loudnessFilter || timeRangeFilter);

 
  return (
    <div>
      <MapContainer
        center={[14.0734367, 100.6003011]}
        zoom={15}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showFilterMessage && (
          <div className="filter-message">
            <p>Filtered by:</p>
            {loudnessFilter && <p>Loudness: {loudnessFilter}</p>}
            {timeRangeFilter && <p>Time Range: {timeRangeFilter}</p>}
          </div>
        )}
        <MarkerClusterGroup>
          {filteredData.map((markerData, index) => {
            const indicator = NoiseColorLevel(markerData.loudness);
            const customIconOptions: DivIconOptions = {
              className: `${indicator} text-[30px]`,
              html: ReactDOMServer.renderToString(
                <FontAwesomeIcon icon={faLocationDot} />
              ),
            };
            const customIcon = L.divIcon(customIconOptions);

            return (
              <Marker
                position={[markerData.Latitude, markerData.Longitude]}
                icon={customIcon}
                key={index}
              >
                <Popup>
                  <div className="flex flex-row">
                    <div className="flex flex-col">
                      <p>
                        <span className="font-bold">Loudness: </span>
                        {markerData.loudness}
                      </p>
                      <p>
                        <span className="font-bold">Date: </span>
                        {markerData.date}
                      </p>
                      <p>
                        <span className="font-bold">Time: </span>
                        {markerData.time}
                      </p>
                      <p>
                        <span className="font-bold">Address: </span>
                        {markerData.Address}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default Map;
