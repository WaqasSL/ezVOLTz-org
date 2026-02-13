import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { MdCancel } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { toggleLogin } from 'redux/auth/authSlice';

export default function GuestModal({ isGuestModal, setIsGuestModal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cancelButtonRef = useRef(null);

  const logoutGuest = (url) => {
    dispatch(toggleLogin({ isLogin: false, userInfo: null }));
    navigate(url);
    setIsGuestModal(false);
  };

  return (
    <Transition.Root show={isGuestModal} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={setIsGuestModal}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full justify-center p-4 text-center items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-10'>
                <button
                  type='button'
                  onClick={() => setIsGuestModal(false)}
                  className='bg-white text-ezRed rounded-full absolute -top-2.5 -right-2.5'
                >
                  <MdCancel className='w-8 h-8' />
                </button>
                <div>
                  <div className='text-center'>
                    <Dialog.Title
                      as='h3'
                      className='text-base font-semibold leading-6 text-gray-900'
                    >
                      Create an Account or Log In
                    </Dialog.Title>
                    <div className='mt-2'>
                      <p className='text-sm text-gray-500'>
                        Welcome to ezVOLTz! To access additional features and
                        personalize your experience, please create an account or
                        log in.
                      </p>
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6 grid sm:grid-flow-row-dense sm:grid-cols-2 gap-3'>
                  <button
                    type='button'
                    onClick={() => logoutGuest('/sign-up')}
                    className='inline-flex w-full justify-center rounded-md border border-ezGreen TransAni hover:bg-ezGreen px-3 py-2 text-sm font-semibold text-ezGreen hover:text-white shadow-sm sm:col-start-1'
                  >
                    Register
                  </button>
                  <button
                    type='button'
                    onClick={() => logoutGuest('/login')}
                    className='inline-flex w-full justify-center rounded-md border border-ezGreen TransAni bg-ezGreen hover:bg-transparent px-3 py-2 text-sm font-semibold text-white hover:text-ezGreen shadow-sm sm:col-start-2 sm:mt-0'
                  >
                    Login
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
