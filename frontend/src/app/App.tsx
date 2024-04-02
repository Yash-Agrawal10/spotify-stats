import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import Header from "../components/Header";
import Footer from "../components/Footer";

import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";

function App() {
  return (
    <>
      <Header />
      <main>
        <Container className="mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default App;
