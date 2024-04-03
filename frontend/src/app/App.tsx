import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import Header from "../features/main/Header";
import Footer from "../features/main/Footer";

import Home from "../features/main/Home";
import Register from "../features/auth/Register";
import Login from "../features/auth/Login";

function App() {
  return (
    <>
      <Header />
      <main>
        <Container className="mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<h1>404 Not Found</h1>}></Route>
          </Routes>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default App;
