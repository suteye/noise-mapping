import React, { useState } from "react";

interface FilterProps {
  onFilterChange: (loudness?: string, timeRange?: string) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [loudnessFilter, setLoudnessFilter] = useState("");
  const [timeRangeFilter, setTimeRangeFilter] = useState("");

  const handleTimeRangeClick = (timeRange: string) => {
    setTimeRangeFilter(timeRange);
    onFilterChange(loudnessFilter, timeRange);
  };

  const handleLoudnessClick = (loudness: string) => {
    setLoudnessFilter(loudness);
    onFilterChange(loudness, timeRangeFilter);
  };

  const handleClearFilter = () => {
    setLoudnessFilter("");
    setTimeRangeFilter("");
    onFilterChange("", "");
  };

  return (
    <div className="bg-white rounded-lg px-5 w-[250px]">
      <div className="container mx-auto flex items-center py-4">
        <div className="w-full flex flex-col">
          {/* Title Location*/}
          <div className="text-[16px] font-semibold text-gray-800">
            Location
          </div>
          {/* Divider */}
          <div className="w-full h-[1px] bg-gray-200 my-2" />
          {/* Location Text*/}
          <div className="text-[14px] font-normal text-gray-800">
            📍 <span className="font-medium">Thammasat University</span>
          </div>

          {/* Title Time Range Filter*/}
          <div className="text-[16px] font-semibold text-gray-800 mt-4">
            Time Range Filter
          </div>
          {/* Divider */}
          <div className="w-full h-[1px] bg-gray-200 my-2" />
          {/* Time Range Filter Button*/}
          <div className="flex flex-row justify-between mt-2">
            <button
              className={`text-[14px] font-medium text-gray-800 border-2 border-blue-500 rounded-lg px-2 py-1 ${
                timeRangeFilter === "1H" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handleTimeRangeClick("1H")}
            >
              1 H
            </button>
            <button
              className={`text-[14px] font-medium text-gray-800 border-2 border-blue-500 rounded-lg px-2 py-1 ${
                timeRangeFilter === "1D" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handleTimeRangeClick("1D")}
            >
              1 D
            </button>
            <button
              className={`text-[14px] font-medium text-gray-800 border-2 border-blue-500 rounded-lg px-2 py-1 ${
                timeRangeFilter === "1W" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handleTimeRangeClick("1W")}
            >
              1 W
            </button>
            <button
              className={`text-[14px] font-medium text-gray-800 border-2 border-blue-500 rounded-lg px-2 py-1 ${
                timeRangeFilter === "1M" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handleTimeRangeClick("1M")}
            >
              1 M
            </button>
          </div>
          {/* Loudness Range Filter*/}
          <div className="text-[16px] font-semibold text-gray-800 mt-4">
            Loudness Range Filter
          </div>
          {/* Divider */}
          <div className="w-full h-[1px] bg-gray-200 my-2" />
          {/* Loudness Range Filter Button*/}
          <div className="flex flex-col justify-center items-center mt-2">
            <button
              className={`w-[200px] text-[16px] font-normal text-black border-2 border-[#5fb21b] rounded-lg px-2 py-1 ${
                loudnessFilter === "ไม่รบกวน" ? "bg-[#5fb21b] text-white" : ""
              }`}
              onClick={() => handleLoudnessClick("ไม่รบกวน")}
            >
              Not bothersome
            </button>
            <button
              className={`w-[200px] text-[16px] font-normal text-black border-2 border-[#9fc819] rounded-lg px-2 py-1 mt-2 ${
                loudnessFilter === "รบกวนเล็กน้อย" ? "bg-[#9fc819] text-white" : ""}`}
              onClick={() => handleLoudnessClick("รบกวนเล็กน้อย")}
            >
              Slightly bothersome
            </button>
            <button
              className={`w-[200px] text-[16px] font-normal text-black border-2 border-[#efc142] rounded-lg px-2 py-1 mt-2 ${
                loudnessFilter === "รบกวนพอสมควร" ? "bg-[#efc142] text-white" : ""}
              }`}
              onClick={() => handleLoudnessClick("รบกวนพอสมควร")}
            >
              Moderately bothersome
            </button>
            <button
              className={`w-[200px] text-[16px] font-normal text-black border-2 border-[#f9a919] rounded-lg px-2 py-1 mt-2 ${
                loudnessFilter === "รบกวนอย่างมาก" ? "bg-[#f9a919] text-white" : ""}
              }`}
              onClick={() => handleLoudnessClick("รบกวนอย่างมาก")}
            >
              Very bothersome
            </button>
            <button
              className={`w-[200px] text-[16px] font-normal text-black border-2 border-[#fe0200] rounded-lg px-2 py-1 mt-2 ${
                loudnessFilter === "รบกวนอย่างมากที่สุด" ? "bg-[#fe0200] text-white" : ""}
              }`}
              onClick={() => handleLoudnessClick("รบกวนอย่างมากที่สุด")}
            >
              Extremely bothersome
            </button>
          </div>
          {/* Clear filter */}
          <div className="flex flex-row justify-center items-center mt-4">
            <button
              className="text-[14px] font-medium text-white bg-[#d04e4e] rounded-lg px-2 py-1"
              onClick={() => handleClearFilter()}
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
