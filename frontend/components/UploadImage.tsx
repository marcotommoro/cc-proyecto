import axios from 'axios';
import { useState } from 'react';
import { useAlert } from 'react-alert';

export const UploadImage = () => {
  // form upload image
  const alert = useAlert();

  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file!);

      const { data } = await axios.post('/api/auth/get-cookie', {
        name: 'keycloak_access_token',
      });

      await axios.post(
        `http://${data.brokerUrl}/auth/upload-background`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${data.cookie}`,
          },
        },
      );
      alert.show('Successfully uploaded', { type: 'success' });
    } catch (error) {
      alert.show('Upload failed.', { type: 'error' });
    }
  };

  return (
    <div className='flex justify-center py-3 border-y-2'>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          className='p-2 border border-gray-300 rounded-md '
          type='file'
          onChange={(e) => {
            setFile(e.target.files![0]);
          }}
        />
        <button className='p-2 ml-3 bg-blue-700 border rounded' type='submit'>
          Upload
        </button>
      </form>
    </div>
  );
};
