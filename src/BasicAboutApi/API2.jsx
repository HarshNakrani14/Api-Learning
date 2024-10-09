import axios from "axios";
import { useEffect, useState } from "react";

const API_KEY = "6c3374b";

function API2() {
  const [myData, setMyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const getApiData = async (query) => {
    try {
      const res = await axios.get(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
      setMyData(res.data.Search || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      getApiData(searchTerm);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-5 flex flex-col items-center">
      <div className="flex mb-4 w-full max-w-md">
        <input
          type="text"
          className="border border-gray-400 rounded-l-md p-2 w-full"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className="bg-blue-600 text-white rounded-r-md p-2"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-lg">
        {myData.map((val) => {
          const { imdbID, Poster, Title, Year } = val;

          return (
            <div 
              key={imdbID} 
              className="flex flex-col items-center bg-white rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105"
              style={{ 
                background: "linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(200, 200, 200, 0.6))", 
                border: "1px solid rgba(0, 0, 0, 0.1)"
              }}
            >
              <img 
                src={Poster} 
                className="h-72 w-full object-cover rounded-lg mb-2" 
                alt={Title} 
              />
              <p className="text-center font-serif font-bold">{Title} ({Year})</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default API2;
