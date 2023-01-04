import axios from "axios";

export const validateToken = async (token: string) => {
  const body = {
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
    username: process.env.KEYCLOAK_USERNAME,
    client_id: process.env.KEYCLOAK_CLIENT_ID,
    token,
  };

  const { data } = await axios.post(
    "http://" +
      process.env.KEYCLOAK_HOSTNAME_PORT +
      "/realms/realm_app/protocol/openid-connect/token/introspect",
    {
      ...body,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};
