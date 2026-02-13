import AppleLogin from 'react-apple-login';

const AppleLoginButton = ({ appleLoginSuccess }) => {
  return (
    <div className='w-full block'>
      <AppleLogin
        clientId={process.env.REACT_APP_APPLE_CLIENT_ID}
        redirectURI={process.env.REACT_APP_APPLE_REDIRECT_URI}
        usePopup={true}
        callback={appleLoginSuccess}
        scope='email name'
        responseMode='query'
        render={({ onClick }) => (
          <button
            className='bg-ezBlack w-full rounded-md text-white text-center p-3 my-2'
            onClick={onClick}
          >
            Login with Apple
          </button>
        )}
      />
    </div>
  );
};

export default AppleLoginButton;
