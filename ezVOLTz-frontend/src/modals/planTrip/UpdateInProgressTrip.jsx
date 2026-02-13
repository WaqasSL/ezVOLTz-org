import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { handlPlanTripModal } from 'redux/dashbbaord/dashboardSlice';
import { tick } from 'helper/helper';
import { MdCancel } from 'react-icons/md';
import { useJsApiLoader } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { initialValues } from 'helper/functionality';
import useApiHook from 'hooks/useApiHook';
import UpdateInProgressStep from 'components/planTrip/inProgress/UpdateInProgressStep';
import { toast } from 'react-toastify';

export default function UpdateInProgressTrip({
  isTripUpdate,
  setIsTripUpdate,
  tripDetail,
  directions,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleApiCall, isApiLoading } = useApiHook();
  const { auth } = useSelector((state) => state);
  const cancelButtonRef = useRef(null);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [formValues, setFormValues] = useState({
    startFrom: tripDetail?.origin?.text,
    destination: tripDetail?.destination?.text,
    inBetween: tripDetail?.stops?.map((stop, ind) => {
      return {
        id: `${new Date().toISOString()}${ind}`,
        value: stop?.name,
        type: stop?.type,
      };
    }),
    startDate: tripDetail?.startDate ? new Date(tripDetail?.startDate) : null,
    startTime: tripDetail?.startTime ? new Date(tripDetail?.startTime) : null,
    avoidTolls: tripDetail?.avoidTolls,
    avoidTraffic: tripDetail?.avoidTraffic,
    avoidHighways: tripDetail?.avoidHighways,
    compatible: tripDetail?.compatible || true,
    hotels: tripDetail?.hotels,
    restaurants: tripDetail?.restaurants,
    campGround: tripDetail?.campGround,
    vehicle: {
      ...tripDetail?.vehicleId,
      make: {
        _id: tripDetail?.vehicleId?.make?._id,
        name: tripDetail?.vehicleId?.make?.make,
      },
      model: {
        ...tripDetail?.vehicleId?.make?.models[0],
      },
    },
    chargersType: tripDetail?.chargersType,
    connectorType: tripDetail?.connector,
    network: tripDetail?.network,
    distance: tripDetail?.distance,
    time: tripDetail?.time,
    speed: tripDetail?.speed,
    energy: tripDetail?.energy,
    cost: tripDetail?.cost,
  });
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const updateTrip = async () => {
    const result = await handleApiCall({
      method: 'patch',
      url: `/trip/${auth?.userInfo?.user?._id}/${tripDetail?._id}`,
      data: {
        ...formValues,
        origin: {
          text: formValues.startFrom,
          latitude: directions?.routes[0]?.legs[0]?.start_location?.lat(),
          longitude: directions?.routes[0]?.legs[0]?.start_location?.lng(),
        },
        destination: {
          text: formValues.destination,
          latitude:
            directions?.routes[0]?.legs[
              directions?.routes[0]?.legs?.length - 1
            ]?.end_location?.lat(),
          longitude:
            directions?.routes[0]?.legs[
              directions?.routes[0]?.legs?.length - 1
            ]?.end_location?.lng(),
        },
        stops: formValues.inBetween?.map((stop) => ({
          name: stop?.value,
          type: stop?.type,
        })),
      },
    });
    if (result?.status === 200) {
      toast.success('Your trip has been updated.');
      setFormValues(initialValues);
      setStepCompleted(true);
      handlDone();
    }
  };

  const handlDone = () => {
    setIsTripUpdate(false);
    setStepCompleted(false);
    navigate('/my-trips');
  };

  return (
    <Transition.Root show={isTripUpdate || false} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={() => setIsTripUpdate(true)}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center py-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='w-full relative transform bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                <div className='bg-white p-0'>
                  {!stepCompleted ? (
                    <>
                      <div className='ez__PlanTripHead w-full bg-ezGreen py-4 px-4 md:px-12 flex items-center justify-between'>
                        <p className='text-white'>Update In Progress Trip</p>{' '}
                        <button
                          type='button'
                          onClick={() => {
                            setIsTripUpdate(false);
                            setStepCompleted(false);
                            setFormValues(initialValues);
                          }}
                          className='bg-white text-ezGreen rounded-full md:-mr-5'
                        >
                          <MdCancel className='w-8 h-8' />
                        </button>
                      </div>
                      <UpdateInProgressStep
                        formValues={formValues}
                        directions={directions}
                        setFormValues={setFormValues}
                        tripLoading={isApiLoading}
                        updateTrip={updateTrip}
                      />
                    </>
                  ) : (
                    <div
                      className='block w-full p-6'
                      style={{ height: '600px' }}
                    >
                      <div className='border border-ezGreen rounded-md flex flex-col items-center justify-center w-full h-full relative'>
                        <button
                          type='button'
                          onClick={() => {
                            dispatch(handlPlanTripModal(false));
                            setStepCompleted(false);
                          }}
                          className='bg-white text-ezGreen absolute -top-3 -right-3 z-10'
                        >
                          <MdCancel className='w-8 h-8' />
                        </button>
                        <div className='ez__Svg text-ezGreen mb-5'>{tick}</div>
                        <h3 className='text-ezBlack font-bold text-lg md:text-2xl mb-3'>
                          Congratulations!
                        </h3>
                        <h3 className='text-ezBlack font-bold text-lg md:text-2xl mb-4'>
                          Your trip has been updated successfully
                        </h3>
                        <button
                          type='button'
                          onClick={handlDone}
                          className='w-max px-10 bg-ezGreen hover:bg-transparent hover:text-ezGreen border-ezGreen cursor-pointer text-white rounded-md py-3 text-center block border'
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
