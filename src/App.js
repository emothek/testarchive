import React from "react";
import AppTheme from "./AppTheme";
import MainContainer from "./MainContainer";
import Signup from "./Signup";
import SignupSa from "./Signup_Sa";
import Login from "./Login";
import Loader from "./Loader";
import { useCallback, useContext, useEffect } from "react";
import { UserContext } from "./context/UserContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [userContext, setUserContext] = useContext(UserContext);
  const verifyUser = useCallback(() => {
    fetch(process.env.REACT_APP_HOSTNAME + "/refreshToken", {
      method: "POST",

      credentials: "include",

      Authorization: `Bearer ${userContext.token}`,
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();

        setUserContext((oldValues) => {
          return { ...oldValues, token: data.token };
        });
      } else {
        setUserContext((oldValues) => {
          return { ...oldValues, token: null };
        });
      }

      // call refreshToken every 5 minutes to renew the authentication token.

      setTimeout(verifyUser, 5 * 60 * 1000);
    });
  }, [setUserContext]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const syncLogout = useCallback((event) => {
    if (event.key === "logout") {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [syncLogout]);

  return userContext.token === null ? (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/superadmin/create" element={<SignupSa />} />
      </Routes>
    </BrowserRouter>
  ) : userContext.token ? (
    <BrowserRouter>
      <AppTheme>
        <Routes>
          <Route exact path="/" element={<MainContainer />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/superadmin/create" element={<SignupSa />} />
        </Routes>
      </AppTheme>
    </BrowserRouter>
  ) : (
    <Loader />
  );
}

export default App;
