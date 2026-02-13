import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Spiner from 'helper/Spiner';
import { useSelector } from 'react-redux';
import useApiHook from 'hooks/useApiHook';

const VerifyAccount = () => {
  const { auth } = useSelector((state) => state);
  const { token } = useParams();
  const navigate = useNavigate();
  const { handleApiCall } = useApiHook();
  const [isVerification, setIsVerification] = useState(false);
  const [isError, setIsError] = useState({ error: false, message: '' });

  const handleVerification = async (token) => {
    setIsError({ error: false, message: '' });
    try {
      const result = await handleApiCall({
        method: 'get',
        url: `/verify/${token}`,
      });
      if (result?.status === 200) setIsVerification(true);
    } catch (error) {
      setIsError({ error: true, message: error?.response?.data?.error });
    }
  };

  useEffect(() => {
    token && handleVerification(token);
  }, [token]);

  useEffect(() => {
    if (auth?.isLogin) navigate('/home');
  }, [auth?.isLogin]);

  return (
    <div className='ez__AuthPage w-full ez__Login'>
      <div className='max-w-7xl mx-auto px-8'>
        <div className='grid grid-cols1 lg:grid-cols-3 gap-10 items-center py-24 border-b-8 border-ezGreen w-full min-h-screen	'>
          <div className='hidden lg:block lg:col-span-2 w-full'>
            <img
              src='/assets/images/login.png'
              alt='Login'
              className='w-full h-auto'
            />
          </div>
          <div className='ez__AuthForm'>
            <div className='title w-full flex items-center justify-center flex-col'>
              <img
                src='/assets/images/logo.png'
                alt='Logo'
                className='h-20 w-auto block mb-8'
              />
              {isVerification ? (
                <div className=' w-full text-center rounded-md my-10 h-full relative'>
                  <h3 className='text-ezBlack font-bold text-lg md:text-xl mb-6'>
                    Your email has been verified!
                  </h3>
                  <p className='mb-3 text-ezBlack text-base text-center'>
                    Please login and enjoy ezVOLTz.
                  </p>
                  <Link
                    to='/login'
                    className='text-white rounded-md bg-ezGreen border-ezGreen border hover:bg-transparent hover:text-ezGreen font-semibold block px-8 py-2'
                  >
                    Log In
                  </Link>
                </div>
              ) : isError?.error ? (
                <>
                  <p className='text-ezBlack text-base text-center mb-10'>
                    {isError?.message}
                  </p>
                </>
              ) : (
                <>
                  <h3 className='text-ezBlack font-bold text-lg md:text-xl mb-6'>
                    Email is verifing
                  </h3>
                  <p className='text-ezBlack text-base text-center mb-10'>
                    We are verifing your email please wait.
                  </p>
                  <Spiner color='ezGreen' />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VerifyAccount;
