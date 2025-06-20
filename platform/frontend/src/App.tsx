import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import SignupPage from "./pages/auth/signup/Signup"
import SigninPage from "./pages/auth/signin/Signin";

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
        <Route path="/login" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
