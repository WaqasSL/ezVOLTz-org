import { InfoWindow, Marker } from '@react-google-maps/api';
import { useState } from 'react';

const SassChargeMarker = ({ saasCharge, getSassDetail }) => {
  const [showInfo, setshowInfo] = useState(false);

  return (
    <>
      <Marker
        icon={{
          url: '/assets/images/rv.png',
        }}
        onClick={() => getSassDetail(saasCharge)}
        onMouseOver={() => setshowInfo(true)}
        onMouseOut={() => setshowInfo(false)}
        position={{
          lng: +saasCharge?.stationAddress?.gps?.split(', ')[0],
          lat: +saasCharge?.stationAddress?.gps?.split(', ')[1],
        }}
      >
        {showInfo && (
          <InfoWindow>
            <p className='text-ezBlack text-xs'>{saasCharge?.stationName}</p>
          </InfoWindow>
        )}
      </Marker>
    </>
  );
};

export default SassChargeMarker;
