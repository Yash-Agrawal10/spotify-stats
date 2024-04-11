import React, { useEffect } from "react";
import { useAppDispatch } from "../../app/state/hooks";
import { logout } from "./authSlice";
import { useNavigate } from "react-router-dom";

const LogoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  return <></>;
};

export default LogoutPage;
