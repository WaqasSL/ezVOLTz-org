import {
  DirectionsRenderer,
  GoogleMap,
  InfoWindow,
  Marker,
} from '@react-google-maps/api';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateLocation } from 'redux/auth/authSlice';
import EVMarker from './EVMarker';
import RVMarker from './RVMarker';
import SassChargeMarker from './SassChargeMarker';

const GoogleMapWithPins = ({
  directionData,
  googleProps,
  userCurrentLocation,
  allEVs,
  allRVs,
  getEVDetail,
  getRVDetail,
  directions,
  formValues,
  saasChargers,
  getSassDetail,
}) => {
  const homeRefMap = useRef(null);
  const dispatch = useDispatch();
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  return (
    <GoogleMap
      ref={homeRefMap}
      zoom={googleProps.zoom}
      center={googleProps.center}
      mapContainerStyle={{ width: '100%', height: '100%' }}
      options={{ minZoom: 4, maxZoom: 18 }}
    >
      {!directionData?.isDirectionView && (
        <Marker
          draggable={true}
          onMouseOver={() => setShowInfoWindow(true)}
          onMouseOut={() => setShowInfoWindow(false)}
          onDragEnd={(val) =>
            dispatch(
              updateLocation({
                name: '',
                placeId: '',
                state: '',
                latitude: val?.latLng.lat(),
                longitude: val?.latLng.lng(),
              })
            )
          }
          position={{
            lat: +userCurrentLocation?.latitude || +googleProps?.center?.lat,
            lng: +userCurrentLocation?.longitude || +googleProps?.center?.lng,
          }}
        >
          {showInfoWindow && (
            <InfoWindow>
              <h4>Your location</h4>
            </InfoWindow>
          )}
        </Marker>
      )}
      {!directionData?.isDirectionView &&
        allRVs?.length > 0 &&
        allRVs?.map((rv) => (
          <RVMarker
            key={`RVPointsKey${rv?.id}--${new Date().getTime()}`}
            rv={rv}
            getRVDetail={getRVDetail}
          />
        ))}
      {!directionData?.isDirectionView &&
        saasChargers?.data?.length > 0 &&
        saasChargers?.data?.map((saasCharge, ind) => (
          <SassChargeMarker
            key={`SassChargeMarkerKey${ind}--${new Date().getTime()}`}
            saasCharge={saasCharge}
            getSassDetail={getSassDetail}
          />
        ))}
      {!directionData?.isDirectionView &&
        allEVs?.fuel_stations?.length > 0 &&
        allEVs?.fuel_stations?.map((ev) => (
          <EVMarker
            key={`RVPointsKey${ev?.id}--${new Date().getTime()}`}
            getEVDetail={getEVDetail}
            formValues={formValues}
            ev={ev}
          />
        ))}
      {directionData?.isDirectionView && directions && (
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
    </GoogleMap>
  );
};

export default GoogleMapWithPins;
