import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

const AddPaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    const result = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${process.env.REACT_APP_REDIRECT_URI}my-payment-methods`,
      },
    });
    if (result.error) return toast.error(result.error.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          layout: {
            type: 'accordion',
            defaultCollapsed: false,
            radios: true,
            spacedAccordionItems: false,
          },
          defaultValues: {
            billingDetails: {
              address: {
                country: 'US',
              },
            },
          },
          business: {
            name: 'ezVOLTz',
          },
          wallets: {
            applePay: 'auto',
            googlePay: 'auto',
          },
        }}
      />
      <button
        className='bg-ezGreen text-white rounded-md mt-5 text-sm md:text-base py-2 px-8 sm:px-4 md:px-7'
        disabled={!stripe}
      >
        Submit
      </button>
    </form>
  );
};

export default AddPaymentForm;
