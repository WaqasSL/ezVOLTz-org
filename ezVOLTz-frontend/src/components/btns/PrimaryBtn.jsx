import Spiner from 'helper/Spiner';

const PrimaryBtn = ({
  isApiLoading = false,
  btnType = 'submit',
  text,
  handleEvent = () => {},
  classNames,
}) => {
  return (
    <button
      type={btnType}
      onClick={handleEvent}
      disabled={isApiLoading}
      className={`text-base mb-5 text-white border border-ezGreen bg-ezGreen rounded-md block w-full text-center ${
        isApiLoading ? 'cursor-wait' : 'hover:bg-transparent'
      } hover:text-ezGreen ${classNames} py-3`}
    >
      {isApiLoading ? <Spiner color='white' /> : text}
    </button>
  );
};

export default PrimaryBtn;
