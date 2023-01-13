import axios from 'axios';
import React, { useState } from 'react';
import { useAlert } from 'react-alert';
import { Spinner } from './Spinner';

export interface Data {
  beforeText: string;
  afterText: string;
  reverse: boolean;
  uppercase: boolean;
}

interface Props {
  brokerUrl: string;
}

export const FormSettings = () => {
  const [data, setData] = useState({
    beforeText: '',
    afterText: '',
    reverse: false,
    uppercase: false,
  });

  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      await axios.post('/api/auth/update-settings', { data });

      alert.show('Successfully updated', { type: 'success' });
    } catch (error) {
      console.log(error);
      alert.show('Update failed.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='flex justify-center'>
        <h1 className='p-3 text-4xl font-bold text-center uppercase border'>
          update form Settings
        </h1>
      </div>
      <form className='flex flex-col items-center justify-center'>
        <div className='my-3'>
          <label htmlFor='beforeText'>Before Text</label>
          <input
            className='block p-3 text-xl rounded-md h-7'
            type='text'
            name='beforeText'
            id='beforeText'
            onChange={(e: any) => {
              setData({ ...data, beforeText: e.target.value });
            }}
          />
        </div>

        <div>
          <label htmlFor='afterText'>After Text</label>
          <input
            className='block p-3 text-xl rounded-md h-7'
            type='text'
            name='afterText'
            id='afterText'
            onChange={(e: any) => {
              setData({ ...data, afterText: e.target.value });
            }}
          />
        </div>

        <div className='mt-6'>
          <label className='pr-3' htmlFor='reverse'>
            Reverse
          </label>
          <input
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            type='checkbox'
            name='reverse'
            id='reverse'
            onChange={(e: any) => {
              setData({ ...data, reverse: e.target.checked });
            }}
          />
        </div>

        <div>
          <label className='pr-3' htmlFor='uppercase'>
            Uppercase
          </label>
          <input
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            type='checkbox'
            name='uppercase'
            id='uppercase'
            onChange={(e: any) => {
              setData({ ...data, uppercase: e.target.checked });
            }}
          />
        </div>

        <button
          className='p-3 my-5 text-xl uppercase bg-green-600'
          type='submit'
          disabled={loading}
          // @ts-ignore
          onClick={handleSubmit}
        >
          {loading ? <Spinner /> : 'Update settings'}
        </button>
      </form>
    </div>
  );
};
