// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
import { getCookie } from 'cookies-next';
import { IncomingForm } from 'formidable';

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
  const { NEXT_PUBLIC_BROKER_HOSTNAME } = process.env;
  const bearerToken = getCookie('keycloak_access_token', { req, res });

  const form = new IncomingForm();
  const formData = new FormData();

  const files = await new Promise((resolve, reject) => {
    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err);
        return;
      }
      console.log(
        'within form.parse method, subject field of fields object is: ',
      );
      resolve(files);
    }); // form.parse
  });

  // console.log('ret', files['file']);
  formData.append('file', files['file']);
  console.log(req.headers);

  try {
    const { data } = await axios.post(
      `${NEXT_PUBLIC_BROKER_HOSTNAME}/auth/upload-background`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': req.headers['content-type'],
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
