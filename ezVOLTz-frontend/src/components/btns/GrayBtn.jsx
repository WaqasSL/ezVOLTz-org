import Spiner from 'helper/Spiner';

const GrayBtn = ({
  isLoading = false,
  btnType = 'button',
  isDisabled = false,
  handleEvent,
  text,
  classNameCondition,
}) => {
  return (
    <button
      type={btnType}
      onClick={handleEvent}
      disabled={isDisabled}
      className={`${
        classNameCondition
          ? 'bg-ezGreen hover:bg-transparent hover:text-ezGreen border-ezGreen cursor-pointer'
          : 'bg-ezLightGray border-ezLightGray cursor-not-allowed	'
      }  text-white rounded-md py-3 w-full text-center block border `}
    >
      {isLoading ? <Spiner color='white' /> : text}
    </button>
  );
};

export default GrayBtn;
