import { createContext, useCallback, useEffect, useState } from "react";
import api from "../constants/api";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const { children } = props;

  const [user, setUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const updateSignIn = useCallback(async () => {
    try {
      const res = await fetch(api.auth.getSession(), {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.error) {
        console.log(data.error);
        return;
      }

      if (data.session.user) {
        setUser(data.session.user);
        setIsSignedIn(true);
        return;
      }

      setUser(null);
      setIsSignedIn(false);

      // Catch error
    } catch (error) {
      console.log(error);
    }
  }, []);

  const signUp = async (body, navigate) => {
    try {
      const res = await fetch(api.auth.postSignUp(), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      alert(data.message);
      navigate();

      // Catch error
    } catch (error) {
      console.log(error);
    }
  };

  const signIn = async (body, navigate) => {
    try {
      const res = await fetch(api.auth.postSignIn(), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      alert(data.message);
      updateSignIn();
      navigate();

      // Catch error
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async (navigate) => {
    try {
      const res = await fetch(api.auth.postSignOut(), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      alert(data.message);
      updateSignIn();
      navigate();

      // Catch error
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    updateSignIn();
  }, [updateSignIn]);

  return <AuthContext.Provider value={{ user, isSignedIn, signUp, signIn, signOut }}>{children}</AuthContext.Provider>;
};
