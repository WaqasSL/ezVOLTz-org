import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MdCallSplit, MdOutlineCancel } from 'react-icons/md';
import { AiOutlineGlobal } from 'react-icons/ai';
import Reviews from 'components/reviews/Reviews';

export default function RVDetailDrawer({
  rvDetailData,
  isRVDetail,
  handleDirection,
  getDirections,
}) {
  const [tabView, setTabView] = useState('detail');

  return (
    <Transition.Root show={isRVDetail || false} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={handleDirection}>
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
                        <Dialog.Title className='text-lg text-white'>
                          ezVOLTz
                        </Dialog.Title>
                        <div className='ml-3 flex h-7 items-center'>
                          <button
                            type='button'
                            className='rounded-md bg-transparent text-white'
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
                    <div className='divide-y divide-gray-200'>
                      <div className='px-4 py-5 sm:px-0 sm:py-0'>
                        <dl className='space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200'>
                          <div className='imgDiv w-full'>
                            <img
                              src='/assets/images/stationDetailImg.jpg'
                              alt='stationDetailImg'
                              className='w-full h-80 object-cover'
                            />
                          </div>
                          <div className='sm:px-6 block w-full sm:py-5'>
                            <h4 className='text-ezBlack text-base mb-2'>
                              {rvDetailData?.name}
                            </h4>
                            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                              <div className='md:col-span-3'>
                                <div className='sm:flex mb-1'>
                                  <dt className='text-sm font-medium text-ezBlack sm:w-12 sm:flex-shrink-0'>
                                    Address:
                                  </dt>
                                  <dd className='mt-1 text-sm text-ezLightGray sm:mt-0 sm:ml-6'>
                                    {rvDetailData?.address_1}
                                  </dd>
                                </div>
                                <div className='sm:flex mb-1'>
                                  <dt className='text-sm font-medium text-ezBlack sm:w-12 sm:flex-shrink-0'>
                                    Location:
                                  </dt>
                                  <dd className='mt-1 text-sm text-ezLightGray sm:mt-0 sm:ml-6'>
                                    {rvDetailData?.city}
                                  </dd>
                                </div>
                              </div>
                              <div className='flex items-center mt-3'>
                                <button
                                  type='button'
                                  onClick={() => getDirections(rvDetailData)}
                                  className='flex items-center justify-center w-10 h-10 md:mr-3 bg-ezGreen text-white rounded-full cursor-pointer'
                                >
                                  <MdCallSplit className='h-6 w-6' />
                                </button>
                                {rvDetailData?.website_url && (
                                  <a
                                    href={rvDetailData?.website_url}
                                    target='_blank'
                                    className='flex items-center justify-center w-10 h-10 bg-transparent border border-ezGreen text-ezGreen rounded-full cursor-pointer hover:text-ezGreen'
                                  >
                                    <AiOutlineGlobal className='w-5 h-5' />
                                  </a>
                                )}
                              </div>
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
                                } text-center w-full p-2 border-b hover:border-ezGreen  text-base hover:text-ezGreen`}
                              >
                                Details
                              </button>
                              <button
                                onClick={() => setTabView('review')}
                                className={`${
                                  tabView === 'review'
                                    ? 'text-ezGreen border-ezGreen'
                                    : 'border-transparent text-ezGray'
                                } text-center w-full p-2 border-b hover:border-ezGreen  text-base hover:text-ezGreen`}
                              >
                                Reviews
                              </button>
                            </div>
                            {tabView === 'detail' && (
                              <div className='ezTabDiv detailViewDiv'>
                                <div className='block w-full py-5'>
                                  <h5 className='text-ezGreen font-semibold pl-6 mb-3'>
                                    Availability
                                  </h5>
                                  <div className='sm:px-6 mb-1'>
                                    <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                      Last Year Pricing:
                                    </dt>
                                    <dd className='mt-1 text-sm text-ezLightGray'>
                                      {rvDetailData?.last_year_rate}
                                    </dd>
                                  </div>
                                  <div className='sm:px-6 mb-1'>
                                    <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                      Content:
                                    </dt>
                                    <dd className='mt-1 text-sm text-ezLightGray'>
                                      {rvDetailData?.directions}
                                    </dd>
                                  </div>
                                </div>
                                <div className='block w-full py-5'>
                                  <div className=' sm:px-6 mb-1'>
                                    <dt className='text-sm font-medium text-ezBlack w-full'>
                                      Sites:
                                    </dt>
                                    <dd className='mt-1 text-sm text-ezLightGray grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8'>
                                      {rvDetailData?.sites?.map((site) => (
                                        <span
                                          key={`SiteKey${site?.id}`}
                                          className='text-ezLightGray tex-xs'
                                        >
                                          {site?.item_desc}{' '}
                                          {`(${site?.item_count})`}
                                        </span>
                                      ))}
                                    </dd>
                                  </div>
                                </div>
                              </div>
                            )}
                            {tabView === 'review' && (
                              <Reviews url={`${rvDetailData?.id}/rv`} />
                            )}
                          </div>
                        </dl>
                      </div>
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
