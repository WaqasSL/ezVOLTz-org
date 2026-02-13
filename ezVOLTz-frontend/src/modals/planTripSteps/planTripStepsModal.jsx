import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { MdCancel } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { toggleLogin } from 'redux/auth/authSlice';
import Slider from "react-slick";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export default function PlanTripStepsModal ({ isPlanTrip, setIsPlanTripModal }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cancelButtonRef = useRef(null);
    const [windowSize, setWindowSize] = useState(getWindowSize());
    const [imgLoaded, setImgLoaded] = useState(false);

    const logoutGuest = (url) => {
    dispatch(toggleLogin({ isLogin: false, userInfo: null }));
    navigate(url);
    setIsPlanTripModal(false);
    };

    function getWindowSize() {
        const {innerWidth, innerHeight} = window;
        return {innerWidth, innerHeight};
    }

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }
    
        window.addEventListener('resize', handleWindowResize);
    
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);    

    const images = [
        { src: '/assets/images/planTripStep1.png', alt: 'Car Wheel' },
        { src: '/assets/images/planTripStep2.png', alt: 'Car Wheel' },
        { src: '/assets/images/planTripStep3.png', alt: 'Car Wheel' },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
    <Transition.Root show={isPlanTrip} as={Fragment}>
        <Dialog
            as='div'
            className='relative z-10'
            initialFocus={cancelButtonRef}
            onClose={setIsPlanTripModal}
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
            <div className='flex min-h-full items-center justify-center py-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
                <Dialog.Panel className='relative overflow-hidden transform bg-white text-left shadow-xl transition-all mx-3 sm:my-8 w-full sm:max-w-4xl'>
                    <div className='ez__PlanTripHead w-full bg-ezGreen p-2 md:px-2 flex items-center justify-between'>
                        <p className='text-white p-2'><strong>How to plan a trip</strong></p>{' '}
                            <button
                                type='button'
                                onClick={() => {
                                    setIsPlanTripModal(false);
                                }}
                                className='bg-white text-ezGreen rounded-full block w-max float-right'
                            >
                                <MdCancel className='w-8 h-8' />
                            </button>
                    </div>
                    { windowSize.innerWidth < 640 ? (
                        <div className='planSlider px-4 pt-2 mb-2'>
                            <Slider {...settings}>
                                { imgLoaded ? (
                                    null
                                ) : (
                                    <Skeleton variant="rectangular" width={210} height={318} />
                                )}
                                {images.map((image, index) => (
                                    <div key={index}>
                                        <img src={image.src} alt={image.alt} className='w-full h-full' onLoad={() => setImgLoaded(true)} />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    ) : (
                        <div className='grid grid-col-3 sm:gap-0 md:gap-0 px-4 pt-2'>
                            <div className='inline-flex flex-col w-full justify-center bg-white w-full py-2 px-2 md:px-2 sm:col-start-1'>
                                { imgLoaded ? (
                                    null
                                ) : (
                                    <Skeleton variant="rectangular" width={210} height={318} />
                                )}
                                <img
                                    src='\assets\images\planTripStep1.png'
                                    alt='Car Wheel'
                                    className='w-full h-full object-cover md:h-full'
                                    onLoad={() => setImgLoaded(true)}
                                />
                            </div>
                            <div className='inline-flex flex-col w-full justify-center bg-white w-full py-2 px-2 md:px-2 sm:col-start-2'>
                                { imgLoaded ? (
                                    null
                                ) : (
                                    <Skeleton variant="rectangular" width={210} height={318} />
                                )}
                                <img
                                    src='\assets\images\planTripStep2.png'
                                    alt='Car Wheel'
                                    className='w-full h-full object-cover md:h-full'
                                    onLoad={() => setImgLoaded(true)}
                                />
                            </div>
                            <div className='inline-flex flex-col w-full justify-center bg-white w-full py-2 px-2 md:px-2 sm:col-start-3'>
                                { imgLoaded ? (
                                    null
                                ) : (
                                    <Skeleton variant="rectangular" width={210} height={318} />
                                )}
                                <img
                                    src='\assets\images\planTripStep3.png'
                                    alt='Car Wheel'
                                    className='w-full h-full object-cover md:h-full'
                                    onLoad={() => setImgLoaded(true)}
                                />
                            </div>
                        </div>
                    )}
                    <div className='grid grid-col-1 gap-6 md:gap-0 px-4 text-left text-ezLightGray'>
                        <div className='inline-flex w-full justify-center bg-white w-full px-2 md:px-6'>
                            <small className='text-center'>You can add stops, rearrange them, view your trip on Google Maps, send directions to your phone, and more! Remember to set your filters appropriately.</small>
                        </div>
                    </div>
                    <div className={`grid sm:grid-flow-row-dense gap-3 px-4 pb-4 pt-5 ${windowSize.innerWidth > 800 ? 'sm:grid-cols-4' : 'sm:grid-cols-2'}`}>
                        <button
                            type='button'
                            onClick={() => logoutGuest('/sign-up')}
                            className={`inline-flex w-full justify-center rounded-md border border-ezGreen TransAni hover:bg-ezGreen px-3 py-2 text-sm font-semibold text-ezGreen hover:text-white shadow-sm ${windowSize.innerWidth > 800 ? 'sm:col-start-2' : 'sm:col-start-1'}`}
                        >
                            Register Your Account
                        </button>
                        <button
                            type='button'
                            onClick={() => logoutGuest('/login')}
                            className={`inline-flex w-full justify-center rounded-md border border-ezGreen TransAni bg-ezGreen hover:bg-transparent px-3 py-2 text-sm font-semibold text-white hover:text-ezGreen shadow-sm sm:mt-0 ${windowSize.innerWidth > 800 ? 'sm:col-start-3' : 'sm:col-start-2'}`}
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
