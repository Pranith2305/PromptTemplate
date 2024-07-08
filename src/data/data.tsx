import { useState, useEffect } from 'react';

interface Data {
  features: any[]; // We don't need details about features for this format
  rows: { row_idx: number; row: { act: string; prompt: string } }[];
}

export default function MyComponent() {
  const [data, setData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredData, setFilteredData] = useState<Data['rows'] | null>(null); // State for filtered data

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://datasets-server.huggingface.co/rows?dataset=fka%2Fawesome-chatgpt-prompts&config=default&split=train&offset=0&length=100');
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const fetchedData: Data = await response.json();
      setData(fetchedData);
      setFilteredData(fetchedData.rows); // Set initial filtered data to all rows
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase()); // Convert search term to lowercase for case-insensitive filtering
  };

  useEffect(() => {
    if (data) {
      const filteredRows = data.rows.filter((row) =>
        row.row.act.toLowerCase().includes(searchTerm) // Case-insensitive filtering
      );
      setFilteredData(filteredRows);
    }
  }, [data, searchTerm]); // Rerun filter when data or search term changes

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  if (!data) return null;

  return (
    <div className="container mx-auto px-4 pt-4 ">
      <input
        type="text"
        placeholder="Search by act..."
        className="mb-4 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {filteredData &&
    filteredData.map((row) => (
        <div className="card bg-white  rounded-lg p-4 transition duration-600 ease-in-out hover:shadow-xl">
        <h2 className='text-center text-black text-2xl'>{row.row.act}</h2> 
        <p className='text-gray-600'> {row.row.prompt } </p> 
      </div>
    ))}
</div>
    </div>
  );
}
