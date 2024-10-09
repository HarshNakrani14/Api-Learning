import axios from "axios";
import { useEffect, useState } from "react";

const url = "https://picsum.photos/v2/list?page=2&limit=20";

function API2() {
  const [myData, setMyData] = useState([]);


  const getApiData = async (url) => {
    try {
      const res = await axios.get(url);
      setMyData(res.data);
    } catch (err) {
      setIsErr(err.message);
    }
  };

  useEffect(() => {
    getApiData(url);
  }, []);

  return (
    <div className="p-5 flex flex-wrap justify-center gap-6">
      {myData.map((val) => {
        const { id, download_url, author } = val;

        return (
          <div key={id} className="flex flex-col items-center bg-gradient-to-br from-gray-500 to-lime-600 w-80 rounded-lg p-4 shadow-lg">
            <img src={download_url} className="h-72 w-full object-cover rounded-lg hover:scale-95 ease-in-out" alt={author} />
            <p className="text-center font-serif pb-2 font-bold">{author}</p>
          </div>
        );
      })}
    </div>
  );
}

export default API2;   