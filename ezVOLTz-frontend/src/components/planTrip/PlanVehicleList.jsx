import { MdCancel } from 'react-icons/md';

const PlanVehicleList = ({
  vehicle,
  setVehicle,
  setFormValues,
  formValues,
  setIsVehicleChange,
  userVehicles,
}) => {
  return (
    <div className='block w-full col-span-6'>
      <div className='flex items-center justify-between'>
        <p className='text-ezBlack text-sm font-semibold mb-2'>
          Select Vehicle*
        </p>
        <button type='button' onClick={() => setIsVehicleChange(false)}>
          <MdCancel className='text-ezRed w-5 h-5' />
        </button>
      </div>
      {userVehicles?.map((vehicleInfo) => (
        <div key={vehicleInfo?._id} className='w-full mb-2 flex items-center'>
          <input
            id={vehicleInfo?._id}
            name='notification-method'
            type='radio'
            defaultChecked={vehicleInfo?._id === vehicle?._id}
            onChange={() => {
              setVehicle(vehicleInfo);
              setFormValues({
                ...formValues,
                vehicle: vehicleInfo,
              });
              setIsVehicleChange(false);
            }}
            className='cursor-pointer h-4 w-4 border-gray-300 text-ezGreen focus:ring-ezGreen'
          />
          <label
            htmlFor={vehicleInfo?._id}
            className='cursor-pointer ml-3 block text-sm font-medium text-gray-700'
          >
            {vehicleInfo?.make?.name} - {vehicleInfo?.model?.model}
          </label>
        </div>
      ))}
    </div>
  );
};

export default PlanVehicleList;
