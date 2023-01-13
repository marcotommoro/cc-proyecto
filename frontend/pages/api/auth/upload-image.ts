// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
import { getCookie } from 'cookies-next';

type Data = {
  name: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // @ts-ignore
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  const { BROKER_HOSTNAME } = process.env;
  const bearerToken = getCookie('keycloak_access_token', { req, res });

  const formData = req.body;

  // if (!formData) return res.status(400).send('Bad request');

  // console.log(formData);
  try {
    const { data } = await axios.post(
      `http://${BROKER_HOSTNAME}/auth/upload-background`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': `multipart/form-data`,
        },
      },
    );
    console.log(data);

    res.status(200).json({ message: 'Image uploaded' });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}
