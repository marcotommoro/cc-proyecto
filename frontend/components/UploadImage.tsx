import axios from 'axios';
import { useState } from 'react';
import { useAlert } from 'react-alert';

export const UploadImage = () => {
  // form upload image
  const alert = useAlert();

  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file!);

    try {
      await axios.post('/api/auth/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert.show('Successfully uploaded', { type: 'success' });
    } catch (error) {
      alert.show('Upload failed.', { type: 'error' });
    }
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
