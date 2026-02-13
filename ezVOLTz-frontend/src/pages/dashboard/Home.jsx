import GoogleMapWithPins from 'components/home/GoogleMapWithPins';
import HomeDirection from 'components/home/HomeDirection';
import InfoCard from 'components/home/InfoCard';
import RadiusCard from 'components/home/RadiusCard';
import EVDetailDrawer from 'drawer/EVDetailDrawer';
import RVDetailDrawer from 'drawer/RVDetailDrawer';
import SaasChargeDetailDrawer from 'drawer/SaasChargeDetailDrawer';
import Loader from 'helper/Loader';
import { initialFilters } from 'helper/functionality';
import useNrelApiHook from 'hooks/nrel/useNrelApiHook';
import useSaasChargeApiHook from 'hooks/saasCharge/useSaasChargeApiHook';
import HomeFilter from 'modals/homeFilter/HomeFilter';
import { useState, useEffect } from 'react';
import { BsFilter } from 'react-icons/bs';
import { MdOutlineGpsFixed } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { toggleLogin, updateLocation, updateUserLocation } from 'redux/auth/authSlice';
import { getGoogleDirections } from 'utls/apiCalls/googleApi';

const Home = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { handleSassApiCall, isSassLoading } = useSaasChargeApiHook();
  const { handleNrelApiCall, isNrelLoading } = useNrelApiHook();
  const [filterRadius, setFilterRadius] = useState(25);
  const [directionData, setDirectionData] = useState({
    destination: null,
    isDirectionView: false,
  });
  const [allEVs, setAllEVs] = useState(null);
  const [allRVs, setAllRVs] = useState([]);
  const [saasChargers, setSaasChargers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEVDetail, setIsEVDetail] = useState(false);
  const [isRVDetail, setIsRVDetail] = useState(false);
  const [isSassChargeDetail, setIsSassChargeDetail] = useState(false);
  const [isFilterModal, setIsFilterModal] = useState(false);
  const [evDetailData, setEVDetailData] = useState(null);
  const [rvDetailData, setRVDetailData] = useState(null);
  const [sassChargeDetailData, setSassChargeDetailData] = useState(null);
  const [formValues, setFormValues] = useState(initialFilters);
  const [googleProps, setGoogleProps] = useState({
    center: {
      lat: 36.158326888411864,
      lng: -118.49062127700921,
    },
    zoom: 10,
  });
  const [directions, setDirections] = useState(null);

  const getDirections = async (data) => {
    const results = await getGoogleDirections({
      userLocation: auth?.userLocation,
      data,
    });
    if (results?.isSuccess) {
      setDirections(results?.data);
      setDirectionData({
        destination: {
          ...data,
          latitude: data?.latitude,
          longitude: data?.longitude,
        },
        isDirectionView: true,
      });
      setIsRVDetail(false);
      setIsEVDetail(false);
      setIsSassChargeDetail(false);
      setRVDetailData(null);
      setEVDetailData(null);
      setSassChargeDetailData(null);
    }
  };

  const handleDirection = () => {
    setDirectionData({
      destination: null,
      isDirectionView: false,
    });
    setDirections(null);
    setIsRVDetail(false);
    setIsEVDetail(false);
    setIsSassChargeDetail(false);
    setRVDetailData(null);
    setEVDetailData(null);
    setSassChargeDetailData(null);
  };

  const getEVDetail = (data) => {
    setIsEVDetail(true);
    setEVDetailData(data);
  };

  const getRVDetail = (data) => {
    setIsRVDetail(true);
    setRVDetailData(data);
  };

  const getSassDetail = (data) => {
    setIsSassChargeDetail(true);
    setSassChargeDetailData(data);
  };

  const resetFilter = (values) => {
    if (
      values?.fuel !== initialFilters?.fuel ||
      values?.owner !== initialFilters?.owner ||
      values?.network !== initialFilters?.network ||
      values?.connector !== initialFilters?.connector ||
      values?.previousStation !== initialFilters?.previousStation ||
      values?.ev_dc_fast_num !== initialFilters?.ev_dc_fast_num ||
      values?.ev_level1_evse_num !== initialFilters?.ev_level1_evse_num ||
      values?.ev_level2_evse_num !== initialFilters?.ev_level2_evse_num ||
      values?.status !== initialFilters?.status
    ) {
      applyFilters(initialFilters);
      setFormValues(initialFilters);
    }
  };

  const applyFilters = (values) => {
    setIsFilterModal(false);
    let params = getAllParams();
    let evChargingLevel = [];
    if (
      values?.ev_level1_evse_num &&
      values?.ev_level2_evse_num &&
      values?.ev_dc_fast_num
    ) {
      evChargingLevel.push('all');
    } else {
      if (
        !values?.ev_level1_evse_num &&
        !values?.ev_level2_evse_num &&
        !values?.ev_dc_fast_num
      ) {
        evChargingLevel.push('legacy');
      } else {
        if (values?.ev_level1_evse_num) evChargingLevel.push(1);
        if (values?.ev_level2_evse_num) evChargingLevel.push(2);
        if (values?.ev_dc_fast_num) evChargingLevel.push('dc_fast');
      }
    }
    getAllEV({
      ...params,
      latitude: auth?.userLocation?.latitude || googleProps?.center?.lat,
      longitude: auth?.userLocation?.longitude || googleProps?.center?.lng,
      location: auth?.userLocation?.name || '',
      access: values?.previousStation ? 'all' : 'public',
      fuel_type: values?.fuel || formValues?.fuel,
      ev_network: values?.network || formValues?.network,
      ev_connector_type: values?.connector || formValues?.connector,
      owner_type: values?.owner || formValues?.owner,
      ev_charging_level: evChargingLevel?.join(', '),
    });
  };

  const applyRadiusFilters = (radius) => {
    setIsFilterModal(false);
    let params = getAllParams();
    getAllEV({
      ...params,
      latitude: auth?.userLocation?.latitude || googleProps?.center?.lat,
      longitude: auth?.userLocation?.longitude || googleProps?.center?.lng,
      location: auth?.userLocation?.name || '',
      radius,
    });
  };

  const getAllEV = async (params) => {
    const result = await handleNrelApiCall({
      method: 'get',
      url: '/alt-fuel-stations/v1/nearest.json',
      params: { ...params, limit: 'all' },
    });
    if (result.status === 200) {
      result?.data?.fuel_stations?.length <= 0 && toast.info('No EVs found!');
      setAllEVs(result?.data);
    }
  };

  const getUserCurrentLocation = () => {
    let params = getAllParams();
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      function (position) {
        if (!position.coords.latitude || !position.coords.longitude) {
          setIsLoading(false);
          handleDirection();
          getAllEV(params);
          return toast.error(
            'Geolocation is not enabled. Please enable to get your current location for this feature'
          );
        }
        dispatch(
          updateLocation({
            name: '',
            placeId: '',
            state: '',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        );
        setGoogleProps({
          ...googleProps,
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          zoom: 10,
        });
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        handleDirection();
        getAllEV(params);
        toast.error(
          'Geolocation is not enabled. Please enable to get your current location for this feature'
        );
        dispatch(updateUserLocation(null));
      }
    );
  };

  const getAllParams = () => {
    let evChargingLevel = [];
    if (
      formValues?.ev_level1_evse_num &&
      formValues?.ev_level2_evse_num &&
      formValues?.ev_dc_fast_num
    ) {
      evChargingLevel.push('all');
    } else {
      if (
        !formValues?.ev_level1_evse_num &&
        !formValues?.ev_level2_evse_num &&
        !formValues?.ev_dc_fast_num
      ) {
        evChargingLevel.push('legacy');
      } else {
        if (formValues?.ev_level1_evse_num) evChargingLevel.push(1);
        if (formValues?.ev_level2_evse_num) evChargingLevel.push(2);
        if (formValues?.ev_dc_fast_num) evChargingLevel.push('dc_fast');
      }
    }
    return {
      location: '',
      latitude: googleProps?.center?.lat || 36.158326888411864,
      longitude: googleProps?.center?.lng || -118.49062127700921,
      radius: filterRadius,
      offset: 0,
      limit: 100,
      access: formValues?.previousStation ? 'all' : 'public',
      status: formValues?.status ? 'E' : 'all',
      fuel_type: formValues?.fuel,
      ev_network: formValues?.network,
      ev_connector_type: formValues?.connector,
      owner_type: formValues?.owner,
      ev_charging_level: evChargingLevel?.join(', '),
    };
  };

  const getCSOData = async () => {
    const result = await handleSassApiCall({
      method: 'get',
      url: '/external/csoStation',
    });
    if (result?.status === 200) setSaasChargers(result?.data);
  };

  useEffect(() => {
    let params = getAllParams();
    if (auth?.userLocation?.latitude && auth?.userLocation?.longitude) {
      handleDirection();
      setGoogleProps({
        ...googleProps,
        center: {
          lat: auth?.userLocation?.latitude,
          lng: auth?.userLocation?.longitude,
        },
        zoom: 14,
      });
      getAllEV({
        ...params,
        latitude: auth?.userLocation?.latitude,
        longitude: auth?.userLocation?.longitude,
        location: auth?.userLocation?.name,
      });
      // getCSOData();
    } else {
      getUserCurrentLocation();
    }
  }, [auth?.userLocation]);
  
  useEffect(() => {
    if (!auth?.isLogin &&
      !auth?.userInfo?.accessToken
    ) {
      dispatch(
        toggleLogin({
          isLogin: true,
          userInfo: {
            user: {
              name: `Guest User`,
              isActive: false,
              role: 'guest',
            },
          },
        })
      );
      toast.success('Viewing as a guest.');
    }
  }, [auth?.isLogin]);

  return (
    <div className='ez__Home w-full h-full relative z-1'>
      {directionData?.isDirectionView ? (
        <HomeDirection
          handleDirection={handleDirection}
          directions={directions}
        />
      ) : (
        <>
          <button
            type='button'
            onClick={() => setIsFilterModal(!isFilterModal)}
            className='text-sm md:text-base absolute top-24 left-2 z-10 bg-ezGreen rounded-md text-white py-2 px-5 md:px-8 flex items-center'
          >
            <BsFilter className='w-5 h-5 mr-2' /> Filter
          </button>

          <div className='absolute top-14 md:top-10 w-8 h-8 md:w-12 md:h-12 right-3 md:right-14 z-10 bg-ezGreen  text-white rounded-full flex justify-center items-center'>
            <InfoCard />
          </div>
          <div className='absolute bottom-20 md:bottom-24 w-8 h-8 md:w-12 md:h-12 right-14 z-10 bg-ezGreen  text-white rounded-full flex justify-center items-center'>
            <RadiusCard
              filterRadius={filterRadius}
              setFilterRadius={setFilterRadius}
              applyRadiusFilters={applyRadiusFilters}
            />
          </div>
          <button
            type='button'
            onClick={getUserCurrentLocation}
            className='absolute bottom-10 w-8 h-8 md:w-12 md:h-12 right-14 z-10 bg-ezGreen  text-white rounded-full flex justify-center items-center'
          >
            <MdOutlineGpsFixed className='w-4 md:w-6 h-4 md:h-6' />
          </button>
        </>
      )}
      {googleProps?.center?.lat && googleProps?.center?.lng && (
        <>
          {isSassLoading || isNrelLoading || isLoading ? (
            <Loader background='transparency' />
          ) : null}
          <GoogleMapWithPins
            googleProps={googleProps}
            userCurrentLocation={auth?.userLocation}
            allRVs={allRVs}
            allEVs={allEVs}
            saasChargers={saasChargers}
            getEVDetail={getEVDetail}
            getRVDetail={getRVDetail}
            getSassDetail={getSassDetail}
            directionData={directionData}
            directions={directions}
            formValues={formValues}
          />
        </>
      )}
      {isFilterModal && (
        <HomeFilter
          formValues={formValues}
          setFormValues={setFormValues}
          isFilterModal={isFilterModal}
          setIsFilterModal={setIsFilterModal}
          applyFilters={applyFilters}
          resetFilter={resetFilter}
        />
      )}
      <EVDetailDrawer
        totalStations={allEVs?.fuel_stations?.length}
        availableStations={
          allEVs?.fuel_stations?.filter(
            (station) => station?.status_code === 'E'
          )?.length
        }
        evDetailData={evDetailData}
        setEVDetailData={setEVDetailData}
        isEVDetail={isEVDetail}
        setIsEVDetail={setIsEVDetail}
        handleDirection={handleDirection}
        getDirections={getDirections}
      />
      <RVDetailDrawer
        rvDetailData={rvDetailData}
        isRVDetail={isRVDetail}
        setIsRVDetail={setIsRVDetail}
        setRVDetailData={setRVDetailData}
        handleDirection={handleDirection}
        getDirections={getDirections}
      />
      <SaasChargeDetailDrawer
        sassChargeDetailData={sassChargeDetailData}
        isSassChargeDetail={isSassChargeDetail}
        handleDirection={handleDirection}
        getDirections={getDirections}
      />
    </div>
  );
};

export default Home;
