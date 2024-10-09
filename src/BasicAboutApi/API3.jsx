//practice

import React, { useEffect, useState } from 'react';

const url = "https://official-joke-api.appspot.com/jokes/random/";

function API3() {
    const [data, setData] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(url);
                const data = await res.json();
                setData(data);
                console.log(data);
            } catch (err) {
                console.error("Error: ", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='bg-black h-screen w-screen text-white font-poppins'>
            <div className="flex flex-col justify-center items-center h-full">
                <h1 className='text-4xl mb-6'>Random Jokes</h1>
                {data ? (
                    <div key={data.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <div className='p-4 text-center'>
                            <h2 className='text-2xl mb-2'>Type : {data.type}</h2>
                            <p className='text-lg'>Someone : {data.setup}</p>
                            <p className='text-lg'>Me : {data.punchline}</p>
                            <p className='text-sm mt-3'>refresh for more jokes</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default API3;
