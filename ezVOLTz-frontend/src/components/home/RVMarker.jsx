import { InfoWindow, Marker } from '@react-google-maps/api';
import { useState } from 'react';

const RVMarker = ({ rv, getRVDetail }) => {
  const [showInfo, setshowInfo] = useState(false);
  return (
    <>
      <Marker
        icon={{
          url: '/assets/images/rvPin.png',
        }}
        onClick={() => getRVDetail(rv)}
        onMouseOver={() => setshowInfo(true)}
        onMouseOut={() => setshowInfo(false)}
        position={{
          lat: +rv?.latitude,
          lng: +rv?.longitude,
        }}
      >
        {showInfo && (
          <InfoWindow>
            <p className='text-ezBlack text-xs'>{rv?.name}</p>
          </InfoWindow>
        )}
      </Marker>
    </>
  );
};

export default RVMarker;
