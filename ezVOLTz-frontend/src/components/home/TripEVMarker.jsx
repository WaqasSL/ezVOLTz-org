import { InfoWindow, Marker } from '@react-google-maps/api';
import { useState } from 'react';

const TripEVMarker = ({ ev, isStop, addStop }) => {
  const [showInfo, setshowInfo] = useState(false);

  return (
    <>
      <Marker
        icon={{
          url: `${
            ev?.access_code === 'private'
              ? '/assets/images/evPrivate.png'
              : ev?.ev_level1_evse_num
              ? '/assets/images/levelOne.png'
              : ev?.ev_dc_fast_num
              ? '/assets/images/evFast.png'
              : ev?.ev_level2_evse_num
              ? '/assets/images/ev.png'
              : 'null'
          }`,
        }}
        onClick={() => setshowInfo(!showInfo)}
        position={{
          lat: +ev?.latitude,
          lng: +ev?.longitude,
        }}
      >
        {showInfo && (
          <InfoWindow>
            <div className='block w-full'>
              <p className='text-ezBlack text-xs capitalize mb-1'>
                <b>Name:</b> {ev?.station_name}
              </p>
              <p className='text-ezBlack text-xs capitalize mb-1'>
                <b>Type:</b> {ev?.access_code}
              </p>
              <p className='text-ezBlack text-xs capitalize mb-3'>
                <b>Address:</b> {ev?.street_address}
              </p>
              {isStop && (
                <button
                  type='button'
                  onClick={() => addStop()}
                  className='text-xs bg-ezGreen text-white rounded-md px-4 py-1 border-0 outline-none mb-2'
                >
                  Add As Way Point
                </button>
              )}
            </div>
          </InfoWindow>
        )}
      </Marker>
    </>
  );
};

export default TripEVMarker;
