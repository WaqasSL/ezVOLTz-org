import {
  chargingSvg,
  homeSvg,
  locationSvg,
  searchVehicle,
  tripCarSvg,
} from 'helper/helper';
import {
  AiFillQuestionCircle,
  AiFillSafetyCertificate,
  AiOutlineBell,
} from 'react-icons/ai';
import { BsBookmarkPlus, BsGlobe, BsInfoLg, BsNewspaper } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { handlPlanTripModal } from 'redux/dashbbaord/dashboardSlice';
import SidebarPlacesInput from './SidebarPlacesInput';
import { FiPhoneCall } from 'react-icons/fi';
import { MdOutlinePayment } from 'react-icons/md';
import { checkUserAuthenticated } from 'helper/functionality';
import { FaInfoCircle } from 'react-icons/fa';

const Sidebar = ({ setIsGuestModal, setIsPlanTripModal, setIsNoTripModal, setIsNoVehicleModal }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const isUserAuthenticated = checkUserAuthenticated(auth?.userInfo);

  return (
    <div className='ez__SidebarDiv w-full block'>
      <div className='block lg:hidden space-y-4 px-2  pt-10'>
        <div className='flex items-center justify-end'>
          <button
            type='button'
            className='p-2  text-ezGreen font-semibold focus:outline-none'
          >
            <BsGlobe className='h-5 w-5' aria-hidden='true' />
          </button>
          <span className=' bg-gray-200 h-7 w-px mx-2 block'></span>
          <button
            type='button'
            className='p-2 text-ezGreen font-semibold focus:outline-none block'
          >
            <BsBookmarkPlus className='h-5 w-5' aria-hidden='true' />
          </button>
          <span className=' bg-gray-200 h-7 w-px mx-2 block'></span>
          <button
            type='button'
            className='p-2 text-ezGreen  font-semibold focus:outline-none block'
          >
            <AiOutlineBell className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        <SidebarPlacesInput />
      </div>
      <ul className='ez__NavItems w-full p-4 border-b border-gray-300'>
        <li>
          <NavLink
            to='/home'
            className='text-sm flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
          >
            <span className='block mr-3'>{homeSvg}</span>
            Home
          </NavLink>
        </li>
        <li>
          <button
            type='button'
            onClick={() =>
              isUserAuthenticated
                ? dispatch(handlPlanTripModal(true))
                : setIsPlanTripModal(true)
            }
            className='w-full text-sm flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
          >
            <span className='block mr-3'>{tripCarSvg}</span> Plan a Trip
          </button>
        </li>
        {isUserAuthenticated ? (
          <>
            <li>
              <NavLink
                to='/my-trips'
                className='text-sm flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
              >
                <span className='block mr-3'>{locationSvg}</span> My Trips
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/my-vehicles'
                className='text-sm flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
              >
                <span className='block mr-3'>{searchVehicle}</span> My Vehicle
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <button
                type='button'
                onClick={() => setIsNoTripModal(true)}
                className='text-sm w-full flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
              >
                <span className='block mr-3'>{locationSvg}</span> My Trips
              </button>
            </li>
            <li>
              <button
                type='button'
                onClick={() => setIsNoVehicleModal(true)}
                className='text-sm w-full flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
              >
                <span className='block mr-3'>{searchVehicle}</span> My Vehicle
              </button>
            </li>
          </>
        )}
      </ul>
      <ul className='ez__NavItems w-full p-4 border-b border-gray-300'>
        {isUserAuthenticated ? (
          <>
            <li>
              <NavLink
                to='/charging-activity'
                className='text-sm flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
              >
                <span className='block mr-3'>{chargingSvg}</span>
                Charging Activity
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/my-payment-methods'
                className='text-sm flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
              >
                <MdOutlinePayment className='w-5 h-5 mr-2' />
                Payment Methods
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <button
                type='button'
                onClick={() => setIsGuestModal(true)}
                className='text-sm w-full flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
              >
                <span className='block mr-3'>{chargingSvg}</span>
                Charging Activity
              </button>
            </li>
            <li>
              <button
                type='button'
                onClick={() => setIsGuestModal(true)}
                className='text-sm w-full flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
              >
                <MdOutlinePayment className='w-5 h-5 mr-2' />
                Payment Methods
              </button>
            </li>
          </>
        )}
      </ul>
      <ul className='ez__NavItems w-full p-4'>
        <li>
          <NavLink
            to='/about-our-app'
            className='text-sm flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
          >
            <FaInfoCircle className='w-4 h-4 mr-2' />
            About Our App
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/contact-us'
            className='text-sm flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
          >
            <FiPhoneCall className='w-4 h-4 mr-2' />
            Contact Us
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/feedback'
            className='text-sm flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
          >
            <AiFillQuestionCircle className='w-5 h-5 mr-2' />
            Feedback
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/privacy-policy'
            className='text-sm flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
          >
            <AiFillSafetyCertificate className='w-5 h-5 mr-2' />
            Privacy Policy
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/terms-and-conditions'
            className='text-sm flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
          >
            <BsNewspaper className='w-4 h-4 mr-2' />
            Terms & Conditions
          </NavLink>
        </li>
        <li>
          <a
            href='http://www.ezvoltz.com/about-us/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm flex items-center py-2 md:py-3 px-5 text-ezBlack hover:bg-ezLightGreen bg-transparent rounded-md'
          >
            <BsInfoLg className='w-4 h-4 mr-2' />
            About Us
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
