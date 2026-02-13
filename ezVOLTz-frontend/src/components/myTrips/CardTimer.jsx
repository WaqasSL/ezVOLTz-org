import { clockSvg } from 'helper/helper';
import { useCountHook } from 'hooks/useCountHook';

const CardTimer = ({ startTime }) => {
  const [days, hours, minutes, seconds] = useCountHook(startTime);

  return (
    <>
      <div className='w-20 rounded-t-md mb-5 md:mb-0 p-2 text-white flex items-center justify-center text-sm bg-ezRed'>
        <div className='text-white text-center flex items-center justify-center w-full flex-col'>
          {clockSvg}{' '}
          {`${
            hours < 0 || minutes < 0 || seconds < 0
              ? '0:0:0'
              : `${hours}:${minutes}:${seconds}`
          }`}
        </div>
      </div>
    </>
  );
};

export default CardTimer;
