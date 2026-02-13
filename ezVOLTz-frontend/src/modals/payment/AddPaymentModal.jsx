import { Elements } from '@stripe/react-stripe-js';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import AddPaymentForm from 'components/myPayment/AddPaymentForm';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import useApiHook from 'hooks/useApiHook';
import { MdCancel } from 'react-icons/md';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBBLISHABLE_KEY);

export default function AddPaymentModal({ isModal, setIsModal }) {
  const cancelButtonRef = useRef(null);
  const { auth } = useSelector((state) => state);
  const { handleApiCall } = useApiHook();
  const [element, setElement] = useState({
    isLoading: true,
    options: {
      clientSecret: '',
      appearance: {
        theme: 'day',
        labels: 'floating',
      },
    },
  });

  const getClientSecret = async () => {
    const result = await handleApiCall({
      method: 'get',
      url: `account/create/${auth?.userInfo?.user?._id}`,
    });
    if (result?.status === 200)
      setElement({
        isLoading: false,
        options: {
          ...element?.options,
          clientSecret: result?.data?.setupIntent,
        },
      });
  };

  useEffect(() => {
    getClientSecret();
  }, []);

  return (
    <Transition.Root show={isModal || false} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={() => setIsModal(true)}
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
          <div className='flex min-h-full items-center justify-center text-center sm:items-center p-4 sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg'>
                <div className='ez__PlanTripHead w-full bg-ezGreen p-4 md:px-6 flex items-center justify-between'>
                  <p className='text-white p-3'>Add New Payment Method</p>{' '}
                  <button
                    type='button'
                    onClick={() => {
                      setIsModal(false);
                    }}
                    className='bg-white text-ezGreen rounded-full block w-max float-right'
                  >
                    <MdCancel className='w-8 h-8' />
                  </button>
                </div>
                <div className='bg-white px-2 pt-2 pb-4 sm:pb-4'>
                  {!element?.isLoading && (
                    <Elements stripe={stripePromise} options={element?.options}>
                      <AddPaymentForm />
                    </Elements>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
