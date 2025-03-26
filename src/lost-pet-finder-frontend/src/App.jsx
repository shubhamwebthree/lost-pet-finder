import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ReportPetForm from "./components/ReportPetForm";
import GetAllPets from "./components/GetAllPets";
import Footer from "./components/Footer";
import { useAuth } from "./components/context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const handleNavigation = (path) => {
    if (!isAuthenticated) {
      login(); 
    } else {
      navigate(path);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col justify-center items-center text-center p-6">
        <h1 className="text-3xl font-bold">Welcome to Pet Finder</h1>
        <h2 className="text-2xl mt-4">
          Lost Pet Finder is a decentralized platform designed to help reunite lost pets with their owners.
          <br />
          Whether you’ve lost a beloved pet or found one wandering alone,
          <br />
          Our platform allows you to post details, upload photos, and share locations to help bring them home safely.
        </h2>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => handleNavigation("/report-pet")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Report Pet
          </button>
          <button
            onClick={() => handleNavigation("/all-pets")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Pet Logs
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report-pet" element={<ReportPetForm />} />
        <Route path="/all-pets" element={<GetAllPets />} />
      </Routes>
    </Router>
  );
}

export default App;
