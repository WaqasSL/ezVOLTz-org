import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function SignFBEmail({
  isLoading,
  fbFormValues,
  setFBFormValues,
  handleSocialSignIn,
}) {
  const cancelButtonRef = useRef(null);
  return (
    <Transition.Root show={fbFormValues?.isFbEmail || false} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={() => setFBFormValues({ ...fbFormValues, isFbEmail: true })}
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
              <Dialog.Panel className='w-full relative transform overflow-hidden rounded-md bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl'>
                <div className='ez__StepForm w-full bg-white p-0'>
                  <div className='ez__Form w-full grid grid-cols-1  gap-x-10 gap-y-4 py-16 px-8'>
                    <div className='flex items-center flex-col w-full'>
                      <h1 className='text-ezGreen text-4xl text-center font-bold mb-5'>
                        ezVOLTz
                      </h1>
                      <img
                        src='/assets/images/logo.png'
                        alt='Logo'
                        className='w-24 h-auto mx-auto mb-5 block'
                      />
                      <p className='block mb-10 text-center text-sm md:text-xl w-4/5 mx-auto text-ezBlack'>
                        Please provide your following information to create your
                        account in ezVOLTz.
                      </p>
                      <label
                        htmlFor='email'
                        className='text-ezBlack text-sm md:text-base mb-1 block text-left max-w-sm w-full'
                      >
                        Email Address:
                      </label>
                      <input
                        type='email'
                        readOnly={!fbFormValues?.isEmailRequired}
                        placeholder='Enter your email address'
                        value={fbFormValues?.email}
                        onChange={(e) =>
                          setFBFormValues({
                            ...fbFormValues,
                            email: e?.target?.value,
                          })
                        }
                        className='block w-full mb-3 border border-ezGray py-4 text-base text-ezGreen px-3 rounded-md max-w-sm mx-auto'
                      />
                      <label
                        htmlFor='phone'
                        className='text-ezBlack text-sm md:text-base mb-1 block text-left max-w-sm w-full'
                      >
                        Phone Number:
                      </label>
                      <PhoneInput
                        readOnly={!fbFormValues?.isPhoneRequired}
                        value={fbFormValues?.phone}
                        onChange={(phone) =>
                          setFBFormValues({
                            ...fbFormValues,
                            phone,
                          })
                        }
                        placeholder='Enter phone number'
                        country='US'
                        international={false}
                        withCountryCallingCode
                        defaultCountry='US'
                        initialValueFormat='+1'
                        countries={['US']}
                        rules={{
                          required: true,
                          validate: isPossiblePhoneNumber,
                        }}
                        className='flex w-full mb-3 border border-ezGray py-4 text-base text-ezGreen px-3 rounded-md max-w-sm mx-auto'
                      />
                      <button
                        type='submit'
                        onClick={() => handleSocialSignIn(fbFormValues)}
                        className={`py-4 text-base text-white border border-ezGreen bg-ezGreen rounded-md block w-full text-center ${
                          isLoading ? 'cursor-wait' : 'hover:bg-transparent'
                        }  hover:text-ezGreen  max-w-sm mx-auto`}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
