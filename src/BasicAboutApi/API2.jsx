import axios from "axios";
import { useState, useEffect } from "react";

const API_KEY = "6c3374b";

function API2() {
  const [myData, setMyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    // Fetch default movie data on first visit
    const fetchDefaultMovie = async () => {
      try {
        const res = await axios.get(`https://www.omdbapi.com/?s=titanic&apikey=${API_KEY}`);
        setMyData(res.data.Search || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDefaultMovie();
  }, []);

  const getApiData = async (query) => {
    try {
      const res = await axios.get(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
      setMyData(res.data.Search || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      const res = await axios.get(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
      setSuggestions(res.data.Search || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      getApiData(searchTerm);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    handleSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    try {
      const res = await axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
      setSelectedMovie(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-5 flex flex-col items-center">
      <div className="flex flex-col mb-4 w-full max-w-md relative">
        <input
          type="text"
          className="border border-gray-400 rounded-t-md p-2 w-full"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <button
          className="bg-blue-600 text-white rounded-b-md p-2 w-full"
          onClick={handleSearch}
        >
          Search
        </button>

        {suggestions.length > 0 && (
          <ul className="absolute bg-white border border-gray-400 rounded-b-md w-full max-h-48 overflow-y-auto mt-20 z-10">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.imdbID}
                onClick={() => handleSuggestionClick(suggestion.Title)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {suggestion.Title} ({suggestion.Year})
              </li>
            ))}
          </ul>
        )}
      </div>

      {myData.length === 0 && (
        <p className="text-gray-500 mt-6">Search for a movie to get started!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-lg">
        {myData.map((val) => {
          const { imdbID, Poster, Title, Year } = val;

          return (
            <div 
              key={imdbID} 
              onClick={() => fetchMovieDetails(imdbID)} 
              className="flex flex-col items-center bg-white rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
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

      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1"
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedMovie.Title} ({selectedMovie.Year})</h2>
            <img src={selectedMovie.Poster} alt={selectedMovie.Title} className="w-full rounded mb-4" />
            <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
            <p><strong>Director:</strong> {selectedMovie.Director}</p>
            <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
            <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default API2;
