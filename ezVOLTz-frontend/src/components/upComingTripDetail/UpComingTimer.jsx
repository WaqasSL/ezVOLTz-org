import { useCountHook } from 'hooks/useCountHook';
import { AiOutlineClockCircle } from 'react-icons/ai';

const UpComingTimer = ({ startTime }) => {
  const [days, hours, minutes, seconds] = useCountHook(startTime);

  return (
    <p className='flex items-center justify-center w-full mb-5 mt-8 text-ezBlack text-3xl'>
      <AiOutlineClockCircle className='w-5 h-5 mr-2' />{' '}
      {hours < 0 || minutes < 0 || seconds < 0 ? (
        '0:0:0'
      ) : (
        <div className='flex items-center justify-start text-base'>
          <span className='bg-red-200 text-red-700 rounded-sm py-2 px-4 mx-1'>
            {hours} h
          </span>
          <span className='bg-red-200 text-red-700 rounded-sm py-2 px-4 mx-1'>
            {minutes} m
          </span>
          <span className='bg-red-200 text-red-700 rounded-sm py-2 px-4 mx-1'>
            {seconds} s
          </span>
        </div>
      )}
    </p>
  );
};

export default UpComingTimer;
