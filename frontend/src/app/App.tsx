import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks";

import Header from "../features/main/Header";
import Footer from "../features/main/Footer";

import Home from "../features/main/Home";
import Register from "../features/auth/Register";
import Login from "../features/auth/Login";
import Logout from "../features/auth/Logout";
import Dashboard from "../features/dashboard/Dashboard";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Check if token is valid
  }, [dispatch]);

  return (
    <>
      <Header />
      <main>
        <Container className="mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />}></Route>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<h1>404 Not Found</h1>}></Route>
          </Routes>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default App;
