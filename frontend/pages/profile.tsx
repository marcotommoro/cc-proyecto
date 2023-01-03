import Keycloak from "keycloak-js";
import { useEffect, useState } from "react";

interface User {
  email: string;
  token: string | undefined;
  authenticated: boolean;
  name?: string;
}

export default function Profile() {
  const [keycloak, setKeycloak] = useState<Keycloak>();
  const [user, setUser] = useState<User>();

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
          _keycloak.loadUserInfo().then((userInfo) => {
            console.log(userInfo);
            setUser({
              authenticated: true,
              // @ts-ignore
              email: userInfo.email,
              // @ts-ignore
              name: userInfo.given_name,
              token: _keycloak.idToken,
            });
          });
        }
      });

    setKeycloak(_keycloak);
  }, []);

  const logUser = () => {
    console.log(user);
  };

  const handleLogin = () => {
    if (!keycloak) return;
    keycloak.login();
  };

  const handleLogOut = () => {
    if (!keycloak) return;
    keycloak.logout({ redirectUri: "http://127.0.0.1:3000/" });
  };

  return (
    <>
      <div>
        <h1>PROFILE</h1>
        <button onClick={handleLogin}>LOGIN</button>
        <br />
        <button onClick={handleLogOut}>LOGOUT</button>
        <br />
        <button onClick={logUser}>LOG USER</button>
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
