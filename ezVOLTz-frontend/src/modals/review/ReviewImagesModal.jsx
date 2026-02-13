import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Slider from 'react-slick';
import { MdCancel } from 'react-icons/md';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ReviewImagesModal({
  isReviewImageModal,
  setIsReviewImageModal,
  images,
}) {
  const cancelButtonRef = useRef(null);

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Transition.Root show={isReviewImageModal || false} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={() => setIsReviewImageModal(true)}
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

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform  rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-11/12 sm:max-w-2xl'>
                <button
                  onClick={() => setIsReviewImageModal(false)}
                  className='bg-white w-8 h-8 rounded-full absolute -top-3 -right-3 flex items-center justify-center z-10'
                >
                  <MdCancel className='w-10 h-10 text-ezRed' />
                </button>
                <div className='w-full block slickCarousel rounded-md '>
                  <Slider {...settings}>
                    {images?.map((image) => (
                      <img
                        key={`ImageModalKeyImage${image}`}
                        src={image}
                        alt=''
                        className='w-full imageModalHeight object-cover rounded-md'
                      />
                    ))}
                  </Slider>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
