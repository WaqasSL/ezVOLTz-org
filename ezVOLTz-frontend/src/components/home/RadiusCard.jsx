import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { AiOutlineSetting } from 'react-icons/ai';
import { radiusData } from 'helper/helper';

export default function RadiusCard({
  filterRadius,
  setFilterRadius,
  applyRadiusFilters,
}) {
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button className='w-8 md:w-12 h-8 md:h-10 right-14 z-10 bg-ezGreen  text-white rounded-full flex justify-center items-center'>
          <AiOutlineSetting className='w-4 md:w-6 h-4 md:h-6' />
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
        <Menu.Items className='absolute bottom-full mb-2 right-0 z-10 w-72 origin-top-right rounded-md bg-white shadow-lg  focus:outline-none'>
          <div className='block w-full'>
            <div className='ez__Title bg-ezGreen p-3 text-white rounded-t-md'>
              <p className='text-sm font-bold text-white'>
                Please select radius to search stations in:
              </p>
            </div>
            <div className='ez__Body grid grid-cols-1 w-full gap-2 p-5 rounded-b-md'>
              {radiusData?.map((radius) => (
                <div key={radius?.id} className='w-full mb-2 flex items-center'>
                  <input
                    id={radius?.id}
                    name='notification-method'
                    type='radio'
                    defaultChecked={radius?.value === filterRadius}
                    onChange={() => {
                      setFilterRadius(radius?.value);
                      applyRadiusFilters(radius?.value);
                    }}
                    className='cursor-pointer h-4 w-4 border-gray-300 text-ezGreen focus:ring-ezGreen'
                  />
                  <label
                    htmlFor={radius?.id}
                    className='cursor-pointer ml-2 block text-xs md:text-sm font-medium text-gray-700'
                  >
                    {radius?.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
