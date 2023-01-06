import axios from "axios";
import Keycloak from "keycloak-js";
import { useEffect, useState } from "react";

interface User {
  email: string;
  token?: string | undefined;
  authenticated?: boolean;
  name?: string;
}

export default function Profile() {
  const [keycloak, setKeycloak] = useState<Keycloak>();
  const [user, setUser] = useState<User | undefined>();

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

    setTimeout(() => {
      if (!user) handleLogin();
      console.log(user);
    }, 2000);

    setKeycloak(_keycloak);
  }, []);

  const authConnection = () => {
    axios.post(
      "http://127.0.0.1:5001/auth/check-user",
      {},
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
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
        {!user || !user.token ? (
          <button onClick={handleLogin}>LOGIN</button>
        ) : (
          <>
            <br />
            <button onClick={handleLogOut}>LOGOUT</button>
            <br />
            <button onClick={authConnection}>Check auth connection</button>
          </>
        )}
      </div>
    </>
  );
}

// server side rendering

let initOptions = {
  url: "https://df45-178-237-233-211.ngrok.io",
  realm: "realm_app",
  clientId: "next-app",
};
