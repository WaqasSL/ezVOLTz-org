import { checkUserAuthenticated, dateAgo } from 'helper/functionality';
import useApiHook from 'hooks/useApiHook';
import { useSelector } from 'react-redux';
import LikeAndDislikeReview from './actions/LikeAndDislikeReview';
import { useState } from 'react';
import Replies from './replies/Replies';
import ReplyForm from './ReplyForm';
import ReviewImagesModal from 'modals/review/ReviewImagesModal';
import { FaPencilAlt } from 'react-icons/fa';
import Avatar from 'react-avatar';

const ReviewCard = ({
  review,
  setReviews,
  reviews,
  setIsEditReview,
  isUserAuthenticated,
}) => {
  const { auth } = useSelector((state) => state);
  const { handleApiCall } = useApiHook();
  const [isReply, setIsReply] = useState(false);
  const [isReviewImageModal, setIsReviewImageModal] = useState(false);
  const [reviewImages, setReviewImages] = useState([]);
  const [replies, setReplies] = useState(null);
  const [isImageError, setIsImageError] = useState(false);

  const likeDislikeReiew = async (data) => {
    if (data?.like) {
      setReviews({
        ...reviews,
        reviews: reviews?.reviews?.map((isReview) =>
          isReview?._id === data?.reviewId
            ? {
                ...review,
                like: [
                  ...review?.like?.filter((like) => like !== data?.userId),
                  data?.userId,
                ],
              }
            : isReview
        ),
      });
    } else {
      setReviews({
        ...reviews,
        reviews: reviews?.reviews?.map((isReview) =>
          isReview?._id === data?.reviewId
            ? {
                ...review,
                like: review?.like?.filter((like) => like !== data?.userId),
              }
            : isReview
        ),
      });
    }
    await handleApiCall({
      method: 'post',
      url: `review/like-dislike`,
      data,
    });
  };

  return (
    <div className='reviewCard block w-full mb-8'>
      <div className='reviewFlexCard flex relative'>
        {!isImageError && review?.user?.profileImage ? (
          <img
            src={review?.user?.profileImage}
            alt='Profile Prview'
            onError={() => setIsImageError(true)}
            className='w-8 h-8 rounded-full mr-3'
          />
        ) : !isImageError ? (
          <Avatar size={30} name={review?.user?.name} round className='mr-3' />
        ) : null}
        {isImageError && (
          <Avatar size={30} name={review?.user?.name} round className='mr-3' />
        )}
        <div className='contentDiv'>
          <div className='w-full flex items-center justify-between'>
            <div className='flex items-center mb-2'>
              <h4 className='text-ezBlack font-bold text-sm'>
                {review?.user?.name}
              </h4>
              <span className='bg-ezGreen w-1 h-1 rounded-full mx-3' />
              {review?.rating && (
                <div className='ratingView text-ezBlack text-sm text-bold flex items-center'>
                  <img
                    src='/assets/svgs/star.svg'
                    alt=''
                    className='w-3.5 h-auto mr-1 mb-0.5'
                  />{' '}
                  {review?.rating}
                </div>
              )}
            </div>
            <div className='flex items-center'>
              <p className='text-xs text-ezGray'>
                {dateAgo(review?.createdAt)}
              </p>
              {isUserAuthenticated &&
                review?.user?.userId === auth?.userInfo?.user?._id && (
                  <>
                    <span className='bg-ezGray w-1 h-1 rounded-full mx-2' />
                    <button
                      type='button'
                      onClick={() =>
                        setIsEditReview({ isModal: true, data: review })
                      }
                      className='flex text-sm text-ezGray hover:text-ezGreen'
                    >
                      <FaPencilAlt className='w-3 h-3' />
                    </button>
                  </>
                )}
            </div>
          </div>
          <p className='text-ezGray text-xs md:text-sm'>{review?.comment}</p>
          {review?.images?.length > 0 && (
            <div className='flex items-center flex-wrap'>
              {review?.images?.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt=''
                  onClick={() => {
                    setReviewImages(review?.images);
                    setIsReviewImageModal(true);
                  }}
                  className='w-16 h-16 object-cover m-2 rounded-md ml-0 cursor-pointer'
                />
              ))}
            </div>
          )}
          <div className='actionDiv flex items-center justify-between my-5'>
            <div className='actionBtns flex items-center'>
              <LikeAndDislikeReview
                review={review}
                userInfo={auth?.userInfo}
                likeDislikeReiew={likeDislikeReiew}
                isUserAuthenticated={isUserAuthenticated}
              />
              {isUserAuthenticated && (
                <>
                  <span className='bg-ezGray w-1 h-1 rounded-full mx-2' />
                  <button
                    onClick={() => setIsReply(!isReply)}
                    className='bg-transparent border-0 text-ezGreen text-xs'
                  >
                    Reply
                  </button>
                </>
              )}
            </div>
          </div>
          {isUserAuthenticated && isReply && (
            <ReplyForm
              review={review}
              reviews={reviews}
              userInfo={auth?.userInfo}
              setReviews={setReviews}
              setIsReply={setIsReply}
              setReplies={setReplies}
            />
          )}
          {review?.reply?.length > 0 && (
            <Replies
              review={review}
              setReviews={setReviews}
              reviews={reviews}
              replies={replies}
              setReplies={setReplies}
              isUserAuthenticated={isUserAuthenticated}
            />
          )}
        </div>
      </div>
      {isReviewImageModal && (
        <ReviewImagesModal
          isReviewImageModal={isReviewImageModal}
          setIsReviewImageModal={setIsReviewImageModal}
          images={reviewImages}
        />
      )}
    </div>
  );
};

export default ReviewCard;
