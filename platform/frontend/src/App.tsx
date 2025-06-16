import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar";

// If using React 17+, you can remove the explicit React import above and ensure tsconfig.json has "jsx": "react-jsx"

const HomePage: React.FC = () => (
  <>
    <Navbar />
    <div><p>Welcome to the farm system</p></div>
  </>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
