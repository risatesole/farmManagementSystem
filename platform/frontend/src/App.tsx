import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

const Home = (): JSX.Element => {
  return (
    <>
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
