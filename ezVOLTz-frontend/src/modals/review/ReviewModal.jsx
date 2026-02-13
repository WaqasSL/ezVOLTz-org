import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ReactStars from 'react-rating-stars-component';
import { MdCancel } from 'react-icons/md';
import useApiHook from 'hooks/useApiHook';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Spiner from 'helper/Spiner';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ReviewImagesModal from './ReviewImagesModal';

export default function ReviewModal({
  isReview,
  setIsReview,
  detail,
  stationType,
  getReiews,
}) {
  const { auth } = useSelector((state) => state);
  const { isApiLoading, handleApiCall } = useApiHook();
  const [isReviewImageModal, setIsReviewImageModal] = useState(false);
  const [formValues, setFormValues] = useState({
    rating: 2,
    comment: '',
    images: [],
  });
  const cancelButtonRef = useRef(null);

  const submitReview = async () => {
    if (!formValues?.rating || formValues?.rating === 0)
      return toast.error('Please give the rating to this station');
    if (!formValues?.comment)
      return toast.error('Please give comment to this station');
    let formData = new FormData();
    formData.append('rating', formValues?.rating);
    formData.append('comment', formValues?.comment);
    formData.append('userId', auth?.userInfo?.user?._id);
    formData.append('stationId', detail?.id);
    formData.append('stationType', stationType);
    if (formValues?.images?.length > 0)
      for (let i = 0; i < formValues?.images?.length; i++) {
        formData.append('images', formValues?.images[i]);
      }
    const result = await handleApiCall({
      method: 'post',
      url: `/review`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (result?.status === 201) {
      setIsReview(false);
      getReiews({ page: 1 });
      toast.success(result.data?.message);
    }
  };

  return (
    <>
      <Transition.Root show={isReview || false} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={() => setIsReview(true)}
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
                    onClick={() => setIsReview(false)}
                    className='bg-white w-8 h-8 rounded-full absolute -top-3 -right-3 flex items-center justify-center'
                  >
                    <MdCancel className='w-10 h-10 text-ezRed' />
                  </button>
                  <div className='block w-full'>
                    <h3 className='text-ezGreen text-base md:text-lg mb-3 font-medium'>
                      Give Feedback
                    </h3>
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
                    <p className='text-xs md:text-sm mb-2 text-black'>
                      Additional comment
                    </p>
                    <textarea
                      name='comment'
                      id='comment'
                      className='w-full h-32 resize-none rounded-md border border-ezLightGray text-black text-xs md:text-sm p-2 mb-5'
                      placeholder='Comment here...'
                      values={formValues?.comment}
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
                      {formValues?.images?.length > 0 && (
                        <>
                          {formValues?.images?.map((image, ind) => (
                            <div
                              key={`ImageUploadKey${ind}`}
                              className='block w-20 h-20 rounded-md relative mr-2 border border-ezGray'
                            >
                              <button
                                className='absolute -top-1.5 w-4 h-4 rounded-full -right-1.5 bg-white text-ezRed'
                                onClick={() =>
                                  setFormValues({
                                    ...formValues,
                                    images: formValues?.images?.filter(
                                      (imageObj) => image !== imageObj
                                    ),
                                  })
                                }
                              >
                                <MdCancel className='w-4 h-4 text-ezRed' />
                              </button>
                              <img
                                onClick={() => setIsReviewImageModal(true)}
                                src={URL.createObjectURL(image)}
                                alt=''
                                className='w-full h-full object-cover rounded-md'
                              />
                            </div>
                          ))}
                        </>
                      )}
                      {formValues?.images?.length < 5 && (
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
                                formValues?.images?.length +
                                  e?.target?.files.length >
                                5
                              )
                                return toast.error(
                                  'Please select max upto 5 images.'
                                );
                              let imagesArray = [...formValues?.images];
                              for (
                                let i = 0;
                                i < e?.target?.files.length;
                                i++
                              ) {
                                if (formValues?.images?.length > 0) {
                                  let isExists = formValues?.images?.filter(
                                    (image) =>
                                      image?.size === e.target.files[i]?.size &&
                                      image?.name === e.target.files[i]?.name
                                  )[0];
                                  if (!isExists)
                                    imagesArray?.push(e?.target?.files[i]);
                                } else {
                                  imagesArray?.push(e?.target?.files[i]);
                                }
                              }
                              setFormValues({
                                ...formValues,
                                images: imagesArray,
                              });
                            }}
                            className='absolute top-0 left-0 w-full h-full cursor-pointer opacity-0'
                          />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={submitReview}
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
          images={formValues?.images?.map((imageObj) =>
            URL.createObjectURL(imageObj)
          )}
        />
      )}
    </>
  );
}
