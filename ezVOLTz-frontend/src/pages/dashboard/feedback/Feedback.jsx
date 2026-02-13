import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from 'helper/Loader';
import useApiHook from 'hooks/useApiHook';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdCancel, MdMarkEmailRead } from 'react-icons/md';
import { checkUserAuthenticated, valdiationEmail } from 'helper/functionality';

const Feedback = () => {
  const { auth } = useSelector((state) => state);
  const { handleApiCall, isApiLoading } = useApiHook();
  const isUserAuthenticated = checkUserAuthenticated(auth?.userInfo);
  const initialState = isUserAuthenticated
    ? {
        title: '',
        description: '',
        images: [],
      }
    : {
        name: '',
        email: '',
        title: '',
        description: '',
        images: [],
      };
  const [formValues, setFormValues] = useState(initialState);

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (isUserAuthenticated) {
      if (!formValues?.title?.trim() || !formValues?.description?.trim())
        return toast.error('Title & Description are required!');
    } else {
      if (
        !formValues?.name?.trim() ||
        !formValues?.email?.trim() ||
        !formValues?.title?.trim() ||
        !formValues?.description?.trim()
      )
        return toast.error('All fields are required!');
      if (!valdiationEmail(formValues?.email))
        return toast.error('Email must be valid email address!');
    }
    const formData = new FormData();
    formData.append('title', formValues?.title);
    formData.append('description', formValues?.description);
    formData.append(
      'user[name]',
      isUserAuthenticated ? auth?.userInfo?.user?.name : formValues?.name
    );
    formData.append(
      'user[email]',
      isUserAuthenticated ? auth?.userInfo?.user?.email : formValues?.email
    );
    if (formValues?.images?.length > 0)
      for (let i = 0; i < formValues?.images?.length; i++) {
        formData.append('images', formValues?.images[i]);
      }
    const result = await handleApiCall({
      method: 'post',
      url: '/feedback',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (result.status === 201) {
      toast.success(result?.data?.message);
      setFormValues(initialState);
    }
  };

  return (
    <div className='ez__Settings w-full bg-ezMidWhite px-4 py-10 md:p-10'>
      {isApiLoading && <Loader background='transparency' />}
      <div className='ez__Title w-full flex md:items-center justify-between mb-8 flex-col md:flex-row'>
        <h3 className='text-ezBlack text-xl mb-3 md:mb-0'>Feedback</h3>
      </div>
      <div className='card block w-full p-4 md:p-10 bg-white rounded-md shadow-sm'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='ezContent block w-full'>
            <h5 className='text-ezBlack text-lg md:text-xl md:w-2/3 font-bold mb-10'>
              What are your thoughts on this? We would love to know.
            </h5>
            <form onSubmit={submitFeedback} className='block w-full'>
              {!isUserAuthenticated && (
                <>
                  <label
                    htmlFor='name'
                    className='text-ezBlack text-sm md:text-base mb-2 block'
                  >
                    Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    value={formValues?.name}
                    onChange={(e) =>
                      setFormValues({ ...formValues, name: e?.target?.value })
                    }
                    required
                    placeholder='Name'
                    className='w-full border border-ezBlack rounded-md p-3 text-ezBlack mb-5'
                  />
                  <label
                    htmlFor='email'
                    className='text-ezBlack text-sm md:text-base mb-2 block'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    value={formValues?.email}
                    onChange={(e) =>
                      setFormValues({ ...formValues, email: e?.target?.value })
                    }
                    required
                    placeholder='Email Address'
                    className='w-full border border-ezBlack rounded-md p-3 text-ezBlack mb-5'
                  />
                </>
              )}
              <label
                htmlFor='subject'
                className='text-ezBlack text-sm md:text-base mb-2 block'
              >
                Subject
              </label>
              <input
                type='text'
                name='subject'
                id='subject'
                value={formValues?.title}
                onChange={(e) =>
                  setFormValues({ ...formValues, title: e?.target?.value })
                }
                required
                placeholder='Subject'
                className='w-full border border-ezBlack rounded-md p-3 text-ezBlack mb-5'
              />
              <label
                htmlFor='message'
                className='text-ezBlack text-sm md:text-base mb-2 block'
              >
                Message
              </label>
              <textarea
                required
                value={formValues?.description}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    description: e?.target?.value,
                  })
                }
                name='message'
                id='message'
                placeholder='Message'
                className='w-full border border-ezBlack rounded-md p-3 text-ezBlack mb-5 h-32 resize-none'
              ></textarea>
              <div className='ez_ImageUpload mb-5'>
                <p className='text-xs md:text-sm mb-3 text-black'>
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
                          for (let i = 0; i < e?.target?.files.length; i++) {
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
              </div>
              <button
                type='submit'
                className='bg-ezGreen w-full sm:w-max sm:px-20 py-2 text-white text-base rounded-md border border-ezGreen hover:bg-transparent hover:text-ezGreen'
              >
                Submit Feedback
              </button>
            </form>
          </div>
          <div className='hidden md:block ezInfo w-full mt-10 md:mt-0'>
            <div className='w-full flex mb-5 items-center justify-end'>
              <div className='ezInfoCard block'>
                <h6 className='text-ezBlack text-right text-base font-semibold'>
                  Email
                </h6>
                <a
                  href='mailto:info@ezvoltz.com'
                  rel='noferrer'
                  className='text-ezBlack block text-right text-sm hover:text-ezGreen'
                >
                  info@ezvoltz.com
                </a>
              </div>
              <a
                href='mailto:info@ezvoltz.com'
                className='w-14 h-14 ml-2 flex items-center justify-center rounded-md border border-ezBlack text-ezBlack hover:text-ezGreen hover:border-ezGreen'
              >
                <MdMarkEmailRead className='w-8 h-8' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
