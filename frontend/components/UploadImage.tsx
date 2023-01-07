import axios from 'axios';
import { useState } from 'react';

export const UploadImage = () => {
  // form upload image

  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file!);
    const { data } = await axios.post(
      'http://127.0.0.1:5001/auth/upload-background',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type='file'
          onChange={(e) => {
            setFile(e.target.files![0]);
          }}
        />
        <button type='submit'>Upload</button>
      </form>
    </div>
  );
};
