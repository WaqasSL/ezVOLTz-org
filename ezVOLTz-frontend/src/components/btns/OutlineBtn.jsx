const OutlineBtn = ({
  isApiLoading = false,
  btnType = 'button',
  text,
  handleEvent = () => {},
}) => {
  return (
    <button
      type={btnType}
      onClick={handleEvent}
      className='border border-ezGreen bg-transparent text-ezGreen rounded-md py-3 w-full text-center block hover:bg-ezGreen hover:text-white'
    >
      {text}
    </button>
  );
};

export default OutlineBtn;
