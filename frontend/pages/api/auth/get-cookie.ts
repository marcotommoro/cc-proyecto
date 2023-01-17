// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { getCookie } from 'cookies-next';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    // @ts-ignore
    if (req.method !== 'POST')
      return res.status(405).send('Method not allowed');

    const { name } = req.body;
    const cookie = getCookie(name, { req, res });

    return res
      .status(200)
      .json({ cookie, brokerUrl: process.env.BROKER_HOSTNAME_EXTERNAL });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
