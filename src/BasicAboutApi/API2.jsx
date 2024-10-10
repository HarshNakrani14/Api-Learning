import axios from "axios";
import { useState, useEffect, useCallback, useMemo } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import "./style.css";

const API_KEY = "6c3374b";
const defaultMovie = "jurassic park";

function API2() {
  const [myData, setMyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Debounce Function
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch default movie on mount
  useEffect(() => {
    const fetchDefaultMovie = async () => {
      try {
        const res = await axios.get(
          `https://www.omdbapi.com/?s=${defaultMovie}&apikey=${API_KEY}`
        );
        setMyData(res.data.Search || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDefaultMovie();
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm) {
        try {
          const res = await axios.get(
            `https://www.omdbapi.com/?s=${debouncedSearchTerm}&apikey=${API_KEY}`
          );
          setSuggestions(res.data.Search || []);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedSearchTerm]);

  // Fetch movie data
  const getApiData = useCallback(async (query) => {
    if (query.trim()) {
      try {
        const res = await axios.get(
          `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`
        );
        setMyData(res.data.Search || []);
        setSuggestions([]); // Clear suggestions on search
        setHighlightedIndex(-1); // Reset highlighted index on search
      } catch (err) {
        console.error(err);
      }
    } else {
      // If query is empty, fetch the default movie
      getApiData(defaultMovie);
    }
  }, []);

  const handleSearch = useCallback(() => {
    getApiData(debouncedSearchTerm);
  }, [debouncedSearchTerm, getApiData]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    // If the input is empty, trigger a search for the default movie
    if (e.target.value === "") {
      getApiData(defaultMovie);
    }
  };

  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    handleSearch();
    setSuggestions([]); // Close dropdown after selection
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSuggestionClick(suggestions[highlightedIndex].Title);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        Math.min(prevIndex + 1, suggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`
      );
      setSelectedMovie(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const renderedSuggestions = useMemo(
    () =>
      suggestions.length > 0 && (
        <ul
          className={`absolute top-full left-0 w-[90%] max-w-md overflow-y-auto z-10 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          } border border-gray-400 rounded-md`}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.imdbID}
              onClick={() => handleSuggestionClick(suggestion.Title)}
              className={`p-2 hover:bg-gray-700 cursor-pointer ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              } ${highlightedIndex === index ? "bg-gray-700 text-white" : ""}`}
            >
              {suggestion.Title} ({suggestion.Year})
            </li>
          ))}
        </ul>
      ),
    [suggestions, isDarkMode, highlightedIndex]
  );

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <header
        className={`relative top-0 left-0 w-full p-5 flex flex-col items-center ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        } z-10`}
      >
        <h1
          className={`text-3xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          PlotPixel
        </h1>
        <div className="flex flex-col items-center w-full max-w-md mb-4 relative">
          <div className="flex w-full mb-2">
            <input
              type="text"
              className={`border rounded-l-md p-2 w-full ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800 text-white"
                  : "border-gray-400 bg-white text-black"
              }`}
              placeholder="Search for movies..."
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
            <button
              className={`rounded-r-md p-2 ${
                isDarkMode ? "bg-blue-600 text-white" : "bg-blue-600 text-white"
              } transition duration-200 hover:bg-blue-500`}
              onClick={handleSearch}
            >
              Search
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full ml-2 transition duration-200 hover:bg-gray-700"
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-800" />
              )}
            </button>
          </div>
          {renderedSuggestions}
        </div>
      </header>

      <main className="pb-6">
        {myData.length === 0 && (
          <p className="text-gray-500 mt-6">
            Search for a movie to get started!
          </p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-lg mx-auto px-4">
          {myData.map(({ imdbID, Poster, Title, Year }) => (
            <div
              key={imdbID}
              onClick={() => fetchMovieDetails(imdbID)}
              className={`flex flex-col items-center rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105 cursor-pointer ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <img
                src={Poster}
                className="h-72 w-full object-fill rounded-lg mb-2"
                alt={Title}
              />
              <p
                className={`text-center font-serif font-bold ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {Title} ({Year})
              </p>
            </div>
          ))}
        </div>

        {selectedMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-30">
            <div
              className={`p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              } scrollbar-hide flex flex-col items-center`}
            >
              <button
                onClick={() => setSelectedMovie(null)} // Close modal
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1"
              >
                X
              </button>
              <h2 className="text-xl font-bold mb-2 text-center">{selectedMovie.Title}</h2>
              <img
                src={selectedMovie.Poster}
                alt={selectedMovie.Title}
                className="mb-2 rounded-md w-full h-auto"
              />
              <p className="text-center">
                <strong>Plot:</strong> {selectedMovie.Plot}
              </p>
              <p className="text-center">
                <strong>Year:</strong> {selectedMovie.Year}
              </p>
              <p className="text-center">
                <strong>Director:</strong> {selectedMovie.Director}
              </p>
              <p className="text-center">
                <strong>Actors:</strong> {selectedMovie.Actors}
              </p>
              <p className="text-center">
                <strong>Rating:</strong> {selectedMovie.imdbRating}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default API2;
