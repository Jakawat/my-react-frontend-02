import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState("...Loading...");

  async function fetchData() {
    // Note the new path: /api/test_api
    const result = await fetch('http://localhost:3000/api/test_api'); 
    const data = await result.json();
    setMessage(data.message);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      Message: {message}
    </div>
  );
}

export default App;