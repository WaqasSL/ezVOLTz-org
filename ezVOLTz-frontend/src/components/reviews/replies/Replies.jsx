import React, { useState } from 'react';
import ReplyCard from './ReplyCard';
import useApiHook from 'hooks/useApiHook';

const Replies = ({
  review,
  setReviews,
  reviews,
  replies,
  setReplies,
  isUserAuthenticated,
}) => {
  const { handleApiCall } = useApiHook();
  const [isLoading, setIsLoading] = useState(false);

  const getReplies = async ({ page }) => {
    setIsLoading(true);
    const result = await handleApiCall({
      method: 'get',
      url: `reviews/reply/all/${review?._id}?limit=2&page=${page}`,
      headers: { Authorization: 'none ' },
    });
    setIsLoading(false);
    if (result?.status === 200) {
      let data = {
        ...reviews,
        reviews: reviews?.reviews?.map((item) =>
          item?._id === review?._id
            ? {
                ...item,
                reply:
                  page === 1
                    ? result?.data?.replies
                    : [...item.reply, ...result?.data?.replies],
              }
            : item
        ),
      };
      setReplies(result?.data);
      setReviews(data);
    }
  };

  return (
    <div className='relative noCommentDiv w-full flex items-center justify-center flex-col'>
      {review?.reply?.length > 0 &&
        review?.reply?.map((reply) => (
          <ReplyCard
            key={reply?._id}
            review={review}
            reply={reply}
            reviews={reviews}
            setReviews={setReviews}
            isUserAuthenticated={isUserAuthenticated}
          />
        ))}
      {isLoading && replies?.currentPage !== replies?.totalPages ? (
        <div className='w-full h-auto relative'>
          <div className='flex align-center justify-center'>
            <div className='dot1 bg-ezGreen rounded-full m-2'></div>
            <div className='dot2 bg-ezGreen rounded-full m-2'></div>
            <div className='dot3 bg-ezGreen rounded-full m-2'></div>
          </div>
        </div>
      ) : (
        replies?.currentPage !== replies?.totalPages && (
          <button
            onClick={() => getReplies({ page: replies?.currentPage + 1 })}
            className='text-ezBlack text-sm my-3 w-full text-left'
          >
            View more replies...
          </button>
        )
      )}
      {isLoading && !replies?.currentPage && !replies?.totalPages ? (
        <div className='w-full h-auto relative'>
          <div className='flex align-center justify-center'>
            <div className='dot1 bg-ezGreen rounded-full m-2'></div>
            <div className='dot2 bg-ezGreen rounded-full m-2'></div>
            <div className='dot3 bg-ezGreen rounded-full m-2'></div>
          </div>
        </div>
      ) : (
        !replies?.currentPage &&
        !replies?.totalPages && (
          <button
            onClick={() => getReplies({ page: 1 })}
            className='text-ezBlack text-sm my-3 w-full text-left'
          >
            View more replies...
          </button>
        )
      )}
    </div>
  );
};

export default Replies;
