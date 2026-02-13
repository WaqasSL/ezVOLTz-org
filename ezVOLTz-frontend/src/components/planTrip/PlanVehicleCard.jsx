import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';

const PlanVehicleCard = ({
  vehicle,
  setIsVehicleChange,
  setIsVehicleModal,
  setIsVehicleUpdate,
  userVehicles,
}) => {
  return (
    <>
      <img
        src={vehicle?.picture ? vehicle?.picture : '/assets/images/carImg.jpg'}
        alt='Car Wheel'
        className='w-full h-auto border border-ezGreen rounded-lg col-span-2'
      />
      <div className='col-span-4 w-full h-full flex flex-col justify-between relative'>
        <div className='ez__info'>
          <h3 className='text-ezBlack text-lg font-bold mb-2'>
            <span className='mr-2'> Make:</span>
            {vehicle?.make?.name}
          </h3>
          <p className='text-ezBlack text-xs block w-full mb-1'>
            <span className='mr-2'> Model:</span>
            {vehicle?.model?.model}
          </p>
          <p className='text-ezBlack text-xs block w-full mb-1'>
            <span className='mr-2'> Range:</span>
            {vehicle?.range}
          </p>
        </div>
        <div className='absolute top-0 right-0'>
          <Menu as='div' className='relative inline-block text-left'>
            <div>
              <Menu.Button className='flex items-center rounded-full text-ezBlack hover:text-ezGreen '>
                <BsThreeDotsVertical className='h-5 w-5' aria-hidden='true' />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute right-0 z-10 mt-2 w-max origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  <Menu.Button
                    type='button'
                    onClick={() => setIsVehicleModal(true)}
                    className='text-ezGray text-left hover:text-white hover:bg-ezGreen block w-full px-3 py-1 text-xs'
                  >
                    Add New Vehicle
                  </Menu.Button>
                  <Menu.Button
                    type='button'
                    onClick={() => setIsVehicleUpdate(true)}
                    className='text-ezGray text-left hover:text-white hover:bg-ezGreen block w-full px-3 py-1 text-xs'
                  >
                    Edit Vehicle
                  </Menu.Button>
                  {userVehicles?.length > 1 && (
                    <Menu.Button
                      type='button'
                      onClick={() => setIsVehicleChange(true)}
                      className='text-ezGray text-left hover:text-white hover:bg-ezGreen block w-full px-3 py-1 text-xs'
                    >
                      Change Vehicle
                    </Menu.Button>
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default PlanVehicleCard;
