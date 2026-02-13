import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function VehicleCard({ vehicle, setDelVehicle, handleUpdate }) {
  return (
    <div className='bg-white px-4 py-5 sm:px-6 rounded-md shadow-md'>
      <div className='flex items-start space-x-3'>
        <img
          src={
            vehicle?.picture ? vehicle?.picture : '/assets/images/carImg.jpg'
          }
          alt='Car Wheel'
          className='w-32 h-32 object-cover border border-ezGreen rounded-lg col-span-2 md:col-span-1'
        />
        <div className='col-span-3 md:col-span-4 w-full block'>
          <h3 className='text-ezBlack text-lg font-bold'>
            <span className='mr-2'> Make:</span> {vehicle?.make?.name}
          </h3>
          <p className='text-ezBlack text-sm mb-1'>
            <span className='mr-2'> Model:</span>
            {vehicle?.model?.model}
          </p>
          <p className='text-ezBlack text-sm mb-1'>
            <span className='mr-2'> Range:</span>
            {vehicle?.range}
          </p>
        </div>
        <div className='flex'>
          <Menu as='div' className='relative inline-block text-left'>
            <div>
              <Menu.Button className='-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600'>
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
              <Menu.Items className='absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  <button
                    onClick={() => handleUpdate(vehicle)}
                    type='button'
                    className='w-full text-left block text-xs text-ezGreen p-2 hover:bg-ezLightGreen'
                  >
                    Edit Vehicle
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      setDelVehicle({ isDelVehicle: true, vehicle })
                    }
                    className='w-full text-left block text-xs text-ezRed p-2 hover:bg-ezLightGreen '
                  >
                    Delete Vehicle
                  </button>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}
