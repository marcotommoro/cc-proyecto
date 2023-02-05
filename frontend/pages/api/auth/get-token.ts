// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
import qs from 'qs';

import { setCookie } from 'cookies-next';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // @ts-ignore
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  const { NEXT_PUBLIC_KEYCLOAK_HOSTNAME } = process.env;

  const { username, password } = req.body;

  if (!username || !password) res.status(400).send('Bad request');

  const data = qs.stringify({
    grant_type: 'password',
    username: username,
    client_id: 'next-app',
    password: password,
  });

  console.log(data);

  const config = {
    method: 'post',
    url: `${NEXT_PUBLIC_KEYCLOAK_HOSTNAME}/realms/realm_app/protocol/openid-connect/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: data,
  };
  try {
    const { data: data2 } = await axios(config);
    // @ts-ignore
    setCookie('keycloak_access_token', data2.access_token, {
      req,
      res,
    });
    res.status(200).json({ ...data2 });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: `Unauthorized ${error}` });
  }
}
