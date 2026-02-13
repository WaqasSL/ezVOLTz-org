import { colourStyles } from 'helper/helper';
import { evConnectorTypes, evNetworkTypes } from 'helper/nrelData';
import Select from 'react-select';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { handleUserVehicles } from 'redux/auth/authSlice';
import { useDispatch } from 'react-redux';
import AddVehicle from 'modals/vehicles/AddVehicle';
import Spiner from 'helper/Spiner';
import useApiHook from 'hooks/useApiHook';
import GrayBtn from 'components/btns/GrayBtn';
import PlanVehicleCard from '../PlanVehicleCard';
import PlanVehicleList from '../PlanVehicleList';
import UpdateVehicle from 'modals/vehicles/UpdateVehicle';

const UpdateTripStep2 = ({
  previousStep,
  formValues,
  setFormValues,
  setSteps,
  userInfo,
  directions,
  setPreviousStep,
}) => {
  const dispatch = useDispatch();
  const { handleApiCall, isApiLoading } = useApiHook();
  const [vehicle, setVehicle] = useState(formValues?.vehicle || null);
  const [userVehicle, setUserVehicle] = useState([]);
  const [isVehicleChange, setIsVehicleChange] = useState(false);
  const [isVehicleModal, setIsVehicleModal] = useState(false);
  const [isVehicleUpdate, setIsVehicleUpdate] = useState(false);

  const valid = () => {
    if (
      formValues?.connectorType &&
      formValues?.network &&
      formValues?.vehicle &&
      formValues?.chargersType
    ) {
      return true;
    }
    return false;
  };

  const getUserVehicles = async () => {
    const result = await handleApiCall({
      method: 'get',
      url: `/vehicle/${userInfo?.user?._id}`,
    });
    if (result.status === 200) {
      dispatch(handleUserVehicles(result?.data));
      setUserVehicle(result?.data);
      setVehicle(vehicle || result?.data[0]);
      setFormValues({
        ...formValues,
        vehicle: vehicle || result?.data[0],
      });
    }
  };

  const addUserVehicles = async (vehicle) => {
    dispatch(handleUserVehicles([...userVehicle, vehicle]));
    setUserVehicle([...userVehicle, vehicle]);
    setVehicle(vehicle);
    setFormValues({
      ...formValues,
      vehicle,
    });
  };

  const updateUserVehicles = async (vehicle) => {
    let updatedVehicles =
      userVehicle?.map((item) =>
        item?._id === vehicle?._id ? vehicle : item
      ) || [];
    dispatch(handleUserVehicles(updatedVehicles));
    setUserVehicle(updatedVehicles);
    setVehicle(vehicle);
    setFormValues({
      ...formValues,
      vehicle,
    });
  };

  const handleStep = () => {
    let costMin = formValues?.network === 'Tesla' ? 0.4 : 0.2;
    let costMax = formValues?.network === 'Tesla' ? 0.5 : 0.3;
    let distance = 0;
    directions?.routes[0]?.legs?.map((leg) => {
      distance += leg?.distance?.value;
    });
    setFormValues({
      ...formValues,
      energy: `${Math.round(
        (formValues?.vehicle?.model?.batteryCapacity /
          formValues?.vehicle?.range) *
          (distance / 1000)
      )} kWh`,
      cost: `$${Math.round(
        (formValues?.vehicle?.model?.batteryCapacity /
          formValues?.vehicle?.range) *
          (distance / 1000) *
          costMin
      )} to $${Math.round(
        (formValues?.vehicle?.model?.batteryCapacity /
          formValues?.vehicle?.range) *
          (distance / 1000) *
          costMax
      )} EST`,
    });
    setPreviousStep(2);
    setSteps(3);
  };

  useEffect(() => {
    if (userInfo) getUserVehicles(userInfo?.user?._id);
  }, []);

  return (
    <>
      <div className='bg-white w-full py-6 px-4 md:px-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-5'>
          <div className='ez__StepImg w-full hidden md:block'>
            <img
              src='/assets/images/carImg.jpg'
              alt='Car Wheel'
              className='w-full h-80 object-cover md:h-auto border border-ezGreen rounded-lg'
            />
          </div>
          <div className='ez__StepForm w-full'>
            <div className='ez__CarInfo grid grid-cols-6 items-center gap-4 mb-7'>
              {vehicle ? (
                <>
                  {isVehicleChange ? (
                    <PlanVehicleList
                      vehicle={vehicle}
                      setVehicle={setVehicle}
                      setIsVehicleChange={setIsVehicleChange}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      userVehicles={userVehicle}
                    />
                  ) : (
                    <PlanVehicleCard
                      vehicle={vehicle}
                      setIsVehicleChange={setIsVehicleChange}
                      setIsVehicleModal={setIsVehicleModal}
                      setIsVehicleUpdate={setIsVehicleUpdate}
                      userVehicles={userVehicle}
                    />
                  )}
                </>
              ) : isApiLoading ? (
                <div className='col-span-6 rounded-md text-ezGreen font-semibold w-full border border-ezGreen flex items-center justify-center h-20'>
                  <Spiner className='ezGreen' />
                </div>
              ) : (
                <button
                  onClick={() => setIsVehicleModal(true)}
                  className='col-span-6 rounded-md text-ezGreen font-semibold w-full border border-ezGreen flex items-center justify-center h-20'
                >
                  Add Vehicle
                </button>
              )}
            </div>
            <div className='ez__FilterCard'>
              <h6 className='text-ezBlack text-base mb-3'>Filters</h6>
              <ul className='mb-6'>
                <li className='text-ezGray text-base flex items-center'>
                  <input
                    type='checkbox'
                    name='chargres'
                    id='allChargers'
                    value='allChargers'
                    checked={
                      formValues?.chargersType === 'availableChargers'
                        ? true
                        : false
                    }
                    className='w-4 h-4'
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        chargersType: e?.target?.checked
                          ? 'availableChargers'
                          : 'allChargers',
                      })
                    }
                  />
                  <label htmlFor='allChargers' className='cursor-pointer ml-2'>
                    Available Chargers
                  </label>
                </li>
                <li className='text-ezGray text-sm flex items-center mt-2'>
                  <input
                    type='checkbox'
                    name='compatible'
                    id='compatible'
                    value='compatible'
                    checked={formValues?.compatible}
                    className='w-4 h-4'
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        compatible: e?.target?.checked,
                      })
                    }
                  />
                  <label htmlFor='compatible' className='cursor-pointer ml-2'>
                    Compatible with my vehicle
                  </label>
                </li>
              </ul>
              <div className='block relative w-full'>
                <label
                  htmlFor='network'
                  className='block mb-2 text-sm text-ezBlack'
                >
                  Network Type*
                </label>
                <div className='relative w-full text-sm sm:text-base text-ezGray'>
                  <label
                    htmlFor='network'
                    className='absolute right-3 top-4 cursor-pointer'
                  >
                    <MdOutlineKeyboardArrowDown className='w-7 h-7' />
                  </label>
                  <Select
                    className='basic-single mb-4'
                    classNamePrefix='select'
                    placeholder='Select Network*'
                    isSearchable={true}
                    styles={colourStyles}
                    name='network'
                    value={
                      formValues?.network && {
                        label: evNetworkTypes?.filter(
                          (network) =>
                            network?.value?.trim() === formValues.network
                        )[0]?.title,
                        value: formValues?.network,
                      }
                    }
                    onChange={(e) =>
                      setFormValues({ ...formValues, network: e?.value })
                    }
                    options={evNetworkTypes?.map((network) => {
                      return {
                        label: network?.title,
                        value: network?.value,
                      };
                    })}
                  />
                </div>
              </div>
              <div className='block relative w-full'>
                <label
                  htmlFor='connectorType'
                  className='block mb-2 text-sm text-ezBlack'
                >
                  Connector Type*
                </label>
                <div className='relative w-full text-sm sm:text-base text-ezGray'>
                  <label
                    htmlFor='connectorType'
                    className='absolute right-3 top-4 cursor-pointer'
                  >
                    <MdOutlineKeyboardArrowDown className='w-7 h-7' />
                  </label>
                  <Select
                    className='basic-single mb-4'
                    classNamePrefix='select'
                    placeholder='Select Connector*'
                    isSearchable={true}
                    styles={colourStyles}
                    name='connectorType'
                    value={
                      formValues?.connectorType && {
                        label: evConnectorTypes?.filter(
                          (connectorType) =>
                            connectorType?.value === formValues.connectorType
                        )[0]?.title,
                        value: formValues?.connectorType,
                      }
                    }
                    onChange={(e) =>
                      setFormValues({ ...formValues, connectorType: e?.value })
                    }
                    options={evConnectorTypes?.map((connectorType) => {
                      return {
                        label: connectorType?.title,
                        value: connectorType?.value,
                      };
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-14'>
          <button
            type='button'
            onClick={() => {
              setPreviousStep(1);
              setSteps(previousStep || 1);
            }}
            className='border border-ezGreen bg-transparent text-ezGreen rounded-md py-4 w-full text-center block hover:bg-ezGreen hover:text-white'
          >
            Back
          </button>

          <GrayBtn
            btnType='button'
            handleEvent={handleStep}
            isDisabled={!valid()}
            classNameCondition={valid() === true}
            text='Next Step'
          />
        </div>
      </div>
      <AddVehicle
        isVehicleModal={isVehicleModal}
        setIsVehicleModal={setIsVehicleModal}
        getMyVehicles={addUserVehicles}
      />
      {isVehicleUpdate && (
        <UpdateVehicle
          editedVehicle={vehicle}
          isVehicleUpdate={isVehicleUpdate}
          setIsVehicleUpdate={setIsVehicleUpdate}
          getMyVehicles={updateUserVehicles}
        />
      )}
    </>
  );
};

export default UpdateTripStep2;
