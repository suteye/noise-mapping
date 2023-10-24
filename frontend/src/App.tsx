import { useEffect, useState } from "react";
import Map from "./components/Map";
import Filter from "./components/Filter";
import axios from "axios";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";

function App() {
  const [data, setData] = useState([]);
  const [loudnessFilter, setLoudnessFilter] = useState("");
  const [timeRangeFilter, setTimeRangeFilter] = useState("");

  const handleFilterChange = (loudness?: string, timeRange?: string) => {
    if (loudness !== undefined && timeRange !== undefined) {
      setLoudnessFilter(loudness);
      setTimeRangeFilter(timeRange);
      // Perform filtering or other actions based on the new filter values
    }
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/audio/").then((res) => {
      setData(res.data);
    });
  }, []);
  return (
    <>
      {/* Header */}
      <Header />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="absolute z-10 mt-24 ml-3">
                  <Filter onFilterChange={handleFilterChange} />
                </div>
                <div className="relative z-0 mt-2">
                  <Map
                    data={data}
                    loudnessFilter={loudnessFilter}
                    timeRangeFilter={timeRangeFilter}
                    width={800}
                    height={600}
                  />
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
