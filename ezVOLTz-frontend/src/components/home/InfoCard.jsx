import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FaInfo } from 'react-icons/fa';

export default function InfoCard() {
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button className='w-8 h-8 md:w-12 md:h-12 right-4 md:right-14 z-10 bg-ezGreen  text-white rounded-full flex justify-center items-center'>
          <FaInfo className='w-4 md:w-6 h-4 md:h-6' />
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
        <Menu.Items className='absolute right-0 z-10 w-56 md:w-96 origin-top-right rounded-md bg-white shadow-lg  focus:outline-none'>
          <div className='block w-full'>
            <div className='ez__Title bg-ezGreen p-3 text-white rounded-t-md'>
              <p className='text-sm md:text-xl font-bold text-white'>
                Map Legend
              </p>
            </div>
            <div className='ez__Body grid grid-cols-1 md:grid-cols-2 w-full md:gap-4 pb-5 p-2 md:p-5 rounded-b-md'>
              <div className='block w-full'>
                <p className='flex items-center md:mb-3 text-black text-xs md:text-sm'>
                  <img
                    src='/assets/images/levelOne.png'
                    alt=''
                    className='w-auto h-8 md:h-10 mr-1'
                  />{' '}
                  Level 1
                </p>
                <p className='flex items-center md:mb-3 text-black text-xs md:text-sm'>
                  <img
                    src='/assets/images/ev.png'
                    alt=''
                    className='w-auto h-8 md:h-10 mr-1'
                  />{' '}
                  Level 2
                </p>
                <p className='flex items-center md:mb-3 text-black text-xs md:text-sm'>
                  <img
                    src='/assets/images/evFast.png'
                    alt=''
                    className='w-auto h-8 md:h-10 mr-1'
                  />{' '}
                  DC Fast
                </p>
              </div>
              <div className='block w-full'>
                <p className='flex items-center md:mb-5 text-black text-xs md:text-sm pl-2 md:pl-0'>
                  <img
                    src='/assets/images/evPrivate.png'
                    alt=''
                    className='w-auto h-6 md:h-10 mr-3'
                  />{' '}
                  Private
                </p>
                <p className='flex items-center my-2 md:mb-5 text-black text-xs md:text-sm pl-2 md:pl-0'>
                  <img
                    src='/assets/svgs/traffic.svg'
                    alt=''
                    className='w-auto h-4 md:h-6 mr-3'
                  />{' '}
                  Traffic
                </p>
                <p className='flex items-center md:mb-3 text-black text-xs md:text-sm pl-2 md:pl-0'>
                  <img
                    src='/assets/svgs/slow.svg'
                    alt=''
                    className='w-auto h-4 md:h-6 mr-3'
                  />{' '}
                  Slow
                </p>
              </div>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
