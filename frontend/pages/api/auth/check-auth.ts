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
  const { NEXT_PUBLIC_BROKER_HOSTNAME } = process.env;
  const bearerToken = getCookie('keycloak_access_token', { req, res });

  try {
    const { data } = await axios.post(
      `${NEXT_PUBLIC_BROKER_HOSTNAME}/auth/check-user`,
      {},
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      },
    );

    res.status(200).json({ ...data });
  } catch (error) {
    // @ts-ignore
    console.log(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}
