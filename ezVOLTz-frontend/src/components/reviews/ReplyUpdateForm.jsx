import Spiner from 'helper/Spiner';
import useApiHook from 'hooks/useApiHook';
import { useState } from 'react';
import { FaLocationArrow } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ReplyUpdateForm = ({
  reply,
  review,
  setReviews,
  reviews,
  userInfo,
  setIsReplyUpdate,
}) => {
  const { isApiLoading, handleApiCall } = useApiHook();
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState(reply?.comment || '');

  const handleSubmit = async () => {
    if (!comment) return toast.error('Please enter reply.');
    setIsLoading(true);
    const result = await handleApiCall({
      method: 'patch',
      url: `/reviews/reply`,
      data: {
        comment,
        reviewId: review?._id,
        userId: userInfo?.user?._id,
        replyId: reply?._id,
      },
    });
    if (result?.status === 200) {
      setIsLoading(false);
      setIsReplyUpdate(false);
      setReviews({
        ...reviews,
        reviews: reviews?.reviews?.map((isReview) =>
          isReview?._id === review?._id
            ? {
                ...review,
                reply: review?.reply?.map((isReply) =>
                  isReply?._id === reply?._id ? result?.data?.reply : isReply
                ),
              }
            : isReview
        ),
      });
      toast.success(result?.data?.message);
    }
  };

  return (
    <div className='w-full mb-5 flex justify-between items-center relative mt-3'>
      {isLoading && (
        <div className='absolute top-0 left-0 w-full h-full bg-ezBlack bg-opacity-30 z-10 rounded-md'>
          <Spiner color='ezGreen' />
        </div>
      )}
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Reply here...'
        className='md:col-span-8 w-full resize-none h-10 block border border-ezLightGray p-2 rounded-md text-ezBlack text-xs'
      />
      <button
        disabled={isApiLoading}
        onClick={handleSubmit}
        className={`${
          isApiLoading && 'cursor-wait'
        } ml-3 w-10 h-10 relative ezReviewBtn flex items-center justify-center p-2 rounded-full text-base text-white bg-ezGreen`}
      >
        <FaLocationArrow />
      </button>
    </div>
  );
};

export default ReplyUpdateForm;
