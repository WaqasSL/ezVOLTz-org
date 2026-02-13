import PrimaryBtn from 'components/btns/PrimaryBtn';
import TripCard from 'components/myTrips/TripCard';
import UpComingTripCard from 'components/myTrips/UpComingTripCard';
import Spiner from 'helper/Spiner';
import {
  filterAndSortPreviousTrips,
  filterAndSortUpcomingTrips,
  filterUpcomingTrips,
} from 'helper/functionality';
import useApiHook from 'hooks/useApiHook';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  handlPlanTripModal,
  toggleIsPlanApiCall,
} from 'redux/dashbbaord/dashboardSlice';

const MyTrip = () => {
  const { auth, dashboard } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { handleApiCall, isApiLoading } = useApiHook();
  const [trips, setTrips] = useState('upcoming');
  const [previousTrips, setPreviousTrips] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);

  const getMyTrips = async () => {
    const result = await handleApiCall({
      method: 'get',
      url: `/trip/${auth?.userInfo?.user?._id}`,
    });
    if (result?.status === 200) {
      setPreviousTrips(filterAndSortPreviousTrips(result?.data?.trips) || []);
      setUpcomingTrips(filterAndSortUpcomingTrips(result?.data?.trips) || []);
      dispatch(toggleIsPlanApiCall(false));
    }
  };

  useEffect(() => {
    if (!dashboard?.isPlanApiCall && auth?.userInfo?.user?._id) getMyTrips();
  }, []);

  useEffect(() => {
    if (dashboard?.isPlanApiCall && auth?.userInfo?.user?._id) getMyTrips();
  }, [dashboard?.isPlanApiCall]);

  return (
    <div className='ez__MyTrip w-full bg-ezMidWhite px-4 py-10 md:p-10'>
      <div className='ez__Title w-full flex md:items-center justify-between mb-8 flex-col md:flex-row'>
        <h3 className='text-ezBlack text-xl mb-3 md:mb-0'>
          {trips === 'upcoming' ? 'Upcoming' : 'Previous'} Trips
        </h3>
        <div className='ml-auto md:ml-0 z__Tabs w-max border border-ezGreen rounded-md overflow-hidden'>
          <button
            onClick={() => setTrips('previous')}
            className={`${
              trips === 'previous'
                ? 'bg-ezGreen text-white'
                : 'text-ezGreen bg-transparent'
            } text-sm md:text-base py-2 px-4 md:px-7`}
          >
            Previous Trips
          </button>
          <button
            onClick={() => setTrips('upcoming')}
            className={`${
              trips === 'upcoming'
                ? 'bg-ezGreen text-white'
                : 'text-ezGreen bg-transparent'
            } text-sm md:text-base py-2 px-4 md:px-7`}
          >
            Upcoming Trips
          </button>
        </div>
      </div>
      <div className='block w-full'>
        {isApiLoading && (
          <div className='col-span-3 block w-full h-96'>
            <Spiner color='ezGreen' />
          </div>
        )}

        {!isApiLoading && trips === 'previous' && previousTrips?.length > 0
          ? previousTrips?.map((card) => (
              <TripCard key={`TripCardKey${card?._id}`} card={card} />
            ))
          : trips === 'previous' &&
            !isApiLoading && (
              <div className='w-full flex items-center justify-center flex-col py-32'>
                <img
                  src='/assets/svgs/noTrip.svg'
                  alt='No Trip'
                  className='w-32 md:w-56 h-auto mb-5'
                />
                <p className='text-ezGray text-sm md:text-base mb-5'>
                  There is no previous trip
                </p>
                <PrimaryBtn
                  handleEvent={() => dispatch(handlPlanTripModal(true))}
                  text='Plan a trip'
                  btnType='button'
                  classNames='w-56'
                />
              </div>
            )}
        {!isApiLoading && trips === 'upcoming' && upcomingTrips?.length > 0
          ? upcomingTrips?.map((card) => (
              <UpComingTripCard
                key={`UpComingTripCardKey${card?._id}`}
                card={card}
                getMyTrips={getMyTrips}
              />
            ))
          : trips === 'upcoming' &&
            !isApiLoading && (
              <div className='w-full flex items-center justify-center flex-col py-32'>
                <img
                  src='/assets/svgs/noTrip.svg'
                  alt='No Trip'
                  className='w-32 md:w-56 h-auto mb-5'
                />
                <p className='text-ezGray text-sm md:text-base mb-5'>
                  There is no upcoming trip
                </p>
                <PrimaryBtn
                  handleEvent={() => dispatch(handlPlanTripModal(true))}
                  text='Plan a trip'
                  btnType='button'
                  classNames='w-56'
                />
              </div>
            )}
      </div>
    </div>
  );
};

export default MyTrip;
