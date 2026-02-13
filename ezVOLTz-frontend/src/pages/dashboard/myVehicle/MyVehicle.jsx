import { Fragment, useEffect, useState } from 'react';
import AddVehicle from 'modals/vehicles/AddVehicle';
import { useDispatch, useSelector } from 'react-redux';
import VehicleCard from 'components/myVehicle/VehicleCard';
import Spiner from 'helper/Spiner';
import DeleteVehicle from 'modals/vehicles/DeleteVehicle';
import UpdateVehicle from 'modals/vehicles/UpdateVehicle';
import { toggleIsVehicleApiCall } from 'redux/dashbbaord/dashboardSlice';
import useApiHook from 'hooks/useApiHook';
import { handleUserVehicles } from 'redux/auth/authSlice';
import PrimaryBtn from 'components/btns/PrimaryBtn';

const MyVehicle = () => {
  const { auth, dashboard } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { handleApiCall, isApiLoading } = useApiHook();
  const [isVehicleModal, setIsVehicleModal] = useState(false);
  const [isVehicleUpdate, setIsVehicleUpdate] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState(null);
  const [delVehicle, setDelVehicle] = useState({
    isDelVehicle: false,
    vehicle: null,
  });
  const [vehicles, setVehicles] = useState([]);

  const getMyVehicles = async (userInfo) => {
    const result = await handleApiCall({
      method: 'get',
      url: `/vehicle/${userInfo?.user?._id}`,
    });
    if (result.status === 200) {
      dispatch(handleUserVehicles(result?.data));
      setVehicles(result?.data);
      dispatch(toggleIsVehicleApiCall(false));
    }
  };

  const updateUserVehicles = async (vehicle) => {
    let updatedVehicles =
      vehicles?.map((item) => (item?._id === vehicle?._id ? vehicle : item)) ||
      [];
    dispatch(handleUserVehicles(updatedVehicles));
    setVehicles(updatedVehicles);
  };

  const handleUpdate = (vehicle) => {
    setIsVehicleUpdate(true);
    setEditedVehicle(vehicle);
  };

  useEffect(() => {
    if (!dashboard?.isVehicleApiCall && auth?.userInfo?.user?._id)
      getMyVehicles(auth?.userInfo);
  }, []);

  useEffect(() => {
    if (dashboard?.isVehicleApiCall && auth?.userInfo?.user?._id)
      getMyVehicles(auth?.userInfo);
  }, [dashboard?.isVehicleApiCall]);

  return (
    <div className='ez__MyVehicle w-full bg-ezMidWhite px-4 py-10 md:p-10'>
      <div className='ez__Title w-full flex md:items-center justify-between mb-8 flex-col md:flex-row'>
        <h3 className='text-ezBlack text-xl mb-3 md:mb-0'>My Vehicles</h3>

        <div className='ez__Tabs w-max flex items-center ml-auto'>
          <PrimaryBtn
            btnType='button'
            text='Add Vehicle'
            classNames='px-10 mb-0'
            handleEvent={() => setIsVehicleModal(!isVehicleModal)}
          />
        </div>
      </div>

      <div className='ez__VehicleList block w-full'>
        <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-12'>
          {isApiLoading ? (
            <div className='col-span-3 block w-full h-96'>
              <Spiner color='ezGreen' />
            </div>
          ) : vehicles?.length > 0 ? (
            vehicles?.map((vehicle) => (
              <Fragment key={vehicle._id}>
                <VehicleCard
                  vehicle={vehicle}
                  setDelVehicle={setDelVehicle}
                  handleUpdate={handleUpdate}
                />
              </Fragment>
            ))
          ) : (
            <div className='col-span-3 py-32 w-full flex items-center justify-center flex-col h-auto'>
              <img
                src='/assets/svgs/noVehicle.svg'
                alt='No Trip'
                className='w-32 md:w-56 h-auto mb-5'
              />
              <p className='text-ezGray text-sm md:text-base mb-5'>
                There is no vehicle
              </p>
            </div>
          )}
        </div>
      </div>
      <AddVehicle
        isVehicleModal={isVehicleModal}
        setIsVehicleModal={setIsVehicleModal}
        getMyVehicles={(vehicle) => {
          dispatch(handleUserVehicles([...vehicles, vehicle]));
          setVehicles([...vehicles, vehicle]);
        }}
      />
      {delVehicle && (
        <DeleteVehicle
          userInfo={auth?.userInfo}
          delVehicle={delVehicle}
          vehicles={vehicles}
          setVehicles={setVehicles}
          setDelVehicle={setDelVehicle}
          getMyVehicles={getMyVehicles}
        />
      )}
      {editedVehicle && isVehicleUpdate && (
        <UpdateVehicle
          editedVehicle={editedVehicle}
          isVehicleUpdate={isVehicleUpdate}
          setIsVehicleUpdate={setIsVehicleUpdate}
          getMyVehicles={updateUserVehicles}
        />
      )}
    </div>
  );
};

export default MyVehicle;
