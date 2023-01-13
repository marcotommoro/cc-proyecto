// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
import { getCookie } from 'cookies-next';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // @ts-ignore
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  const { BROKER_HOSTNAME } = process.env;
  const bearerToken = getCookie('keycloak_access_token', { req, res });

  const { data } = req.body;

  if (!data) res.status(400).send('Bad request');

  try {
    await axios.post(
      `http://${BROKER_HOSTNAME}/auth/change-observer-settings`,
      {
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      },
    );
    res.status(200).json({ message: 'Settings updated' });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
