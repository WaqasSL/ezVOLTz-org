import useApiHook from 'hooks/useApiHook';
import { useRef, useState } from 'react';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import { toast } from 'react-toastify';
import 'react-phone-number-input/style.css';
import { BiPencil } from 'react-icons/bi';

export default function PhoneVerification({
  setIsChangePhone,
  userInfo,
  getUserInfo,
}) {
  const { handleApiCall, isApiLoading } = useApiHook();
  const [error, setError] = useState({
    isError: false,
    message: '',
  });
  const [isOTPVerification, setIsOTPVerification] = useState(false);
  const [phone, setPhone] = useState(userInfo?.user?.phone);
  const [otpCode, setOtpCode] = useState('');
  const inputRef = useRef(null);

  const sendOTP = async () => {
    if (!phone)
      return toast.error('Phone number is required');
    if (!isPossiblePhoneNumber(phone))
      return toast.error('Invalid phone number');
    const result = await handleApiCall({
      method: 'post',
      url: `user/sms-verification/${userInfo?.user?._id}`,
      data: { phone },
    });
    if (result?.status === 200) {
      toast.success(result?.data?.message);
      setIsOTPVerification(true);
    }
  };

  const verifyOTP = async () => {
    const result = await handleApiCall({
      method: 'post',
      url: `user/sms-verification-code/${userInfo?.user?._id}`,
      data: { phone, otpCode },
    });
    if (result?.status === 200) {
      toast.success(result?.data?.message);
      getUserInfo();
      setIsChangePhone(false);
    }
  };
  
  const setOtpFalse = async () => {
    if (isOTPVerification) {
      setIsOTPVerification(false);
      inputRef.current.focus();
    }
  };

  return (
    <div className='w-full block pb-5'>
      <div className='ez__Form w-full block relative'>
        <div className='block'>
          <label htmlFor='phone' className='block mb-1 text-sm text-ezBlack'>
            Phone
          </label>
          <div className='w-full flex ezSpace-between border border-ezBlack rounded-md text-sm text-ezBlack p-3.5 mb-4'>
            <PhoneInput
              ref={inputRef}
              country='US'
              international={false}
              withCountryCallingCode
              value={phone}
              readOnly={isOTPVerification}
              onChange={(value) => setPhone(value)}
              placeholder='Enter phone number'
              defaultCountry='US'
              initialValueFormat='+1'
              countries={['US']}
              rules={{ required: true, validate: isPossiblePhoneNumber }}
            />
            {error?.isError && (
              <p className='text-ezRed text-sm'>{error?.message}</p>
            )}
            <button
              type='button'
              className='text-ezGreen text-2xl cursor-pointer'
              disabled={isApiLoading}
              onClick={setOtpFalse}
              hidden={!isOTPVerification}
            >
              <BiPencil />
            </button>
          </div>
        </div>
        {isOTPVerification && (
          <div className='block'>
            <label htmlFor='otp' className='block mb-1 text-sm text-ezBlack'>
              Enter Verification Code
            </label>
            <input
              type='number'
              name='otp'
              value={otpCode}
              onChange={(e) => setOtpCode(e?.target?.value)}
              id='otp'
              placeholder='654321'
              className='w-full block border border-ezBlack rounded-md text-sm text-ezBlack p-3.5 mb-4'
            />
          </div>
        )}
        <div className='block'>
          <button
            type='submit'
            disabled={isApiLoading}
            onClick={isOTPVerification ? verifyOTP : sendOTP}
            className={`py-2 px-10 text-sm mb-5 text-white border border-ezGreen bg-ezGreen rounded-md block w-max text-center ${
              isApiLoading ? 'cursor-wait' : 'hover:bg-transparent'
            } hover:text-ezGreen`}
          >
            {isOTPVerification ? 'Verify Code' : 'Send Verification Code'}
          </button>
        </div>
      </div>
    </div>
  );
}
