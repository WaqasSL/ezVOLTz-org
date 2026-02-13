import useApiHook from 'hooks/useApiHook';
import ReviewModal from 'modals/review/ReviewModal';
import { useEffect, useState } from 'react';
import ReviewUpdateModal from 'modals/review/ReviewUpdateModal';
import ReviewCard from './ReviewCard';
import {
  checkUserAuthenticated,
  initialReviewUpdateValues,
} from 'helper/functionality';
import { useSelector } from 'react-redux';

const Reviews = ({ detail, stationType }) => {
  const { auth } = useSelector((state) => state);
  const isUserAuthenticated = checkUserAuthenticated(auth?.userInfo);
  const { handleApiCall } = useApiHook();
  const [reviews, setReviews] = useState({ reviews: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [isEditReview, setIsEditReview] = useState(initialReviewUpdateValues);
  const [pagination] = useState({ limit: 5, page: 1 });

  const getReiews = async ({ page }) => {
    setIsLoading(true);
    const result = await handleApiCall({
      method: 'get',
      url: `review/all/${detail?.id}/${stationType}?limit=${pagination?.limit}&page=${page}`,
      headers: { Authorization: 'none ' },
    });
    setIsLoading(false);
    if (result?.status === 200)
      setReviews({
        ...result?.data,
        reviews:
          page === 1
            ? result?.data?.reviews
            : [...reviews?.reviews, ...result?.data?.reviews],
      });
  };

  useEffect(() => {
    getReiews({ page: 1 });
  }, []);

  return (
    <>
      <div className='ezTabDiv reviewDiv p-4 relative'>
        <div className='ezTitleReview flex items-center justify-between'>
          <h5 className='text-ezGray text-base'>Comments</h5>
          {reviews?.reviewsAverage?.average && (
            <div className='ratingView text-ezBlack text-bold flex items-center'>
              <img
                src='/assets/svgs/star.svg'
                alt=''
                className='w-4 h-auto mr-2 mb-0.5'
              />{' '}
              <span>
                {reviews?.reviewsAverage?.average} (
                {reviews?.reviewsAverage?.count})
              </span>
            </div>
          )}
        </div>
        {reviews?.reviews?.length > 0 ? (
          <div className='relative noCommentDiv w-full flex items-center justify-center py-4 md:p-8 md:pb-20 flex-col'>
            {reviews?.reviews?.map((review) => (
              <ReviewCard
                key={review?._id}
                review={review}
                reviews={reviews}
                setReviews={setReviews}
                getReiews={getReiews}
                isEditReview={isEditReview}
                setIsEditReview={setIsEditReview}
                isUserAuthenticated={isUserAuthenticated}
              />
            ))}
            {isLoading ? (
              <div className='w-full h-auto relative'>
                <div className='flex align-center justify-center'>
                  <div className='dot1 bg-ezGreen rounded-full m-2'></div>
                  <div className='dot2 bg-ezGreen rounded-full m-2'></div>
                  <div className='dot3 bg-ezGreen rounded-full m-2'></div>
                </div>
              </div>
            ) : (
              reviews?.currentPage !== reviews?.totalPages && (
                <button
                  onClick={() => getReiews({ page: reviews?.currentPage + 1 })}
                  className='text-ezBlack text-sm my-3 w-full text-left'
                >
                  View more comments...
                </button>
              )
            )}
          </div>
        ) : isLoading ? (
          <div className='w-full h-32 relative'>
            <div className='w-full h-full flex items-end justify-center'>
              <div className='dot1 bg-ezGreen rounded-full m-2'></div>
              <div className='dot2 bg-ezGreen rounded-full m-2'></div>
              <div className='dot3 bg-ezGreen rounded-full m-2'></div>
            </div>
          </div>
        ) : (
          <div className='noCommentDiv flex items-center justify-center pb-10 py-4 md:p-8 flex-col'>
            <img
              src='/assets/images/noComment.png'
              alt=''
              className='w-32 md:w-56 h-auto my-8'
            />
            <h5 className='text-ezGray text-base md:text-xl mb-2'>
              No comment yet
            </h5>
            <p className='text-ezGray text-sm md:text-base mb-8'>
              Be the first to comment
            </p>
          </div>
        )}
        {isUserAuthenticated && (
          <div className='w-full flex bg-white p-5 fixed bottom-0 left-0 z-10'>
            <button
              onClick={() => setIsReview(true)}
              className='relative ezReviewBtn w-full text-center border border-ezGreen p-2 rounded-md text-sm md:text-base text-white bg-ezGreen'
            >
              Leave a comment
            </button>
          </div>
        )}
      </div>
      {isUserAuthenticated && isReview && (
        <ReviewModal
          isReview={isReview}
          setIsReview={setIsReview}
          detail={detail}
          stationType={stationType}
          getReiews={getReiews}
        />
      )}
      {isUserAuthenticated && isEditReview?.isModal && (
        <ReviewUpdateModal
          isEditReview={isEditReview}
          setIsEditReview={setIsEditReview}
          getReiews={getReiews}
          reviews={reviews}
          setReviews={setReviews}
        />
      )}
    </>
  );
};

export default Reviews;
