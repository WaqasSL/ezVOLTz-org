import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from 'helper/Loader';
import useApiHook from 'hooks/useApiHook';
import { checkUserAuthenticated, valdiationEmail } from 'helper/functionality';
import { MdMarkEmailRead } from 'react-icons/md';

const ContactUs = () => {
  const { auth } = useSelector((state) => state);
  const isUserAuthenticated = checkUserAuthenticated(auth?.userInfo);
  const { handleApiCall, isApiLoading } = useApiHook();

  const initialState = isUserAuthenticated
    ? {
        subject: '',
        message: '',
      }
    : {
        name: '',
        email: '',
        subject: '',
        message: '',
      };

  const [formValues, setFormValues] = useState(initialState);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (isUserAuthenticated) {
      if (!formValues?.message?.trim() || !formValues?.subject?.trim())
        return toast.error('All fields are required!');
    } else {
      if (
        !formValues?.name?.trim() ||
        !formValues?.email?.trim() ||
        !formValues?.message?.trim() ||
        !formValues?.subject?.trim()
      )
        return toast.error('All fields are required!');
      if (!valdiationEmail(formValues?.email))
        return toast.error('Email must be valid email address!');
    }

    const result = await handleApiCall({
      method: 'post',
      url: '/contact',
      data: {
        name: isUserAuthenticated
          ? auth?.userInfo?.user?.name
          : formValues?.name,
        email: isUserAuthenticated
          ? auth?.userInfo?.user?.email
          : formValues?.email,
        ...formValues,
      },
    });
    if (result.status === 200) {
      toast.success(
        'Your query has been sent successfully. ezVOLTz will contact with you shortly.'
      );
      setFormValues(initialState);
    }
  };

  return (
    <div className='ez__Settings w-full bg-ezMidWhite px-4 py-10 md:p-10'>
      {isApiLoading && <Loader background='transparency' />}
      <div className='ez__Title w-full flex md:items-center justify-between mb-8 flex-col md:flex-row'>
        <h3 className='text-ezBlack text-xl mb-3 md:mb-0'>Contact Us</h3>
      </div>
      <div className='card block w-full p-4 md:p-10 bg-white rounded-md shadow-sm'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='ezContent block w-full'>
            <h5 className='text-ezBlack text-lg md:text-xl md:w-2/3 font-bold mb-10'>
              Please fill the following information and we will get back to you.
            </h5>
            <form onSubmit={sendMessage} className='block w-full'>
              {!isUserAuthenticated && (
                <>
                  <input
                    type='text'
                    value={formValues?.name}
                    onChange={(e) =>
                      setFormValues({ ...formValues, name: e?.target?.value })
                    }
                    required
                    placeholder='Name'
                    className='w-full border border-ezBlack rounded-md p-3 text-ezBlack mb-5'
                  />
                  <input
                    type='email'
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
              <input
                type='text'
                value={formValues?.subject}
                onChange={(e) =>
                  setFormValues({ ...formValues, subject: e?.target?.value })
                }
                required
                placeholder='Subject'
                className='w-full border border-ezBlack rounded-md p-3 text-ezBlack mb-5'
              />
              <textarea
                required
                value={formValues?.message}
                onChange={(e) =>
                  setFormValues({ ...formValues, message: e?.target?.value })
                }
                placeholder='How can we help?'
                className='w-full border border-ezBlack rounded-md p-3 text-ezBlack mb-5 h-32 resize-none'
              ></textarea>
              <button
                type='submit'
                className='bg-ezGreen w-full sm:w-max px-20 py-2 text-white text-base rounded-md border border-ezGreen hover:bg-transparent hover:text-ezGreen'
              >
                Submit
              </button>
            </form>
          </div>
          <div className='ezInfo w-full hidden md:block mt-10 md:mt-0'>
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

export default ContactUs;
