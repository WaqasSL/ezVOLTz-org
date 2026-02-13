import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MdCallSplit, MdOutlineCall, MdOutlineCancel } from 'react-icons/md';
import { evConnectorTypes } from 'helper/nrelData';
import Reviews from 'components/reviews/Reviews';

export default function EVDetailDrawer({
  setEVDetailData,
  evDetailData,
  isEVDetail,
  setIsEVDetail,
  handleDirection,
  getDirections,
}) {
  const [tabView, setTabView] = useState('detail');

  return (
    <Transition.Root show={isEVDetail || false} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        onClose={() => {
          setIsEVDetail(false);
          setEVDetailData(null);
        }}
      >
        <div className='fixed inset-0' />

        <div className='fixed inset-0 overflow-hidden bg-ezBlack bg-opacity-50'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'
              >
                <Dialog.Panel className='pointer-events-auto w-screen max-w-2xl'>
                  <div className='flex h-full flex-col overflow-y-scroll bg-white shadow-xl'>
                    <div className='px-4 py-3 sm:px-6 bg-ezGreen'>
                      <div className='flex items-start justify-between'>
                        <Dialog.Title className='text-base md:text-lg text-white'>
                          ezVOLTz
                        </Dialog.Title>
                        <div className='ml-3 flex h-7 items-center'>
                          <button
                            type='button'
                            className='rounded-md bg-transparent text-white '
                            onClick={handleDirection}
                          >
                            <MdOutlineCancel
                              className='h-6 w-6'
                              aria-hidden='true'
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div className='divide-y divide-gray-200 relative'>
                      <dl className='space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200'>
                        <div className='imgDiv w-full'>
                          <img
                            src='/assets/images/stationDetailImg.jpg'
                            alt='stationDetailImg'
                            className='w-full h-32 md:h-80 object-cover'
                          />
                        </div>
                        <div className='px-6 block w-full sm:py-5'>
                          <h4 className='text-ezBlack text-base'>
                            {evDetailData?.station_name}
                          </h4>
                          <p className='text-ezLightGray text-xs'>
                            {evDetailData?.street_address}
                          </p>
                          <div className='md:flex items-center mt-3'>
                            <button
                              type='button'
                              onClick={() => getDirections(evDetailData)}
                              className='flex items-center mb-3 md:mb-0 md:mr-10 bg-ezGreen text-white rounded-md py-2 px-6 cursor-pointer text-sm'
                            >
                              <MdCallSplit className='mr-1 h-4 md:h-6 w-4 md:w-6' />{' '}
                              Get direction
                            </button>
                            <a
                              href={`tel:+${evDetailData?.station_phone}`}
                              className='flex items-center text-ezBlack text-sm'
                            >
                              <MdOutlineCall className='mr-2 w-5 h-5' />
                              {evDetailData?.station_phone}
                            </a>
                          </div>
                        </div>
                        <div className='ezDetailTabView'>
                          <div className='ezTabBtns grid grid-cols-2 items-center border-t border-b border-gray-300'>
                            <button
                              onClick={() => setTabView('detail')}
                              className={`${
                                tabView === 'detail'
                                  ? 'text-ezGreen border-ezGreen'
                                  : 'border-transparent text-ezGray'
                              } text-center w-full p-2 border-b hover:border-ezGreen text-sm md:text-base hover:text-ezGreen`}
                            >
                              Details
                            </button>
                            <button
                              onClick={() => setTabView('review')}
                              className={`${
                                tabView === 'review'
                                  ? 'text-ezGreen border-ezGreen'
                                  : 'border-transparent text-ezGray'
                              } text-center w-full p-2 border-b hover:border-ezGreen text-sm md:text-base hover:text-ezGreen`}
                            >
                              Reviews
                            </button>
                          </div>
                          {tabView === 'detail' && (
                            <div className='ezTabDiv detailViewDiv'>
                              <div className='block w-full py-5'>
                                <h5 className='text-ezGreen font-semibold pl-4 md:pl-6 mb-3'>
                                  Availability
                                </h5>
                                <div className='sm:flex pl-4 md:px-6 mb-1'>
                                  <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                    Hours:
                                  </dt>
                                  <dd className='mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                    {evDetailData?.access_days_time}
                                  </dd>
                                </div>
                                <div className='sm:flex pl-4 md:px-6 mb-1'>
                                  <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                    Access:
                                  </dt>
                                  <dd className='capitalize mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                    {evDetailData?.access_code}
                                  </dd>
                                </div>
                              </div>
                              <div className='block w-full py-5'>
                                <h5 className='text-ezGreen font-semibold pl-4 md:pl-6 mb-3'>
                                  Electric
                                </h5>
                                <div className='sm:flex pl-4 md:px-6 mb-1'>
                                  <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                    Network:
                                  </dt>
                                  <dd className='mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                    {evDetailData?.ev_network}
                                  </dd>
                                </div>
                                <div className='sm:flex pl-4 md:px-6 mb-1'>
                                  <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                    Status:
                                  </dt>
                                  <dd className='mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                    {evDetailData?.status_code === 'E'
                                      ? 'Available'
                                      : evDetailData?.status_code === 'P'
                                      ? 'Planned'
                                      : 'Temporarily Unavailable'}
                                  </dd>
                                </div>
                                <div className='sm:flex pl-4 md:px-6 mb-1'>
                                  <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                    Connector Type:
                                  </dt>
                                  <dd className='mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                    {evDetailData?.ev_connector_types?.length >
                                    0
                                      ? evConnectorTypes?.filter(
                                          (ev) =>
                                            ev?.value ===
                                            evDetailData?.ev_connector_types[0]
                                        )[0]?.title
                                      : ''}
                                  </dd>
                                </div>
                                <div className='sm:flex pl-4 md:px-6 mb-1'>
                                  <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                    Type:
                                  </dt>
                                  <dd className='mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                    {evDetailData?.ev_level1_evse_num
                                      ? 'Level 1'
                                      : evDetailData?.ev_dc_fast_num
                                      ? 'Fast Charger'
                                      : evDetailData?.ev_level2_evse_num
                                      ? 'Level 2'
                                      : ''}
                                  </dd>
                                </div>
                              </div>
                            </div>
                          )}
                          {tabView === 'review' && (
                            <Reviews detail={evDetailData} stationType='nrel' />
                          )}
                        </div>
                      </dl>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
