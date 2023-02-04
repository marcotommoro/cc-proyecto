import axios from 'axios';
import qs from 'qs';

export const validateToken = async (token: string) => {
  token = token.replace('Bearer ', '');

  const body = qs.stringify({
    token,
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
    username: process.env.KEYCLOAK_USERNAME,
    client_id: process.env.KEYCLOAK_CLIENT_ID,
  });

  var config = {
    method: 'post',
    url: `${process.env.KEYCLOAK_HOSTNAME}/realms/realm_app/protocol/openid-connect/token/introspect`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: body,
  };

  console.log(config);

  const { data } = await axios(config);

  console.log(data);
  return data;
};
