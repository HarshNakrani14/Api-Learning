import axios from 'axios';
import { useEffect, useState } from 'react';
const api = "https://jsonplaceholder.typicode.com"
function App() {
  const [myData, setMyData] = useState([]);
  const [isErr, setIsErr] = useState("");


//Normal way
  // useEffect(() => {
  //   axios.get("https://jsonplaceholder.typicode.com/posts")
  //     .then((res) => setMyData(res.data))
  //     .catch((err)=> setIsErr(err.message))
  // }, []);


  // Using Async Await

const getApiData = async (url) => {
  try{
    const res = await axios.get(url)
    setMyData(res.data)
  }catch(err){
    setIsErr(err.message)
  }
}
useEffect(()=>{
  getApiData(`${api}/posts`)
},[])


  return (
    <div className="p-5 bg-gray-400">
      <h1 className="text-4xl font-serif font-bold mb-5 text-center">Axios</h1>
      {
        isErr !== "" && <h2 className='text-center text-xl font-semibold'>{isErr}</h2> 
      }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {myData.slice(0,99).map((post) => {
          const { id, title, body } = post;
          return (
            <div 
              className="flex flex-col justify-center items-center p-4 border-4 border-gray-600 rounded-lg shadow-xl h-72 bg-gray-100 hover:bg-gray-700 hover:text-white hover:border-white" 
              key={id}
            >
              <h2 className="text-xl capitalize font-bold mb-2 text-center">{title}</h2>
              <p className="text-center capitalize">{body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
