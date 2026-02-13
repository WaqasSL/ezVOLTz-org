import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Spiner from 'helper/Spiner';
import { FiAlertTriangle } from 'react-icons/fi';

export default function DeleteAccount({
  isModal,
  setIsModal,
  deleteUserAccount,
  isApiLoading,
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isModal} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={setIsModal}
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
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                {isApiLoading && (
                  <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center transparency z-50'>
                    <Spiner color='ezGreen' />
                  </div>
                )}
                <div className='sm:flex sm:items-start'>
                  <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                    <FiAlertTriangle
                      className='h-6 w-6 text-red-600'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                    <Dialog.Title
                      as='h3'
                      className='text-base font-semibold leading-6 text-gray-900'
                    >
                      Delete account
                    </Dialog.Title>
                    <div className='mt-2'>
                      <p className='text-sm text-gray-500'>
                        Are you really sure about deleting your account? Just to
                        let you know, once you do this, all your data will be
                        gone. There's no going back after this.
                      </p>
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4'>
                  <button
                    type='button'
                    className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto'
                    onClick={deleteUserAccount}
                  >
                    Yes, Delete
                  </button>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:mt-0 sm:w-auto'
                    onClick={() => setIsModal(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
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
