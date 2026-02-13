import PrimaryBtn from 'components/btns/PrimaryBtn';
import Spiner from 'helper/Spiner';
import useApiHook from 'hooks/useApiHook';
import DeleteModal from 'modals/common/DeleteModal';
import AddPaymentModal from 'modals/payment/AddPaymentModal';
import { useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyPayment = () => {
  const { auth } = useSelector((state) => state);
  const location = useLocation();
  const navigate = useNavigate();
  const { handleApiCall, isApiLoading } = useApiHook();
  const [isModal, setIsModal] = useState(false);
  const [isDelModal, setIsDelModal] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const getUserPaymentMethos = async () => {
    const result = await handleApiCall({
      method: 'get',
      url: `account/payment-methods/${auth?.userInfo?.user?._id}`,
    });
    if (result?.status === 200) setPaymentMethods(result?.data?.paymentMethods);
  };

  const deletePaymentMethod = async () => {
    const result = await handleApiCall({
      method: 'delete',
      url: `/account/customer/payment/${auth?.userInfo?.user?._id}/${paymentId}`,
    });
    setPaymentId(null);
    setIsDelModal(false);
    if (result?.status === 200) {
      toast.success('Your card has been deleted.');
      getUserPaymentMethos();
    }
  };

  useEffect(() => {
    if (location.search) {
      navigate('/my-payment-methods');
      toast.success('Your payment method has been added.');
    }
    getUserPaymentMethos();
  }, []);

  return (
    <div className='ez__MyTrip w-full bg-ezMidWhite px-4 py-10 md:p-10'>
      <div className='ez__Title w-full flex justify-between mb-8 flex-row md:flex-row'>
        <h3 className='text-ezBlack text-xl mb-3 md:mb-0'>Payment Methods</h3>
        <div className='ml-auto md:ml-0 z__Tabs w-max border border-ezGreen rounded-md overflow-hidden'>
          <PrimaryBtn
            btnType='button'
            text='Add Payment Method'
            classNames='px-5 md:px-10 mb-0 text-sm sm:text-base'
            handleEvent={() => setIsModal(true)}
          />
        </div>
      </div>
      <div className='block w-full'>
        {isApiLoading ? (
          <div className='col-span-3 block w-full h-96'>
            <Spiner color='ezGreen' />
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {paymentMethods?.data?.length > 0 ? (
              paymentMethods?.data?.map((method) => (
                <div
                  key={method?.id}
                  className='card ezCard-width shadow-sm bg-white rounded-md flex items-center justify-between p-5'
                >
                  <div className='cardInfo flex items-center'>
                    <img
                      src={`/assets/images/cards/${method?.card?.brand}.png`}
                      alt='Card Image'
                      className='w-10 h-auto'
                    />
                    <div className='cardContent ml-2'>
                      <p className='text-ezBlack text-sm'>Business</p>
                      <span className='text-ezGray text-xs'>
                        **** **** **** {method?.card?.last4}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsDelModal(true);
                      setPaymentId(method?.id);
                    }}
                    className='text-ezRed'
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))
            ) : (
              <div className='col-span-3 w-full flex items-center justify-center flex-col py-32'>
                <img
                  src='/assets/svgs/noPayment.svg'
                  alt='No Trip'
                  className='w-32 md:w-56 h-auto mb-5'
                />
                <p className='text-ezGray text-sm md:text-base mb-5'>
                  There is no payment method
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {isModal && <AddPaymentModal isModal={isModal} setIsModal={setIsModal} />}
      {isDelModal && (
        <DeleteModal
          isModal={isDelModal}
          isLoading={isApiLoading}
          handleCloseModal={() => {
            setIsDelModal(false);
            setPaymentId(null);
          }}
          title='Payment Method'
          description='Are you sure you want to delete this payment method?'
          handleDelete={deletePaymentMethod}
        />
      )}
    </div>
  );
};

export default MyPayment;
