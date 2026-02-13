import { MdOutlineCancel } from 'react-icons/md';

const HomeDirection = ({ handleDirection, directions }) => {
  return (
    <div className='block absolute top-14 right-2 z-10 w-4/5 sm:w-96'>
      <div className='block w-full bg-white'>
        <div className='ez__Title bg-ezGreen py-0 px-3 md:p-3 text-white rounded-t-md flex items-center justify-between'>
          <p className='text-sm md:text-base font-bold text-white'>
            Direction View
          </p>
          <button
            type='button'
            onClick={handleDirection}
            className='w-max p-2 text-white rounded-md text-xl flex justify-center items-center'
          >
            <MdOutlineCancel />
          </button>
        </div>
        <div className='ez__Body grid grid-cols-1 w-full px-3 py-2 md:p-5 rounded-b-md '>
          <div className='block w-full md:mb-3'>
            <div className='sm:flex mb-1 md:mb-2'>
              <dt className='text-xs md:text-sm font-medium text-ezBlack sm:w-20 sm:flex-shrink-0'>
                Origin:
              </dt>
              <dd className='mt-1 text-xs md:text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                {directions?.routes[0]?.legs[0]?.start_address}
              </dd>
            </div>
            <div className='sm:flex mb-1 md:mb-2'>
              <dt className='text-xs md:text-sm font-medium text-ezBlack sm:w-20 sm:flex-shrink-0'>
                Destination:
              </dt>
              <dd className='capitalize mt-1 text-xs md:text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                {directions?.routes[0]?.legs[0]?.end_address}
              </dd>
            </div>
            <div className='grid grid-cols-2 w-full'>
              <div className='sm:flex mb-1 md:mb-2'>
                <dt className='text-xs md:text-sm font-medium text-ezBlack sm:w-20 sm:flex-shrink-0'>
                  Distance:
                </dt>
                <dd className='capitalize mt-1 text-xs md:text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                  {directions?.routes[0]?.legs[0]?.distance?.text}
                </dd>
              </div>
              <div className='sm:flex mb-1 md:mb-2'>
                <dt className='text-xs md:text-sm font-medium text-ezBlack sm:w-20 sm:flex-shrink-0'>
                  Duration:
                </dt>
                <dd className='capitalize mt-1 text-xs md:text-sm text-ezLightGray sm:col-span-2 sm:mt-0 sm:ml-6'>
                  {directions?.routes[0]?.legs[0]?.duration?.text}
                </dd>
              </div>
            </div>
          </div>
          <button
            type='button'
            onClick={handleDirection}
            className='w-max px-5 py-1 bg-ezGreen  text-white rounded-md text-xs md:text-sm flex justify-center items-center'
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeDirection;
