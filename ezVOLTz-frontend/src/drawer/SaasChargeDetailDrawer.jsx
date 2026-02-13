import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MdCallSplit, MdOutlineCancel } from 'react-icons/md';
import useSaasChargeApiHook from 'hooks/saasCharge/useSaasChargeApiHook';
import Spiner from 'helper/Spiner';
import Reviews from 'components/reviews/Reviews';
import { androidUrl, iosUrl } from 'helper/functionality';

export default function SaasChargeDetailDrawer({
  sassChargeDetailData,
  isSassChargeDetail,
  handleDirection,
  getDirections,
}) {
  const [csoDetail, setCsoDetail] = useState(null);
  const [billingDetail, setBillingDetail] = useState(null);
  const [tabView, setTabView] = useState('detail');
  const { handleSassApiCall, isSassLoading } = useSaasChargeApiHook();

  const getCSOStationDetail = async () => {
    const result = await handleSassApiCall({
      method: 'get',
      url: `/external/csoStation?stationBoxId=${sassChargeDetailData?.stationBoxId}`,
    });
    if (result.status === 200) {
      setCsoDetail(result?.data?.data[0]);
      if (result?.data?.data?.[0]?.stationBoxId)
        getCSOBillingDetail(result?.data?.data[0]?.stationBoxId);
    }
  };

  const getCSOBillingDetail = async (stationBoxId) => {
    const result = await handleSassApiCall({
      method: 'post',
      url: '/external/retail-price',
      data: { idTag: 'EZVOLTZ-ID-TAG-01', stationBoxId },
    });
    if (result.status === 200) setBillingDetail(result?.data?.data);
  };

  useEffect(() => {
    if (isSassChargeDetail) getCSOStationDetail();
  }, [isSassChargeDetail]);

  return (
    <Transition.Root show={isSassChargeDetail || false} as={Fragment}>
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
                    <div className='divide-y divide-gray-200 relative'>
                      {isSassLoading ? (
                        <div className='h-56 w-full'>
                          <Spiner color='ezGreen' />
                        </div>
                      ) : (
                        <dl className='space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200'>
                          <div className='imgDiv w-full'>
                            <img
                              src='/assets/images/stationDetailImg.jpg'
                              alt='stationDetailImg'
                              className='w-full h-32 md:h-80 object-cover'
                            />
                          </div>
                          <div className='px-6 md:flex items-center justify-between w-full sm:py-5'>
                            <div className='block min-w-max'>
                              <h4 className='text-ezBlack text-base'>
                                {csoDetail?.stationName}
                              </h4>
                              <p className='text-ezLightGray text-xs'>
                                Address:{' '}
                                {`${csoDetail?.stationAddress?.stationStreet}, ${csoDetail?.stationAddress?.stationZip} ${csoDetail?.stationAddress?.stationCity}`}
                              </p>
                            </div>
                            <div className='md:flex items-center mt-3 min-w-max'>
                              <button
                                type='button'
                                onClick={() =>
                                  getDirections({
                                    ...csoDetail,
                                    latitude:
                                      +csoDetail?.stationAddress?.gps?.split(
                                        ', '
                                      )[1],
                                    longitude:
                                      +csoDetail?.stationAddress?.gps?.split(
                                        ', '
                                      )[0],
                                  })
                                }
                                className='flex items-center justify-center mb-3 md:mb-0 md:mr-10 bg-ezGreen text-white rounded-full w-8 md:w-10 h-8 md:h-10 cursor-pointer'
                              >
                                <MdCallSplit className='h-5 md:h-6 w-5 md:w-6' />
                              </button>
                            </div>
                          </div>
                          <div className='ezDetailTabView'>
                            <div className='ezTabBtns grid grid-cols-3 items-center border-t border-b border-gray-300'>
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
                                onClick={() => setTabView('billing')}
                                className={`${
                                  tabView === 'billing'
                                    ? 'text-ezGreen border-ezGreen'
                                    : 'border-transparent text-ezGray'
                                } text-center w-full p-2 border-b hover:border-ezGreen text-sm md:text-base hover:text-ezGreen`}
                              >
                                Billings
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
                                      CSO:
                                    </dt>
                                    <dd className='mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                      {csoDetail?.cso}
                                    </dd>
                                  </div>
                                  <div className='sm:flex pl-4 md:px-6 mb-1'>
                                    <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                      Access:
                                    </dt>
                                    <dd className='capitalize mt-1 text-sm sm:col-span-2 sm:mt-0 sm:ml-6'>
                                      {csoDetail?.stationStatus?.toLowerCase() ===
                                      'available' ? (
                                        <span className='inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
                                          {csoDetail?.stationStatus}
                                        </span>
                                      ) : csoDetail?.stationStatus?.toLowerCase() ===
                                        'unavailable' ? (
                                        <span className='inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20'>
                                          {csoDetail?.stationStatus}
                                        </span>
                                      ) : csoDetail?.stationStatus?.toLowerCase() ===
                                        'charging' ? (
                                        <span className='inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20'>
                                          {csoDetail?.stationStatus}
                                        </span>
                                      ) : (
                                        <span className='inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20'>
                                          {csoDetail?.stationStatus}
                                        </span>
                                      )}
                                    </dd>
                                  </div>
                                </div>
                                <div className='block w-full py-5'>
                                  <h5 className='text-ezGreen font-semibold pl-4 md:pl-6 mb-3'>
                                    About Station
                                  </h5>
                                  <div className='sm:flex pl-4 md:px-6 mb-1'>
                                    <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                      Owner:
                                    </dt>
                                    <dd className='mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                      {csoDetail?.stationOwner}
                                    </dd>
                                  </div>

                                  <div className='sm:flex pl-4 md:px-6 mb-1'>
                                    <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                      Serial Number:
                                    </dt>
                                    <dd className='mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                      {csoDetail?.stationSerialNumber}
                                    </dd>
                                  </div>
                                  <div className='sm:flex pl-4 md:px-6 mb-1'>
                                    <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                      Note:
                                    </dt>
                                    <dd className='mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                      <p className='mb-3'>
                                        Charging is available through the
                                        ezVOLTz App. Download the free ezVOLTz
                                        app
                                      </p>
                                      <div className='flex items-center space-x-3'>
                                        <a
                                          href={androidUrl}
                                          target='_blank'
                                          rel='noopener noreferrer'
                                          className='w-auto h-6 md:h-8 rounded-md overflow-hidden'
                                        >
                                          <img
                                            src='/assets/images/googleBtn.png'
                                            alt='Google'
                                            className='w-auto h-full'
                                          />
                                        </a>
                                        <a
                                          href={iosUrl}
                                          target='_blank'
                                          rel='noopener noreferrer'
                                          className='w-auto h-6 md:h-8 rounded-md overflow-hidden'
                                        >
                                          <img
                                            src='/assets/images/appleBtn.png'
                                            alt='Google'
                                            className='w-auto h-full'
                                          />
                                        </a>
                                      </div>
                                    </dd>
                                  </div>
                                </div>
                              </div>
                            )}
                            {tabView === 'billing' && billingDetail && (
                              <div className='ezTabDiv detailViewDiv'>
                                <div className='block w-full py-5'>
                                  <h5 className='text-ezGreen font-semibold pl-4 md:pl-6 mb-3'>
                                    About Billings
                                  </h5>
                                  <div className='sm:flex pl-4 md:px-6 mb-1'>
                                    <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                      Connector Name:
                                    </dt>
                                    <dd className='mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                      {billingDetail?.connectors?.[0]?.name}
                                    </dd>
                                  </div>
                                  <div className='sm:flex pl-4 md:px-6 mb-1'>
                                    <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                      Connector Id:
                                    </dt>
                                    <dd className='mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                      {billingDetail?.connectors?.[0]?.id}
                                    </dd>
                                  </div>
                                  <div className='sm:flex pl-4 md:px-6 mb-1'>
                                    <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                      Power:
                                    </dt>
                                    <dd className='mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                      {billingDetail?.connectors?.[0]?.power}
                                    </dd>
                                  </div>
                                  <div className='sm:flex pl-4 md:px-6 mb-1'>
                                    <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                      Plug Type:
                                    </dt>
                                    <dd className='capitalize mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                      {billingDetail?.connectors?.[0]?.plugType}
                                    </dd>
                                  </div>
                                  <div className='sm:flex pl-4 md:px-6 mb-1'>
                                    <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                      Price Kwh:
                                    </dt>
                                    <dd className='capitalize mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                      $
                                      {billingDetail?.connectors?.[0]?.priceKwh}
                                    </dd>
                                  </div>
                                  <div className='sm:flex pl-4 md:px-6 mb-1'>
                                    <dt className='text-sm font-medium text-ezBlack sm:w-40 sm:flex-shrink-0 lg:w-48'>
                                      Price Minute:
                                    </dt>
                                    <dd className='capitalize mt-1 text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                                      $
                                      {
                                        billingDetail?.connectors?.[0]
                                          ?.priceMinute
                                      }
                                    </dd>
                                  </div>
                                </div>
                              </div>
                            )}
                            {tabView === 'review' && (
                              <Reviews
                                detail={{ id: csoDetail?.stationBoxId }}
                                stationType='saascharge'
                              />
                            )}
                          </div>
                        </dl>
                      )}
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
