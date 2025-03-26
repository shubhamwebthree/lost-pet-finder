import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { lost_pet_finder_backend } from "../../../declarations/lost-pet-finder-backend";
import Navbar from "./Navbar";
import Footer from "./Footer";

const GetAllPets = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [filterPetType, setFilterPetType] = useState("");
  const navigate = useNavigate();

  const getBase64FromArrayBuffer = (buffer) => {
    if (!buffer || buffer.byteLength === 0) return null;
    const bytes = new Uint8Array(buffer);
    const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
    return `data:image/png;base64,${btoa(binary)}`;
  };

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsList = await lost_pet_finder_backend.getAllPets();
        setPets(petsList);
        setFilteredPets(petsList);
      } catch (err) {
        console.error("Error fetching pets:", err);
        setError("Failed to load pets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  useEffect(() => {
    const filtered = pets.filter((pet) => {
      const matchesLocation = searchLocation
        ? pet.location.toLowerCase().includes(searchLocation.toLowerCase())
        : true;
      const matchesPetType = filterPetType ? pet.petType === filterPetType : true;
      return matchesLocation && matchesPetType;
    });
    setFilteredPets(filtered);
  }, [searchLocation, filterPetType, pets]);

  if (loading) return <p>Loading pets...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />

      <div className="max-w-lg mx-auto p-6 bg-white shadow">
        <button
          onClick={() => navigate("/")}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition mt-2 mb-4"
        >
          Back to Home
        </button>

        <h2 className="text-3xl font-bold mb-4 text-center">Lost & Found Pets</h2>

        {/* 🔎 Search and Filter */}
        <div className="mb-2 space-y-2">
          <input
            type="text"
            placeholder="Search by location..."
            className="block w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />

          <select
            className="block w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterPetType}
            onChange={(e) => setFilterPetType(e.target.value)}
          >
            <option value="">All Pet Types</option>
            {Array.from(new Set(pets.map((pet) => pet.petType))).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* 🐶 Pet List */}
        {filteredPets.length === 0 ? (
          <p className="text-center">No matching pets found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredPets.map((pet) => (
              <li key={pet.id} className=" p-4 rounded-lg shadow">
                {/* <p className="block text-gray-700 font-semibold text-lg">Id: {pet.petId}</p> */}
                <p className="block text-gray-700 font-semibold text-lg">{pet.petType}</p>
                <p className="text-gray-700 text-lg">{pet.description}</p>
                <p className="block text-gray-700 font-semibold text-lg">Location: {pet.location}</p>
                {pet.photo && (
                  <img
                    src={getBase64FromArrayBuffer(pet.photo)}
                    alt={pet.petType}
                    className="block mx-auto mt-2 mb-2 w-full max-w-xs rounded-lg"
                  />
                )}
                <p className="block text-gray-700 font-semibold text-lg">Contact: {pet.contact}</p>
                <p className="block text-gray-700 font-semibold text-lg">
                  Status: {pet.status && typeof pet.status === "object" ? Object.keys(pet.status)[0] : "Unknown"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
};

export default GetAllPets;
