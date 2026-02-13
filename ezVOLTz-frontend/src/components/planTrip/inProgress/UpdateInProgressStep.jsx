import { GoogleMap, DirectionsRenderer, Circle } from '@react-google-maps/api';
import {
  clockSvg,
  dollorSvg,
  energySvg,
  milesSvg,
  speedSvg,
} from 'helper/helper';
import { useEffect, useState } from 'react';
import Spiner from 'helper/Spiner';
import { toast } from 'react-toastify';
import { BsInfoLg } from 'react-icons/bs';
import TripEVMarker from 'components/home/TripEVMarker';
import { instanceNREL } from 'utls/instances';
import useHaloRange from 'hooks/useHaloRange';

const UpdateInProgressStep = ({
  formValues,
  setFormValues,
  directions,
  updateTrip,
  tripLoading,
}) => {
  const { halos, calculateHaloRange, loading } = useHaloRange();
  const [isLoading, setIsLoading] = useState(false);
  const [allEVs, setAllEVs] = useState(null);

  const getAllEV = async ({ lineString, retryTime = 0 }) => {
    if (retryTime > 1) return;
    setIsLoading(true);
    try {
      let url = `alt-fuel-stations/v1/nearby-route.json?route=LINESTRING(${lineString})&ev_network=${
        formValues?.network
      }&ev_connector_type=${formValues?.connectorType}&status=${
        formValues?.chargersType === 'availableChargers' ? 'E' : 'all'
      }&distance=1`;
      const result = await instanceNREL.get(url);
      if (result.status === 200) {
        setAllEVs(result?.data);
        setIsLoading(false);
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
        return getAllEV({ lineString, retryTime: retryTime + 1 });
      }
      toast.error('No pins found against this route.');
    }
  };

  useEffect(() => {
    let lineString = directions.routes[0].overview_path
      ?.map((point) => {
        return `${point.lng()} ${point.lat()}`;
      })
      ?.join(', ');
    getAllEV({ lineString, retryTime: 0 });
    calculateHaloRange(
      directions.routes[0],
      formValues?.vehicle?.range || formValues?.vehicle?.model?.range
    );
  }, []);

  return (
    <div className='bg-white w-full py-6 px-4 md:px-12'>
      <div className='w-full mapDirectionHeight block mb-5 rounded-md border-2 border-ezGreen overflow-hidden mapOuterDiv'>
        {!directions ? (
          <Spiner color='ezGreen' />
        ) : (
          <GoogleMap
            zoom={12}
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
            {!loading &&
              halos?.map((circle, index) => (
                <Circle
                  key={index}
                  radius={25000}
                  visible
                  options={{
                    strokeOpacity: 1,
                    strokeColor: '#228B22',
                    strokeWeight: 2,
                  }}
                  center={{ lat: circle.lat, lng: circle.lng }}
                />
              ))}
            {allEVs?.fuel_stations?.length > 0 &&
              allEVs?.fuel_stations?.map((ev) => (
                <TripEVMarker
                  key={`EVPointsKey${ev?.id}--${new Date().getTime()}`}
                  ev={ev}
                  isStop={true}
                  addStop={() =>
                    setFormValues({
                      ...formValues,
                      inBetween: [
                        ...formValues?.inBetween?.filter(
                          (between) =>
                            between.value !==
                            `${ev?.street_address} ${ev?.city} ${ev?.state} ${ev?.country}`
                        ),
                        {
                          id: new Date().toISOString(),
                          value: `${ev?.street_address} ${ev?.city} ${ev?.state} ${ev?.country}`,
                          type: 'waypoint',
                        },
                      ],
                    })
                  }
                />
              ))}
          </GoogleMap>
        )}
      </div>
      <div className='flex flex-wrap relative items-center justify-between border-t border-b py-4 border-ezLightGray my-10'>
        <div className='absolute -top-6 right-0'>
          <div className='w-max group relative '>
            <button className='text-white bg-ezGreen focus:outline-none  font-medium flex items-center justify-center text-xs w-5 h-5 rounded-full'>
              <BsInfoLg />
            </button>
            <span className='absolute w-72 bottom-full right-0 scale-0 transition-all rounded bg-ezGreen p-2 text-xs text-white group-hover:scale-100'>
              These calculations are based on past user data. Factors such as
              weather, speed, traffic, and jurisdictional charges impact our
              estimates.
            </span>
          </div>
        </div>
        <p className='flex items-center text-sm text-ezBlack mb-2 sm:mb-0'>
          <span className='text-ezGreen block mr-3'>{milesSvg}</span>{' '}
          {directions && formValues?.distance}
        </p>
        <p className='flex items-center text-sm text-ezBlack mb-2 sm:mb-0'>
          <span className='text-ezGreen block mr-3'>{clockSvg}</span>{' '}
          {directions && formValues?.time}
        </p>
        <p className='flex items-center text-sm text-ezBlack mb-2 sm:mb-0'>
          <span className='text-ezGreen block mr-3'>{speedSvg}</span>{' '}
          {directions && formValues?.speed}
        </p>
        <p className='flex items-center text-sm text-ezBlack mb-2 sm:mb-0'>
          <span className='text-ezGreen block mr-3'>{energySvg}</span>{' '}
          {directions && formValues?.energy}
        </p>
        <p className='flex items-center text-sm text-ezBlack mb-2 sm:mb-0'>
          <span className='text-ezGreen block mr-3'>{dollorSvg}</span>{' '}
          {directions && formValues?.cost}
        </p>
        <p className='flex items-center text-sm text-ezBlack mb-2 sm:mb-0'>
          <span className='rounded-full block mr-3 w-5 h-5 border-2 border-ezGreen bg-ezGreen bg-opacity-50' />
          Range Halo
        </p>
      </div>
      <div className='max-w-sm mx-auto flex justify-center px-14'>
        <button
          type='button'
          disabled={isLoading || tripLoading}
          onClick={updateTrip}
          className={`${
            isLoading || tripLoading
              ? 'cursor-not-allowed py-3 hover:bg-ezGreen'
              : 'cursor-pointer py-4'
          } bg-ezGreen text-white rounded-md w-full text-center block border border-ezGreen hover:bg-transparent hover:text-ezGreen`}
        >
          {isLoading || tripLoading ? <Spiner color='white' /> : 'Update'}
        </button>
      </div>
    </div>
  );
};

export default UpdateInProgressStep;
