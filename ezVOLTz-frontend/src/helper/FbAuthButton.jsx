import React from 'react';
import { LoginSocialFacebook } from 'reactjs-social-login';

const FbAuthButton = ({ handleFacebookResponse, text }) => {
  return (
    <LoginSocialFacebook
      appId={process.env.REACT_APP_FB_APP_ID || ''}
      redirect_uri={process.env.REACT_APP_REDIRECT_URI}
      onResolve={handleFacebookResponse}
      className='w-full block cursor-pointer'
      onReject={(err) => console.log(err)}
    >
      <div className='py-3 border border-ezBlack  text-sm text-black rounded-md w-full flex items-center justify-center hover:text-ezGreen  hover:border-ezGreen'>
        <img
          src='/assets/images/facebook.png'
          alt='facebook'
          className='h-7 w-auto mr-2'
        />{' '}
        {text}
      </div>
    </LoginSocialFacebook>
  );
};

export default FbAuthButton;
