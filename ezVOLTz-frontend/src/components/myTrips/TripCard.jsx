import { dateAgo, tripStatus } from 'helper/functionality';
import { cross, tick } from 'helper/helper';
import moment from 'moment';
import {
  AiFillStop,
  AiOutlineClockCircle,
  AiOutlinePlus,
} from 'react-icons/ai';
import { MdLocationOn, MdOutlineArrowForwardIos } from 'react-icons/md';
import { Link } from 'react-router-dom';

const TripCard = ({ card }) => {
  return (
    <div
      className={`ez__TripCard shadow-md mb-6 flex flex-col md:flex-row items-center bg-white rounded-t-md overflow-hidden w-full p-3 justify-between border-b border-${
        card?.status === tripStatus?.isCompleted
          ? 'ezGreen'
          : card?.status === tripStatus?.inProgress
          ? 'ezOrange'
          : card?.status === tripStatus?.isCancelled
          ? 'ezRed'
          : 'ezGray'
      }`}
    >
      <span
        className={`ez__PosBlock block absolute rotate-90 -bottom-4 -left-5 w-8 h-8 bg-${
          card?.status === tripStatus?.isCompleted
            ? 'ezGreen'
            : card?.status === tripStatus?.inProgress
            ? 'ezOrange'
            : card?.status === tripStatus?.isCancelled
            ? 'ezRed'
            : 'ezGray'
        }`}
      />
      {card?.status === tripStatus?.isCompleted ? (
        <div className='cardIcon  text-ezGreen  mb-5 md:mb-0'>{tick}</div>
      ) : card?.status === tripStatus?.inProgress ? (
        <AiOutlineClockCircle className='w-12 h-12 text-ezOrange' />
      ) : card?.status === tripStatus?.isCancelled ? (
        <div className='cardIcon  text-ezRed  mb-5 md:mb-0'>{cross}</div>
      ) : (
        <div className='border border-ezGray rounded-full'>
          <AiFillStop className='w-12 h-12 text-ezGray' />
        </div>
      )}
      <div className='ez__CardInfo flex w-full flex-wrap items-center justify-between'>
        <div className='ez__InfoText'>
          <span
            className={`text-sm mb-1 text-${
              card?.status === tripStatus?.isCompleted
                ? 'ezGreen'
                : card?.status === tripStatus?.inProgress
                ? 'ezOrange'
                : card?.status === tripStatus?.isCancelled
                ? 'ezRed'
                : 'ezGray'
            }`}
          >
            {card?.status === tripStatus?.isCompleted
              ? 'Completed'
              : card?.status === tripStatus?.inProgress
              ? 'In Progress'
              : card?.status === tripStatus?.isCancelled
              ? 'Trip Cancelled'
              : 'Not Started'}
          </span>
          <h4 className='text-ezBlack text-base mb-2'>
            Trip to {card?.destination?.text}
          </h4>
          <div className='flex md:items-center flex-col sm:flex-row mt-3 md:mt-0'>
            <p className='text-ezGray text-xs flex items-center mb-1 mr-10'>
              <AiOutlineClockCircle className='w-4 h-4 mr-2' />{' '}
              {card?.status !== tripStatus?.isCompleted &&
              card?.status !== tripStatus?.inProgress
                ? moment(card?.startDate).format('MMM DD, YYYY hh:mm A')
                : moment(card?.actualStartDateTime).format(
                    'MMM DD, YYYY hh:mm A'
                  )}
            </p>
            <p className='text-ezGray text-xs flex items-center mb-1 mr-10'>
              <AiOutlinePlus className='w-4 h-4 mr-2' /> {card?.stops?.length}
            </p>
            <p className='text-ezGray text-xs flex items-center mb-1 mr-10'>
              <MdLocationOn className='w-4 h-4 mr-2' /> {card?.distance}
            </p>
            <p className='text-ezGray text-xs flex items-center mb-1 mr-10'>
              {card?.startDate && dateAgo(card?.startDate)}
            </p>
          </div>
        </div>
        <Link
          to={`${
            card?.status === tripStatus?.inProgress
              ? `/inprogress-trip/detail/${card?._id}`
              : `/previous-trip/detail/${card?._id}`
          }`}
          className={`flex items-center justify-center w-7 h-7 rounded-full bg-ezLightGray text-ezBlack ${
            card?.status === tripStatus?.inProgress
              ? 'hover:bg-ezOrange'
              : card?.status === tripStatus?.isCompleted
              ? 'hover:bg-ezGreen'
              : card?.status === tripStatus?.isCancelled
              ? 'hover:bg-ezRed'
              : 'hover:bg-ezGray'
          } hover:text-white`}
        >
          <MdOutlineArrowForwardIos className='w-5' />
        </Link>
      </div>
    </div>
  );
};

export default TripCard;
