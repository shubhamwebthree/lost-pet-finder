import React, { useState,useRef } from 'react';
import { lost_pet_finder_backend } from '../../../declarations/lost-pet-finder-backend';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import Footer from './Footer';

const ReportPetForm = ({ actor }) => {
  const [status, setStatus] = useState('Lost');
  const [petType, setPetType] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [petId, setPetId] = useState(null);
  const [error, setError] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef(null);


  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        setPhoto(new Uint8Array(arrayBuffer)); 
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // const fetchLocationSuggestions = async (query) => {
  //   if (!query) {
  //     setLocationSuggestions([]);
  //     return;
  //   }

  //   try {
  //       const response = await fetch(`http://localhost:5000/api/location?query=${query}`);

  //     const data = await response.json();
  //     setLocationSuggestions(data);
  //     setShowSuggestions(true);
  //   } catch (error) {
  //     console.error("Error fetching location suggestions:", error);
  //   }
  // };

  const handleLocationChange = (e) => {
    const query = e.target.value;
    setLocation(query);
    // fetchLocationSuggestions(query);
  };

  const handleSelectLocation = (selectedLocation) => {
    setLocation(selectedLocation.display_name);
    setLocationSuggestions([]);
    setShowSuggestions(false);
  };
  

  const handleContactChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 10) value = value.slice(0, 10);    
    setContact(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!petType || !description || !photo || !location || !contact) {
      setError('Please fill in all fields');
      return;
    }
  
    const fullContact = `${countryCode} ${contact}`;
  
    setIsSubmitting(true);
    setError('');

    try {
      const statusVariant = status === 'Lost' ? { Lost: null } : { Found: null };
      const id = await lost_pet_finder_backend.reportPet(
        statusVariant,
        petType,
        description,
        photo,
        location,
        fullContact
      );
  
      setPetId(id);
      setStatus('Lost');
      setPetType('');
      setDescription('');
      setPhoto(null);
      setLocation('');
      setContact('');
      setCountryCode('+1');
  
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // ✅ Reset file input field
      }
    } catch (err) {
      console.error('Error reporting pet:', err);
      setError(`Failed to report pet: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-lg mx-auto p-6 bg-white shadow">
        <h2 className="text-3xl font-bold mb-6 text-center">Report a {status} Pet</h2>

        {petId && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md">
            Pet successfully reported! Pet ID: {String(petId)}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Status Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold text-lg mb-2">Status</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="Lost"
                  checked={status === 'Lost'}
                  onChange={() => setStatus('Lost')}
                  className="w-4 h-4"
                />
                <span>Lost Pet</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="Found"
                  checked={status === 'Found'}
                  onChange={() => setStatus('Found')}
                  className="w-4 h-4"
                />
                <span>Found Pet</span>
              </label>
            </div>
          </div>

          {/* Pet Type */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold text-lg mb-2">Pet Type</label>
            <select
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Cow">Cow</option>
              <option value="Bull">Bull</option>
              <option value="Goat">Goat</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold text-lg mb-2">Description</label>
            <textarea
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              placeholder="Describe the pet"
              required
            />
          </div>

          {/* Photo Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold text-lg mb-2">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              required
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {photo && <p className="text-sm text-green-700 mt-1">✓ Photo selected</p>}
          </div>

          {/* Location */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-semibold text-lg mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={handleLocationChange}
              placeholder="Where the pet was lost/found"
              required
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Dropdown Suggestions */}
            {showSuggestions && locationSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {locationSuggestions.map((loc) => (
                  <li
                    key={loc.place_id}
                    onClick={() => handleSelectLocation(loc)}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {loc.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>


          {/* Contact Information with Country Code */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold text-lg mb-2">Contact Information</label>
            <div className="flex">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="block p-3 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="+1">+1 (US)</option>
                <option value="+91">+91 (India)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+61">+61 (Australia)</option>
                <option value="+81">+81 (Japan)</option>
              </select>
              <input
                type="text"
                value={contact}
                onChange={handleContactChange}
                placeholder="Phone number"
                required
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition mt-4">
            {isSubmitting ? 'Submitting...' : 'Report Pet'}
          </button>
        </form>
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition mt-4"
        >
          Close
        </button>

      </div>
      <Footer />
    </>
  );
};

export default ReportPetForm;
