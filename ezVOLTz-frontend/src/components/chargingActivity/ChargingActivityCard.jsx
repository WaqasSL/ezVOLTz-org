import moment from 'moment';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { GiElectric } from 'react-icons/gi';

const ChargingActivityCard = ({ card }) => {
  return (
    <div
      className={`ez__ChargingActivityCard relative mb-6 flex items-center bg-white rounded-t-md overflow-hidden w-full py-3 px-8 justify-between border-b ${
        card?.status === 'charging' ? 'border-ezOrange' : 'border-ezGreen'
      } `}
    >
      <span
        className={`ez__PosBlock  block absolute rotate-90 -bottom-4 -left-5 w-8 h-8 ${
          card?.status === 'charging' ? 'bg-ezOrange' : 'bg-ezGreen'
        }`}
      />
      <div className='ez__CardChargeInfo flex w-full flex-wrap flex-col md:flex-row md:items-center justify-between'>
        <div className='block'>
          <div className='ez__InfoText flex flex-wrap flex-col md:flex-row md:items-center mb-1'>
            {card?.status === 'charging' ? (
              <span className='py-2 px-8 block text-sm mb-1 text-white bg-ezOrange w-max rounded-md mr-5'>
                Charging
              </span>
            ) : (
              <span className='py-2 px-8 block text-sm mb-1 text-white bg-ezGreen w-max rounded-md mr-5'>
                Charged
              </span>
            )}
            <h4 className='text-ezGreen text-base mb-1 mt-3 md:mt-0'>
              {card?.vehicleId?.make?.make} -
              <span className='ml-1'>
                {card?.vehicleId?.make?.models[0].model}
              </span>
            </h4>
          </div>
          <div className='flex flex-wrap flex-col md:flex-row md:items-center'>
            <p className='text-ezBlack text-xs mr-10 flex items-center mb-1 md:mb-0'>
              <AiOutlineClockCircle className='w-4 h-4 mr-2' />{' '}
              {moment(card?.startTime).format('HH:mm')} -
              <span className='ml-1'>
                {card?.endTime
                  ? moment(card?.endTime).format('HH:mm')
                  : 'charging'}
              </span>
            </p>
            <p className='text-ezBlack text-xs mr-10 flex items-center'>
              <GiElectric className='w-4 h-4 mr-2' /> {card?.chargeBoxId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargingActivityCard;
