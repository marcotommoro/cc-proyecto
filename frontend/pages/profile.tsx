import axios from 'axios';
import { useState } from 'react';
import { useAlert } from 'react-alert';
import { FormSettings } from '../components/FormSettings';
import { Spinner } from '../components/Spinner';
import { UploadImage } from '../components/UploadImage';

interface User {
  email: string;
  token?: string | undefined;
  authenticated?: boolean;
  name?: string;
}

export default function Profile() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, text: '' });
  const alert = useAlert();
  const [username, setUsername] = useState('marcomoroni99@gmail.com');
  const [password, setPassword] = useState('ciaociao');

  const handleLogin = async () => {
    try {
      const { data } = await axios.post('/api/auth/get-token', {
        username,
        password,
      });
      setToken(data.access_token);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const authConnection = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/check-auth');
      alert.success(`${data.msg}`);
    } catch (error) {
      alert.error('Auth connection failed.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleLogOut = () => {
    setToken('');
  };

  return (
    <>
      <div
        id='toast-top-right'
        className={` ${
          toast.show ? 'opacity-100' : 'opacity-0'
        } transition-all duration-500   absolute flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow top-5 right-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800`}
        role='alert'
      >
        <div className='text-sm font-normal'>{toast.text}</div>
      </div>

      <div className='p-3'>
        <h1 className='text-5xl font-bold text-center mb-9'>PROFILE</h1>
        {!token ? (
          <div>
            <input
              type='text'
              placeholder='email'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className='p-3 text-2xl bg-blue-500' onClick={handleLogin}>
              LOGIN
            </button>
          </div>
        ) : (
          <>
            <FormSettings />

            <UploadImage />

            <div className='flex justify-center flex-grow gap-32 my-5'>
              <button
                className='flex justify-center p-3 text-center uppercase bg-yellow-600'
                disabled={loading}
                onClick={authConnection}
              >
                {loading ? <Spinner /> : <>Check auth connection</>}
              </button>
            </div>
            <div className='flex justify-center'>
              <button className='p-3 bg-red-700 ' onClick={handleLogOut}>
                LOGOUT
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
