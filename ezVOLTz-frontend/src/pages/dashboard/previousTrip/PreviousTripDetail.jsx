import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import TripEVMarker from 'components/home/TripEVMarker';
import Loader from 'helper/Loader';
import Spiner from 'helper/Spiner';
import useApiHook from 'hooks/useApiHook';
import DeleteModal from 'modals/common/DeleteModal';
import ReschedulePlanTrip from 'modals/planTrip/ReschedulePlanTrip';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { BiChevronRight } from 'react-icons/bi';
import { BsTrash } from 'react-icons/bs';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdOutlineLocationOn } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTripDetailDirections } from 'utls/apiCalls/googleApi';
import { instanceNREL } from 'utls/instances';

const PreviousTripDetail = () => {
  const { auth } = useSelector((state) => state);
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { handleApiCall, isApiLoading } = useApiHook();
  const [isLoading, setIsLoading] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [isDelLoading, setIsDelLoading] = useState(false);
  const [isTripReschedule, setIsTripReschedule] = useState(false);
  const [tripDetail, setTripDetail] = useState(null);
  const [chargingStops, setChargingStops] = useState([]);
  const [allEVs, setAllEVs] = useState([]);
  const [directions, setDirections] = useState(null);

  const getDirections = async ({
    origin,
    destination,
    stops,
    network,
    chargersType,
    connector,
  }) => {
    setIsLoading(false);
    const result = await getTripDetailDirections({
      origin,
      destination,
      stops: stops?.map((stop) => stop?.name),
    });
    if (result.isSuccess) {
      setDirections(result?.data);
      let lineString = result?.data.routes[0].overview_path
        ?.map((point) => {
          return `${point.lng()} ${point.lat()}`;
        })
        ?.join(', ');
      getAllEV({
        network,
        chargersType,
        connector,
        lineString,
        retryTime: 0,
      });
    }
  };

  const getSingleTrip = async (userId) => {
    const result = await handleApiCall({
      method: 'get',
      url: `/trip/${userId}/${tripId}`,
    });
    if (result?.status === 200) {
      setTripDetail(result?.data?.trip);
      getDirections(result?.data?.trip);
    }
  };

  const deleteTrip = async () => {
    setIsDelLoading(true);
    const result = await handleApiCall({
      method: 'delete',
      url: `/trip/${auth?.userInfo?.user?._id}/${tripId}`,
    });
    if (result?.status === 200) {
      setIsModal(false);
      toast.success(result?.data?.message);
      navigate('/my-trips');
      setIsDelLoading(false);
    }
  };

  const getAllEV = async ({
    network,
    chargersType,
    connector,
    lineString,
    retryTime = 0,
  }) => {
    if (retryTime > 1) return;
    try {
      let url = `alt-fuel-stations/v1/nearby-route.json?route=LINESTRING(${lineString})&ev_network=${network}&ev_connector_type=${connector}&status=${
        chargersType === 'availableChargers' ? 'E' : 'all'
      }&distance=1`;
      const result = await instanceNREL.get(url);
      if (result.status === 200) {
        setAllEVs(result?.data);
      }
    } catch (error) {
      setIsLoading(false);
      if (error?.code === 'ERR_NETWORK') {
        let lineString = directions.routes[0].overview_path
          ?.map((point, index) => {
            if (index === directions.routes[0].overview_path?.length - 1)
              return `${point.lng()} ${point.lat()}`;
            else if (index % 2 === 0) return `${point.lng()} ${point.lat()}, `;
          })
          .join('');
        return getAllEV({
          network: tripDetail?.network,
          chargersType: tripDetail?.chargersType,
          connector: tripDetail?.connector,
          lineString,
          retryTime: retryTime + 1,
        });
      }
      toast.error('No pins found against this route.');
    }
  };

  useEffect(() => {
    if (auth?.userInfo?.user?._id) getSingleTrip(auth?.userInfo?.user?._id);
  }, []);

  return (
    <div className='ez__PreviousTripDetail w-full bg-ezMidWhite py-10 px-4 md:p-10'>
      {isApiLoading || isLoading ? (
        <Spiner color='ezGreen' />
      ) : (
        <>
          {isDelLoading && <Loader background='transparency' />}
          <div className='ez__Title w-full flex flex-col md:flex-row md:items-center justify-between mb-8'>
            <h3 className='text-ezBlack text-xl'>
              Trip to {tripDetail?.destination?.text}
            </h3>
            <div className='ez__Tabs w-max flex items-center ml-auto mt-4 md:m-0'>
              <button
                type='button'
                onClick={() => setIsTripReschedule(true)}
                className='bg-ezGreen text-white rounded-md mr-5 text-sm md:text-base py-2.5 px-10 border border-ezGreen hover:bg-transparent hover:text-ezGreen'
              >
                Reschedule Trip
              </button>
              <button
                type='button'
                onClick={() => setIsModal(true)}
                className='text-ezBlack hover:text-ezRed'
              >
                <BsTrash className='w-5 h-5' />
              </button>
            </div>
          </div>
          <div className='grid grid-col-1 md:grid-cols-2 gap-8 w-full items-start'>
            <div className='tripMap border border-ezGreen overflow-hidden rounded-md w-full h-96 md:col-span-2'>
              {directions && (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  options={{ minZoom: 4, maxZoom: 18 }}
                >
                  {directions && (
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        polylineOptions: {
                          strokeOpacity: 1,
                          strokeColor: '#228B22',
                          strokeWeight: 5,
                        },
                      }}
                    />
                  )}
                  {allEVs?.fuel_stations?.length > 0 &&
                    allEVs?.fuel_stations?.map((ev) => (
                      <TripEVMarker
                        key={`EVDetailPreviousPointsKey${
                          ev?.id
                        }--${new Date().getTime()}`}
                        ev={ev}
                      />
                    ))}
                </GoogleMap>
              )}
            </div>
            <div className='ez__TripDetailCard w-full block px-6 py-8 border border-ezGreen rounded-md bg-white'>
              <h4 className='text-ezBlack text-xl mb-4 font-semibold'>
                Trip Details:
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <p className='text-sm md:text-base flex items-center md:col-span-2 text-ezBlack'>
                  <MdOutlineLocationOn className='w-8 md:w-6 h-8 md:h-6 mr-1' />{' '}
                  Trip to {tripDetail?.destination?.text}
                </p>
                <p className='text-sm md:text-base flex items-center text-ezBlack'>
                  <FaCalendarAlt className='w-5 h-5 mr-2' />{' '}
                  {tripDetail?.startDate
                    ? moment(tripDetail?.startDate).format('DD MMMM YYYY')
                    : moment(tripDetail?.actualStartDateTime).format(
                        'DD MMMM YYYY'
                      )}
                </p>
                <p className='text-sm md:text-base flex items-center text-ezBlack'>
                  <AiOutlineClockCircle className='w-5 h-5 mr-2' />
                  {tripDetail?.time}
                </p>
              </div>
              <div className='ez__CarInfo grid grid-cols-5 items-center gap-4 mb-7 border-t border-b border-ezLightWhite my-8 py-8'>
                <img
                  src={
                    tripDetail?.vehicleId?.picture
                      ? tripDetail?.vehicleId?.picture
                      : '/assets/images/carImg.jpg'
                  }
                  alt='Car Wheel'
                  className='w-full h-auto border border-ezGreen rounded-lg col-span-2 md:col-span-1'
                />
                <div className='col-span-3 md:col-span-4 w-full block'>
                  <h3 className='text-ezBlack text-xl font-bold'>
                    <span className='mr-2'> Make:</span>
                    {tripDetail?.vehicleId?.make?.make}
                  </h3>
                  <p className='text-ezBlack text-sm md:text-base mb-1'>
                    <span className='mr-2'> Model:</span>
                    {tripDetail?.vehicleId?.make?.models[0]?.model}
                  </p>
                  <p className='text-ezBlack text-sm md:text-base mb-1'>
                    <span className='mr-2'> Range:</span>
                    {tripDetail?.vehicleId?.range}
                  </p>
                </div>
              </div>
              <ul className='w-full block'>
                <li className='flex items-center mb-2 text-sm md:text-base'>
                  <b className='font-semibold mr-2'>Origin:</b>{' '}
                  {tripDetail?.origin?.text}
                </li>
                <li className='flex items-center mb-2 text-sm md:text-base'>
                  <b className='font-semibold mr-2'>Destination:</b>{' '}
                  {tripDetail?.destination?.text}
                </li>
                <li className='flex items-center mb-2 text-sm md:text-base'>
                  <b className='font-semibold mr-2'>Energy:</b>{' '}
                  {tripDetail?.energy}
                </li>
                <li className='flex items-center mb-2 text-sm md:text-base'>
                  <b className='font-semibold mr-2'>Average Speed:</b>{' '}
                  {tripDetail?.speed}
                </li>
                <li className='flex items-center mb-2 text-sm md:text-base'>
                  <b className='font-semibold mr-2'>Total Miles:</b>{' '}
                  {tripDetail?.distance}
                </li>
              </ul>
            </div>
            <div className='ez__TripDetailCard w-full block px-6 py-8 border border-ezGreen rounded-md bg-white'>
              <h4 className='text-ezBlack text-xl mb-4 font-semibold'>
                Charge Stops
              </h4>
              <ul>
                {chargingStops?.length > 0 ? (
                  [(1, 2, 3, 4, 5)]?.map((list) => (
                    <li
                      className='flex items-center justify-between border-b border-ezLightWhite py-4'
                      key={`ChargingListKey${list}`}
                    >
                      <div className='flex items-center'>
                        <span className='bg-ezGreen rounded-full mr-3 w-7 h-7 flex items-center justify-center text-white text-sm'>
                          {list}
                        </span>
                        <p className='text-ezBlack text-sm md:text-base'>
                          Nema 520, Denver
                        </p>
                      </div>
                      <span className='text-ezGray text-xs md:text-sm'>
                        6:50PM - 7:20PM
                      </span>
                      <button className='text-ezBlack'>
                        <BiChevronRight className='w-5 h-5' />
                      </button>
                    </li>
                  ))
                ) : (
                  <p className='text-ezBlack'>
                    No charging detail found againts this trip
                  </p>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
      {isTripReschedule && (
        <ReschedulePlanTrip
          isTripReschedule={isTripReschedule}
          setIsTripReschedule={setIsTripReschedule}
          tripDetail={tripDetail}
        />
      )}
      {isModal && (
        <DeleteModal
          isModal={isModal}
          isLoading={isDelLoading}
          handleCloseModal={() => setIsModal(false)}
          title='Trip Detele'
          description='Are you sure you want to delete this trip?'
          handleDelete={deleteTrip}
        />
      )}
    </div>
  );
};

export default PreviousTripDetail;
