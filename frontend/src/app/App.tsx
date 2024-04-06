import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useEffect } from "react";
import { useAppDispatch } from "./state/hooks";

import Header from "../features/main/Header";
import Footer from "../features/main/Footer";

import HomePage from "../features/main/HomePage";
import RegisterPage from "../features/auth/RegisterPage";
import LoginPage from "../features/auth/LoginPage";
import LogoutPage from "../features/auth/LogoutPage";
import UserPage from "../features/auth/UserPage";
import HistoryPage from "../features/history/HistoryPage";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check if token is valid
  }, [dispatch]); // Eventually remove dispatch from dependencies

  return (
    <>
      <Header />
      <main>
        <Container className="mt-5">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />}></Route>
            <Route path="/account" element={<UserPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<h1>404 Not Found</h1>}></Route>
          </Routes>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default App;
