import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { register, login, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading, registrationData, setRegistrationData } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({
    username,
    email,
    password,
    age,
    weight,
    height,
    gender,
    activityLevel,
    goal,
  }) => {
    setLoading(true);
    try {
      const data = await register({
        username,
        email,
        password,
        age,
        weight,
        height,
        gender,
        activityLevel,
        goal,
      });
      setUser(data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(false);
    try {
      const data = await logout();
      setUser(null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  return { user, loading, handleLogin, handleRegister, handleLogout, registrationData, setRegistrationData };
};
