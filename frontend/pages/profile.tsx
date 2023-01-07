import axios from "axios";
import Keycloak from "keycloak-js";
import { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { FormSettings } from "../components/FormSettings";
import { Spinner } from "../components/Spinner";

interface User {
  email: string;
  token?: string | undefined;
  authenticated?: boolean;
  name?: string;
}

export default function Profile() {
  const [keycloak, setKeycloak] = useState<Keycloak>();
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, text: "" });
  const alert = useAlert();

  useEffect(() => {
    setTimeout(() => {
      console.log("user", user);
      if (!user) handleLogin();
      console.log(user);
    }, 1000);
  }, []);

  useEffect(() => {
    const _keycloak = new Keycloak(initOptions);

    _keycloak
      .init({
        checkLoginIframe: false,
        redirectUri: "http://127.0.0.1:3000/profile/",
      })
      .then((auth) => {
        if (!auth) {
          console.log("Not authenticated");
        } else {
          console.log("Authenticated");
          console.log(_keycloak);
          _keycloak.loadUserInfo().then((userInfo) => {
            setUser({
              authenticated: true,
              // @ts-ignore
              email: userInfo.email,
              // @ts-ignore
              name: userInfo.given_name,
              token: _keycloak.idToken,
            });
            console.log(_keycloak.idToken);
          });
        }
      });

    setInterval(async () => {
      const res = await _keycloak.updateToken(70);
      if (!res) return;
      console.log("Token refreshed");
      // @ts-ignore
      setUser({ ...user, token: _keycloak.idToken });
    }, 7000);

    setKeycloak(_keycloak);
  }, [user]);

  const handleLogin = () => {
    console.log("login", keycloak);
    if (!keycloak) return;
    keycloak.login();
  };

  const authConnection = async () => {
    try {
      setLoading(true);
      await axios.post(
        "http://127.0.0.1:5001/auth/check-user",
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      alert.success("Auth connection successful.");
    } catch (error) {
      alert.error("Auth connection failed.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleLogOut = () => {
    if (!keycloak) return;
    keycloak.logout({ redirectUri: "http://127.0.0.1:3000/" });
  };

  return (
    <>
      <div
        id="toast-top-right"
        className={` ${
          toast.show ? "opacity-100" : "opacity-0"
        } transition-all duration-500   absolute flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow top-5 right-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800`}
        role="alert"
      >
        <div className="text-sm font-normal">{toast.text}</div>
      </div>

      <div className="p-3">
        <h1 className="text-5xl mb-9 font-bold text-center">PROFILE</h1>
        {!user || !user.token ? (
          <button className="bg-blue-500 text-2xl p-3" onClick={handleLogin}>
            LOGIN
          </button>
        ) : (
          <>
            <FormSettings />

            <div className="flex flex-grow justify-center gap-32 my-5">
              <button
                className="p-3 bg-yellow-600 w-48 text-center flex justify-center"
                disabled={loading}
                onClick={authConnection}
              >
                {loading ? <Spinner /> : <>Check auth connection</>}
              </button>

              <button className=" bg-red-700 p-3 " onClick={handleLogOut}>
                LOGOUT
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// server side rendering

let initOptions = {
  url: "http://127.0.0.1:8080",
  realm: "realm_app",
  clientId: "next-app",
};
