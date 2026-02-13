import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { BiCurrentLocation, BiTime } from 'react-icons/bi';
import { BsArrowDownUp } from 'react-icons/bs';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { Autocomplete } from '@react-google-maps/api';
import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { allStopsEqual, secondsToDHMS } from 'helper/functionality';
import Spiner from 'helper/Spiner';
import 'react-datepicker/dist/react-datepicker.css';
import Geocode from 'react-geocode';
import UpdateStopInput from './UpdateStopInput';

const UpdateTripStep1 = ({
  formValues,
  setFormValues,
  setSteps,
  directions,
  setDirections,
  setTripDirections,
  setPreviousStep,
}) => {
  const originRef = useRef();
  const destinationRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const handleStop = () => {
    let data = {
      id: `${new Date().toISOString()}${formValues?.inBetween?.length}`,
      value: '',
      type: 'stop',
    };
    setFormValues({
      ...formValues,
      inBetween: [...formValues?.inBetween, data],
    });
  };

  const handleBetween = (betweenId, value) => {
    let data = formValues?.inBetween?.map((between) => {
      if (between?.id === betweenId) {
        return {
          ...between,
          value,
        };
      }
      return between;
    });
    setFormValues({ ...formValues, inBetween: data });
  };

  const valid = () => {
    if (formValues?.startFrom && formValues?.destination) {
      return true;
    }
    return false;
  };

  const getDirections = async ({ origin, destination, step, previousStep }) => {
    if (origin === destination)
      return toast.error('Trip origin and destination can not be same.');
    if (
      formValues?.inBetween?.length > 0 &&
      (formValues?.inBetween?.every((stop) => stop?.value === origin) ||
        formValues?.inBetween?.every((stop) => stop?.value === destination))
    )
      return toast.error('Trip origin,stops and destination can not be same.');
    if (formValues.inBetween?.length > 1 && allStopsEqual(formValues.inBetween))
      return toast.error('All stops can not be same.');
    setIsLoading(true);
    try {
      const stops = [];
      formValues?.inBetween?.map((stop) => {
        if (stop?.value) stops.push(stop);
      });
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin,
        destination,
        waypoints: stops?.map((stop) => ({
          location: stop?.value,
          stopover: true,
        })),
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: formValues?.avoidHighways || false,
        avoidTolls: formValues?.avoidTolls || false,
        durationInTraffic: formValues?.avoidTraffic || false,
      });
      let duration = 0;
      let distance = 0;
      results?.routes[0]?.legs?.map((leg) => {
        duration += leg?.duration?.value;
      });
      results?.routes[0]?.legs?.map((leg) => {
        distance += leg?.distance?.value;
      });
      setFormValues({
        ...formValues,
        distance: `${Math.round(distance * 0.000621371192)} miles`,
        time: secondsToDHMS(duration),
        inBetween: stops,
        speed: `${Math.round(
          (distance * 0.000621371192) / (duration / 3600)
        )} mph`,
      });
      setDirections(results);
      setTripDirections(results);
      setIsLoading(false);
      setSteps(step || 2);
      setPreviousStep(previousStep || 1);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        'No route found against these points. Please enter the valid points!'
      );
    }
  };

  const getUserCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        if (!position.coords.latitude || !position.coords.longitude) {
          return toast.error(
            'Geolocation is not enabled. Please enable to get your current location for this feature'
          );
        }
        Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
        Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then(
          (response) => {
            setFormValues({
              ...formValues,
              startFrom: response.results[0].formatted_address,
            });
            originRef.current.value = response.results[0].formatted_address;
          },
          (error) => {
            console.error(error);
          }
        );
      },
      (error) =>
        toast.error(
          'Geolocation is not enabled. Please enable to get your current location for this feature'
        )
    );
  };

  useEffect(() => {
    if (formValues?.startFrom) originRef.current.value = formValues?.startFrom;
    if (formValues?.destination)
      destinationRef.current.value = formValues?.destination;
  }, []);

  return (
    <div className='bg-white w-full py-6 px-4 md:px-12'>
      <div className='grid grid-cols-1 md:grid-cols-11 gap-6 md:gap-0'>
        <div className='hidden md:block ez__StepImg w-full col-span-5 p-2 border-2 border-ezGreen rounded-md'>
          <img
            src='/assets/images/carImg.jpg'
            alt='Car Wheel'
            className='w-full h-80 object-cover  md:h-full  rounded-lg'
          />
        </div>
        <div className='hidden md:block w-px h-full bg-ezLightGray mx-auto' />
        <div className='ez__StepForm w-full col-span-5'>
          <Autocomplete
            onPlaceChanged={() =>
              setFormValues({
                ...formValues,
                startFrom: originRef?.current?.value,
              })
            }
          >
            <div className='ez__FormInput w-full flex items-center justify-between border border-ezGreen rounded-md p-3 mb-1'>
              <input
                type='text'
                id='startingPoint'
                placeholder='From*'
                className='text-base text-ezGray'
                ref={originRef}
                // value={formValues.startFrom}
              />
              <button
                type='button'
                onClick={getUserCurrentLocation}
                className='text-ezGreen text-2xl cursor-pointer'
              >
                <BiCurrentLocation />
              </button>
            </div>
          </Autocomplete>
          <button
            onClick={handleStop}
            className='ez__AddStop block w-full text-right text-xs text-ezGreen mb-4'
            type='button'
          >
            + Add Stop
          </button>
          {formValues?.inBetween?.length > 0 &&
            formValues?.inBetween?.map((between, index) => (
              <Fragment key={between?.id}>
                <UpdateStopInput
                  index={index}
                  between={between}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  handleBetween={handleBetween}
                  goToLastStep={getDirections}
                />
              </Fragment>
            ))}
          <div className='flex justify-center  my-4'>
            <button
              onClick={() => {
                setFormValues({
                  ...formValues,
                  startFrom: formValues?.destination,
                  destination: formValues?.startFrom,
                });
                originRef.current.value = formValues?.destination;
                destinationRef.current.value = formValues?.startFrom;
              }}
              className='text-ezGray bg-transparent border-0'
            >
              <BsArrowDownUp className='w-5 h-5' />
            </button>
          </div>
          <Autocomplete
            onPlaceChanged={() =>
              setFormValues({
                ...formValues,
                destination: destinationRef?.current?.value,
              })
            }
          >
            <div className='mb-4 ez__FormInput w-full flex items-center justify-between border border-ezGreen rounded-md p-3'>
              <input
                type='text'
                id='startingPoint'
                placeholder='To*'
                className='text-base text-ezGray'
                ref={destinationRef}
              />
              <label
                htmlFor='startingPoint'
                className='text-ezGreen text-2xl cursor-pointer'
              >
                <AiOutlineSearch />
              </label>
            </div>
          </Autocomplete>
          <div className='ez__FormInput w-full flex items-center justify-between border border-ezGreen rounded-md p-3 mb-4'>
            <DatePicker
              selected={formValues?.startDate}
              id='startDate'
              placeholderText='Select a start date'
              minDate={new Date()}
              onChange={(date) =>
                formValues?.startTime
                  ? setFormValues({
                      ...formValues,
                      startDate: date,
                      startTime: new Date(
                        new Date(
                          new Date(date).setHours(
                            new Date(formValues?.startTime)?.getHours()
                          )
                        ).setMinutes(
                          new Date(formValues?.startTime)?.getMinutes()
                        )
                      ),
                    })
                  : setFormValues({
                      ...formValues,
                      startDate: date,
                    })
              }
            />
            <label
              htmlFor='startDate'
              className='text-ezGreen text-2xl cursor-pointer'
            >
              <FaRegCalendarAlt />
            </label>
          </div>
          <div className='ez__FormInput w-full flex items-center justify-between border border-ezGreen rounded-md p-3 mb-5'>
            <DatePicker
              selected={formValues?.startTime}
              placeholderText='Select a start time'
              onChange={(time) =>
                formValues?.startDate
                  ? setFormValues({ ...formValues, startTime: time })
                  : setFormValues({
                      ...formValues,
                      startTime: time,
                      startDate: new Date().setDate(
                        new Date(time).getDate() + 1
                      ),
                    })
              }
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={5}
              timeCaption='Time'
              dateFormat='h:mm aa'
              id='startTime'
            />
            <label
              htmlFor='startTime'
              className='text-ezGreen text-2xl cursor-pointer'
            >
              <BiTime />
            </label>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mb-5'>
            <div className='block w-full'>
              <h6 className='text-sm text-ezGreen flex items-center mb-3'>
                More Options <MdOutlineArrowForwardIos className='ml-1 h-3' />
              </h6>
              <ul>
                <li className='text-ezGray flex items-center mb-2 text-sm'>
                  <input
                    type='checkbox'
                    className='w-4 h-4  border-2 border-ezGray mr-2'
                    id='avoidTolls'
                    checked={formValues?.avoidTolls}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        avoidTolls: e?.target?.checked,
                      })
                    }
                  />
                  <label htmlFor='avoidTolls' className='cursor-pointer'>
                    Avoid Tolls
                  </label>
                </li>
                <li className='text-ezGray flex items-center mb-2 text-sm'>
                  <input
                    type='checkbox'
                    className='w-4 h-4  border-2 border-ezGray mr-2'
                    id='avoidHighways'
                    checked={formValues?.avoidHighways}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        avoidHighways: e?.target?.checked,
                      })
                    }
                  />
                  <label htmlFor='avoidHighways' className='cursor-pointer'>
                    Avoid Highways
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <button
            type='button'
            onClick={() =>
              getDirections({
                origin: formValues?.startFrom,
                destination: formValues?.destination,
              })
            }
            disabled={!valid() && !isLoading}
            className={`${
              valid() === true && !isLoading
                ? 'bg-ezGreen hover:bg-transparent hover:text-ezGreen border-ezGreen cursor-pointer'
                : 'bg-ezLightGray border-ezLightGray cursor-not-allowed	'
            }  text-white rounded-md py-4 w-full text-center block border `}
          >
            {isLoading ? <Spiner color='white' /> : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTripStep1;
