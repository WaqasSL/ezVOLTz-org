import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  handlPlanTripModal,
  toggleIsPlanApiCall,
} from 'redux/dashbbaord/dashboardSlice';
import PlanTripSteps1 from 'components/planTrip/PlanTripSteps1';
import PlanTripSteps2 from 'components/planTrip/PlanTripSteps2';
import PlanTripSteps3 from 'components/planTrip/PlanTripSteps3';
import { tick } from 'helper/helper';
import { MdCancel } from 'react-icons/md';
import { useJsApiLoader } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { initialValues } from 'helper/functionality';
import useApiHook from 'hooks/useApiHook';
import { toast } from 'react-toastify';
import Loader from 'helper/Loader';

export default function PlanTrip() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleApiCall, isApiLoading } = useApiHook();
  const { auth, dashboard } = useSelector((state) => state);
  const cancelButtonRef = useRef(null);
  const [steps, setSteps] = useState(1);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [tripDirections, setTripDirections] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });
  const [directions, setDirections] = useState(null);

  const addTrip = async () => {
    let startTime = null;
    if (formValues?.startDate && formValues.startTime) {
      let setStartTime = new Date(formValues.startTime);
      setStartTime.setMonth(new Date(formValues.startDate)?.getMonth());
      setStartTime.setFullYear(new Date(formValues.startDate)?.getFullYear());
      setStartTime.setDate(new Date(formValues.startDate)?.getDate());
      startTime = new Date(setStartTime);
    }
    let data = {
      origin: {
        text: formValues.startFrom,
        latitude: tripDirections?.routes[0]?.legs[0]?.start_location?.lat(),
        longitude: tripDirections?.routes[0]?.legs[0]?.start_location?.lng(),
      },
      destination: {
        text: formValues.destination,
        latitude:
          tripDirections?.routes[0]?.legs[
            tripDirections?.routes[0]?.legs?.length - 1
          ]?.end_location?.lat(),
        longitude:
          tripDirections?.routes[0]?.legs[
            tripDirections?.routes[0]?.legs?.length - 1
          ]?.end_location?.lng(),
      },
      stops: formValues.inBetween?.map((stop) => ({
        name: stop?.value,
        type: stop?.type,
      })),
      startDate: formValues.startDate
        ? formValues.startDate >= new Date()
          ? new Date(formValues.startDate)
          : new Date()
        : null,
      startTime: startTime
        ? startTime >= new Date()
          ? startTime
          : new Date()
        : null,
      chargersType: formValues.chargersType,
      connector: formValues.connectorType,
      network: formValues.network,
      distance: formValues.distance,
      time: formValues.time,
      speed: formValues.speed,
      energy: formValues.energy,
      cost: formValues.cost,
      vehicleId: formValues.vehicle?._id,
      avoidTolls: formValues.avoidTolls,
      avoidTraffic: formValues.avoidTraffic,
      avoidHighways: formValues.avoidHighways,
      hotels: formValues.hotels,
      restaurants: formValues.restaurants,
      campGround: formValues.campGround,
    };

    const result = await handleApiCall({
      method: 'post',
      url: `/trip/${auth?.userInfo?.user?._id}`,
      data,
    });
    if (result?.status === 201) {
      toast.success('Your trip has been created.');
      setFormValues(initialValues);
      setStepCompleted(true);
    }
  };

  const handlDone = () => {
    dispatch(handlPlanTripModal(false));
    dispatch(toggleIsPlanApiCall(true));
    setSteps(1);
    setStepCompleted(false);
    navigate('/my-trips');
  };

  if (!isLoaded) return <Loader />;

  return (
    <Transition.Root show={dashboard?.isPlanModal || false} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={() => dispatch(handlPlanTripModal(true))}
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
                      <div className='ez__PlanTripHead w-full bg-ezGreen p-4 md:px-6 flex items-center justify-between'>
                        <p className='text-white'>Plan a Trip: Step {steps}</p>{' '}
                        <button
                          type='button'
                          onClick={() => {
                            dispatch(handlPlanTripModal(false));
                            setStepCompleted(false);
                            setFormValues(initialValues);
                            setSteps(1);
                          }}
                          className='bg-white text-ezGreen rounded-full block w-max'
                        >
                          <MdCancel className='w-8 h-8' />
                        </button>
                      </div>
                      {+steps === 1 ? (
                        <PlanTripSteps1
                          setSteps={setSteps}
                          formValues={formValues}
                          setFormValues={setFormValues}
                          directions={directions}
                          setDirections={setDirections}
                          setTripDirections={setTripDirections}
                        />
                      ) : +steps === 2 ? (
                        <PlanTripSteps2
                          userVehicles={auth?.userVehicles}
                          setSteps={setSteps}
                          formValues={formValues}
                          setFormValues={setFormValues}
                          directions={directions}
                          userInfo={auth?.userInfo}
                        />
                      ) : +steps === 3 ? (
                        <PlanTripSteps3
                          setSteps={setSteps}
                          formValues={formValues}
                          directions={directions}
                          setFormValues={setFormValues}
                          tripDirections={tripDirections}
                          tripLoading={isApiLoading}
                          addTrip={addTrip}
                        />
                      ) : null}
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
                            setSteps(1);
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
                          Your trip has been created
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
