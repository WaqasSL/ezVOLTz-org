const Loader = ({ background }) => {
  return (
    <div
      className={`fixed top-0 left-0 ${
        background ? background : 'bg-ezLightWhite'
      } flex items-center justify-center w-screen h-screen z-50`}
    >
      <div className='flex align-center justify-center'>
        <div className='dot1 bg-ezGreen rounded-full m-2'></div>
        <div className='dot2 bg-ezGreen rounded-full m-2'></div>
        <div className='dot3 bg-ezGreen rounded-full m-2'></div>
      </div>
    </div>
  );
};

export default Loader;
