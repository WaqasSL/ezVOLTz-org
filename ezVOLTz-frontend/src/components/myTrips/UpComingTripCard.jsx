import { dateComing } from 'helper/functionality';
import moment from 'moment';
import { AiOutlineClockCircle, AiOutlinePlus } from 'react-icons/ai';
import { MdLocationOn, MdOutlineArrowForwardIos } from 'react-icons/md';
import { Link } from 'react-router-dom';
import CardTimer from './CardTimer';

const UpComingTripCard = ({ card, getMyTrips }) => {
  const remaningTime = dateComing(
    card?.startDate && card?.startTime
      ? card?.startTime
      : card?.startDate &&
        new Date(card?.startDate).getDate() === new Date().getDate() &&
        new Date(card?.startDate).getMonth() === new Date().getMonth() &&
        new Date(card?.startDate).getFullYear() === new Date().getFullYear()
      ? new Date(new Date(new Date().setHours(23)).setMinutes(59))
      : card?.startDate
  );

  return (
    <div className='ez__TripCard shadow-md mb-6 flex flex-col md:flex-row bg-white rounded-t-md overflow-hidden w-full p-3 justify-between'>
      {remaningTime?.includes('day') ||
      remaningTime?.includes('month') ||
      remaningTime?.includes('year') ? (
        <div className='w-20 rounded-t-md mb-5 md:mb-0 p-2 text-white flex items-center justify-center text-sm bg-ezGreen'>
          <div className='text-white text-center flex items-center justify-center w-full flex-col'>
            {card?.startDate ? remaningTime : 'Not Scheduled'}{' '}
            {card?.startDate && 'To Go'}
          </div>
        </div>
      ) : (
        <CardTimer
          getMyTrips={getMyTrips}
          startTime={
            card?.startDate && card?.startTime
              ? card?.startTime
              : card?.startDate
              ? new Date(new Date(new Date().setHours(23)).setMinutes(59))
              : null
          }
        />
      )}
      <div className='ez__CardInfo flex w-full flex-wrap items-center justify-between'>
        <div className='ez__InfoText'>
          <div className='flex items-center text-sm mb-1 text-ezGray'>
            <p>{card?.origin?.text?.slice(0, 10)}...</p>
            <img
              src='/assets/svgs/originToDest.svg'
              alt='originToDest'
              className='w-10 h-auto mx-3'
            />
            <p>{card?.destination?.text?.slice(0, 10)}...</p>
          </div>
          <h4 className='text-ezBlack text-base mb-1'>
            Trip to {card?.destination?.text}
          </h4>
          <div className='flex md:items-center flex-col sm:flex-row mt-3 md:mt-0'>
            <p className='text-ezGray text-xs mr-10 flex items-center mb-1'>
              <AiOutlineClockCircle className='w-4 h-4 mr-2' />{' '}
              {card?.startDate
                ? moment(card?.startDate).format('MMMM DD, YYYY')
                : 'Not Scheduled'}
            </p>
            <p className='text-ezGray text-xs mr-10 flex items-center mb-1'>
              <AiOutlinePlus className='w-4 h-4 mr-2' /> {card?.stops?.length}
            </p>
            <p className='text-ezGray text-xs mr-10 flex items-center mb-1'>
              <MdLocationOn className='w-4 h-4 mr-2' /> {card?.distance}
            </p>
          </div>
        </div>
        <Link
          to={`/upcoming-trip/detail/${card?._id}`}
          className='flex items-center justify-center w-7 h-7 rounded-full bg-ezLightGray text-ezBlack hover:bg-ezGreen hover:text-white'
        >
          <MdOutlineArrowForwardIos className='w-5' />
        </Link>
      </div>
    </div>
  );
};

export default UpComingTripCard;
