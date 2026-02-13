import { InfoWindow, Marker } from '@react-google-maps/api';
import { useState } from 'react';

const EVMarker = ({ ev, getEVDetail, formValues }) => {
  const [showInfo, setshowInfo] = useState(false);
  return (
    <>
      <Marker
        icon={{
          url: `${
            ev?.access_code === 'private'
              ? '/assets/images/evPrivate.png'
              : formValues?.ev_level1_evse_num && ev?.ev_level1_evse_num
              ? '/assets/images/levelOne.png'
              : formValues?.ev_dc_fast_num && ev?.ev_dc_fast_num
              ? '/assets/images/evFast.png'
              : formValues?.ev_level2_evse_num && ev?.ev_level2_evse_num
              ? '/assets/images/ev.png'
              : 'null'
          }`,
        }}
        onClick={() => getEVDetail(ev)}
        onMouseOver={() => setshowInfo(true)}
        onMouseOut={() => setshowInfo(false)}
        position={{
          lat: +ev?.latitude,
          lng: +ev?.longitude,
        }}
      >
        {showInfo && (
          <InfoWindow>
            <p className='text-ezBlack text-xs capitalize'>
              {ev?.station_name} - {ev?.access_code}
            </p>
          </InfoWindow>
        )}
      </Marker>
    </>
  );
};

export default EVMarker;
