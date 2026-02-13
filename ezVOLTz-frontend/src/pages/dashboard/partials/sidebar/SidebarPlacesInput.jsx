import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from 'react-google-autocomplete';
import { updateLocation } from 'redux/auth/authSlice';
import { handlSidebar } from 'redux/dashbbaord/dashboardSlice';

const SidebarPlacesInput = () => {
  const sideBarPlaceRef = useRef();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  useEffect(() => {
    sideBarPlaceRef.current.value = auth?.userLocation?.name || '';
  }, [auth?.userLocation]);

  return (
    <div className='ez__HeaderSearch w-full rounded-lg flex items-center bg-ezLightWhite py-3 px-4'>
      <Autocomplete
        apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        ref={sideBarPlaceRef}
        className='w-full block'
        onBlur={(place) => {
          if (!place?.target?.value) {
            dispatch(
              updateLocation({
                name: '',
                placeId: '',
                state: '',
                latitude: null,
                longitude: null,
              })
            );
            dispatch(handlSidebar(false));
          }
        }}
        onPlaceSelected={(place) => {
          let latitude = place.geometry.location.lat();
          let longitude = place.geometry.location.lng();
          dispatch(
            updateLocation({
              name: place?.formatted_address,
              placeId: place?.place_id,
              state: place?.address_components[2]?.short_name,
              latitude,
              longitude,
            })
          );
          dispatch(handlSidebar(false));
        }}
      />
    </div>
  );
};

export default SidebarPlacesInput;
