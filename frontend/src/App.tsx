import "bootstrap/dist/css/bootstrap.min.css";

import { useState, useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(false);
  });

  return (
    <>
      <Header loggedIn={loggedIn}></Header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </main>
      <Footer></Footer>
    </>
  );
}

export default App;
