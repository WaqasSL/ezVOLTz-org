import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ReactStars from 'react-rating-stars-component';
import { MdCancel } from 'react-icons/md';
import useApiHook from 'hooks/useApiHook';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Spiner from 'helper/Spiner';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ReviewImagesModal from './ReviewImagesModal';
import { initialReviewUpdateValues } from 'helper/functionality';

export default function ReviewUpdateModal({
  isEditReview,
  setIsEditReview,
  getReiews,
  reviews,
  setReviews,
}) {
  const { auth } = useSelector((state) => state);
  const { isApiLoading, handleApiCall } = useApiHook();
  const [isReviewImageModal, setIsReviewImageModal] = useState(false);
  const [formValues, setFormValues] = useState({
    rating: null,
    comment: '',
    images: [],
    imagesUrl: [],
  });
  const cancelButtonRef = useRef(null);

  const updateReview = async () => {
    if (!formValues?.rating || formValues?.rating === 0)
      return toast.error('Please give the rating to this station');
    if (!formValues?.comment || formValues?.comment === '')
      return toast.error('Please give comment to this station');
    const result = await handleApiCall({
      method: 'patch',
      url: `/review`,
      data: {
        rating: formValues?.rating,
        comment: formValues?.comment,
        stationId: isEditReview?.data?.stationId,
        stationType: isEditReview?.data?.stationType,
        reviewId: isEditReview?.data?._id,
        userId: auth?.userInfo?.user?._id,
      },
    });
    if (result?.status === 200) {
      setIsEditReview(initialReviewUpdateValues);
      getReiews({ page: 1 });
      toast.success(result.data?.message);
    }
  };

  const deleteReviewImage = async (imageId) => {
    const result = await handleApiCall({
      method: 'delete',
      url: `/review/${auth?.userInfo?.user?._id}/${isEditReview?.data?._id}/${imageId}`,
    });
    if (result?.status === 200) {
      setIsEditReview({
        isModal: true,
        data: {
          ...result?.data?.review,
          rating: result?.data?.review?.rating,
          comment: result?.data?.review?.comment,
          images: [],
          imagesUrl: result?.data?.review?.images || [],
        },
      });
      setFormValues({
        rating: result?.data?.review?.rating,
        comment: result?.data?.review?.comment,
        images: [],
        imagesUrl: result?.data?.review?.images || [],
      });
      setReviews({
        ...reviews,
        reviews: reviews?.reviews?.map((review) =>
          review?._id === result?.data?.review?._id
            ? result?.data?.review
            : review
        ),
      });
    }
  };

  const uploadReviewImage = async (images) => {
    let formData = new FormData();
    formData.append('reviewId', isEditReview?.data?._id);
    formData.append('userId', auth?.userInfo?.user?._id);
    if (images?.length > 0)
      for (let i = 0; i < images?.length; i++) {
        formData.append('images', images[i]);
      }
    const result = await handleApiCall({
      method: 'post',
      url: `/review/image`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (result?.status === 200) {
      setIsEditReview({
        isModal: true,
        data: {
          ...result?.data?.review,
          rating: result?.data?.review?.rating,
          comment: result?.data?.review?.comment,
          images: [],
          imagesUrl: result?.data?.review?.images || [],
        },
      });
      setFormValues({
        rating: result?.data?.review?.rating,
        comment: result?.data?.review?.comment,
        images: [],
        imagesUrl: result?.data?.review?.images || [],
      });
      setReviews({
        ...reviews,
        reviews: reviews?.reviews?.map((review) =>
          review?._id === result?.data?.review?._id
            ? result?.data?.review
            : review
        ),
      });
    }
  };

  useEffect(() => {
    if (isEditReview?.data)
      setFormValues({
        rating: isEditReview?.data?.rating,
        comment: isEditReview?.data?.comment,
        images: [],
        imagesUrl: isEditReview?.data?.images || [],
      });
  }, []);

  return (
    <>
      <Transition.Root show={isEditReview?.isModal || false} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={() => setIsEditReview({ ...setIsEditReview, isModal: true })}
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
                <Dialog.Panel className='relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-xl sm:p-6'>
                  {isApiLoading && (
                    <div className='absolute w-full h-full top-0 left-0 bg-black bg-opacity-30 z-50 rounded-md'>
                      <Spiner color='ezGreen' />
                    </div>
                  )}
                  <button
                    onClick={() => setIsEditReview(initialReviewUpdateValues)}
                    className='bg-white w-8 h-8 rounded-full absolute -top-3 -right-3 flex items-center justify-center'
                  >
                    <MdCancel className='w-10 h-10 text-ezRed' />
                  </button>
                  <div className='block w-full'>
                    <h3 className='text-ezGreen text-base md:text-lg mb-3 font-medium'>
                      Give Feedback
                    </h3>
                    {formValues?.rating && (
                      <>
                        <p className='text-xs md:text-sm mb-2 text-black'>
                          Please rate your experience
                        </p>
                        <div className='mb-3 block'>
                          <ReactStars
                            count={5}
                            value={formValues?.rating}
                            onChange={(value) =>
                              setFormValues({ ...formValues, rating: value })
                            }
                            size={24}
                            isHalf={true}
                            activeColor='#ffd700'
                          />
                        </div>
                      </>
                    )}
                    <p className='text-xs md:text-sm mb-2 text-black'>
                      Additional comment
                    </p>
                    <textarea
                      name='comment'
                      id='comment'
                      className='w-full h-32 resize-none rounded-md border border-ezLightGray text-black text-xs md:text-sm p-2 mb-5'
                      placeholder='Comment here...'
                      value={formValues?.comment}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          comment: e?.target?.value,
                        })
                      }
                    ></textarea>
                    <p className='text-xs md:text-sm mb-2 text-black'>
                      Upload Images (Optional)
                    </p>
                    <div className='relative flex w-full items-center'>
                      {formValues?.imagesUrl?.length > 0 && (
                        <>
                          {formValues?.imagesUrl?.map((image, ind) => (
                            <div
                              key={`ImageUploadKey${ind}`}
                              className='block w-20 h-20 rounded-md relative mr-2 border border-ezGray'
                            >
                              <button
                                className='absolute -top-1.5 w-4 h-4 rounded-full -right-1.5 bg-white text-ezRed'
                                onClick={() => {
                                  let imagesSplitArr = image?.split('/');
                                  deleteReviewImage(
                                    image?.split('/')[
                                      imagesSplitArr?.length - 1
                                    ]
                                  );
                                }}
                              >
                                <MdCancel className='w-4 h-4 text-ezRed' />
                              </button>
                              <img
                                onClick={() => setIsReviewImageModal(true)}
                                src={image}
                                alt='Review'
                                className='w-full h-full object-cover rounded-md cursor-pointer'
                              />
                            </div>
                          ))}
                        </>
                      )}
                      {formValues?.imagesUrl?.length < 5 && (
                        <div className='relative w-20 h-20 flex items-center justify-center rounded-md border border-dashed border-ezGray'>
                          <AiOutlineCloudUpload className='w-4 md:w-10 h-4 md:h-10' />
                          <input
                            type='file'
                            name='images'
                            id='images'
                            accept='image/*'
                            multiple
                            onChange={(e) => {
                              if (
                                formValues?.imagesUrl?.length +
                                  e?.target?.files.length >
                                5
                              )
                                return toast.error(
                                  'Please select max upto 5 images.'
                                );
                              uploadReviewImage(e?.target?.files);
                            }}
                            className='absolute top-0 left-0 w-full h-full cursor-pointer opacity-0'
                          />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={updateReview}
                      className='text-white w-full mt-8 border border-ezGreen rounded-md p-3 bg-ezGreen '
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {isReviewImageModal && (
        <ReviewImagesModal
          isReviewImageModal={isReviewImageModal}
          setIsReviewImageModal={setIsReviewImageModal}
          images={formValues?.imagesUrl}
        />
      )}
    </>
  );
}
