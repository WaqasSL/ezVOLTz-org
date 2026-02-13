import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { MdCancel } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { toggleLogin } from 'redux/auth/authSlice';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function NoVehicleModal({ isNoVehicleModal, setIsNoVehicleModal }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cancelButtonRef = useRef(null);
    const [imgLoaded, setImgLoaded] = useState(false);

    const logoutGuest = (url) => {
        dispatch(toggleLogin({ isLogin: false, userInfo: null }));
        navigate(url);
        setIsNoVehicleModal(false);
    };

    return (
        <Transition.Root show={isNoVehicleModal} as={Fragment}>
            <Dialog
                as='div'
                className='relative z-10'
                initialFocus={cancelButtonRef}
                onClose={setIsNoVehicleModal}
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
                                    onClick={() => setIsNoVehicleModal(false)}
                                    className='bg-white text-ezRed rounded-full absolute -top-2.5 -right-2.5'
                                >
                                    <MdCancel className='w-8 h-8' />
                                </button>
                                <div className='text-center'>
                                    <Dialog.Title
                                            as='h3'
                                            className='text-base font-semibold leading-6 text-gray-900'
                                        >
                                        <div className='w-full flex items-center justify-center flex-col h-auto'>
                                            { imgLoaded ? (
                                                null
                                            ) : (
                                                <Skeleton variant="rectangular" width={128} height={128} />
                                            )}
                                            <img
                                                src='/assets/svgs/noVehicle.svg'
                                                alt='No Trip'
                                                className='w-16 md:w-32 h-auto mb-5'
                                                onLoad={() => setImgLoaded(true)}
                                            />
                                                No Vehicle found
                                        </div>
                                    </Dialog.Title>
                                    <div className='mt-2'>
                                        <p className='text-sm text-gray-500'>
                                            Ready to add or view your Vehicle? 
                                            Login or register an account.
                                        </p>
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
