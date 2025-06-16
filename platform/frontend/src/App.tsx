import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar.tsx"

const Home = (): JSX.Element => {
  return (
    <>
    <Navbar />
      <div><p>Welcome to the farm system</p></div>
    </>
  )
};

const App: React.FC = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
