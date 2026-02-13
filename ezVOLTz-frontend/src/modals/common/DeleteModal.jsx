import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiAlertTriangle } from 'react-icons/fi';
import Loader from 'helper/Loader';

export default function DeleteModal({
  isModal,
  isLoading,
  handleCloseModal,
  handleDelete,
  title,
  description,
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isModal || false} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={handleCloseModal}
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
            {isLoading && <Loader background='transparency' />}
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='w-full relative transform overflow-hidden bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl p-10 rounded-md'>
                <div className='sm:flex sm:items-start'>
                  <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                    <FiAlertTriangle
                      className='h-6 w-6 text-red-600'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                    <Dialog.Title
                      as='h3'
                      className='text-lg font-medium leading-6 text-gray-900'
                    >
                      {title}
                    </Dialog.Title>
                    <div className='mt-2'>
                      <p className='text-sm text-gray-500'>{description}</p>
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-4 sm:ml-10 sm:flex sm:pl-4'>
                  <button
                    type='button'
                    className='inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 sm:w-auto sm:text-sm'
                    onClick={handleDelete}
                  >
                    Confirm
                  </button>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md border border-ezLightGray bg-white px-4 py-2 text-base font-medium text-ezGray shadow-sm hover:bg-gray-50  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                    onClick={handleCloseModal}
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
