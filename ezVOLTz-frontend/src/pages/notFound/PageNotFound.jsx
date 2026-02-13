import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className='ez__PageNotFound h-full w-screen min-h-screen'>
      <div className='flex items-center justify-center flex-col w-full h-full min-h-screen'>
        <img
          src='/assets/svgs/notFound.svg'
          alt='Not Found'
          className='w-auto h-56 mb-10 block'
        />
        <h2 className='text-ezBlack text-2xl font-bold mb-3'>Page Not Found</h2>
        <p className='text-ezGray text-sm mb-5'>
          We didn't find the page you are looking for
        </p>
        <Link
          to='/'
          className='block bg-ezGreen text-white hover:text-white px-10 py-2 rounded-md text-sm'
        >
          Go Back To Website
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
