import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLocation } from 'redux/auth/authSlice';
import Autocomplete from 'react-google-autocomplete';
import { AiOutlineSearch } from 'react-icons/ai';

const HeaderPlacesInput = () => {
  const placeRef = useRef();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  useEffect(() => {
    placeRef.current.value = auth?.userLocation?.name || '';
  }, [auth?.userLocation]);

  return (
    <div className='ez__HeaderSearch max-w-sm w-full rounded-lg flex items-center bg-ezLightWhite py-3 px-4'>
      <Autocomplete
        apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        className='w-full block'
        ref={placeRef}
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
        }}
      />
      <button
        type='button'
        onClick={() =>
          dispatch(
            updateLocation({
              name: placeRef?.current?.value ? auth.currentLocation.name : '',
              placeId: '',
              state: '',
              latitude: null,
              longitude: null,
            })
          )
        }
        className='bg-transparent broder-0 focus:outline-none pl-2'
      >
        <AiOutlineSearch className='w-5 h-auto  text-ezGray' />
      </button>
    </div>
  );
};

export default HeaderPlacesInput;
