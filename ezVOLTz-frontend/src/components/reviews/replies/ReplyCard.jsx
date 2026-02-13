import { dateAgo } from 'helper/functionality';
import useApiHook from 'hooks/useApiHook';
import { useSelector } from 'react-redux';
import LikeAndDislikeReply from '../actions/LikeAndDislikeReply';
import { FaPencilAlt } from 'react-icons/fa';
import { useState } from 'react';
import ReplyUpdateForm from '../ReplyUpdateForm';
import Avatar from 'react-avatar';

const ReplyCard = ({
  reply,
  review,
  setReviews,
  reviews,
  isUserAuthenticated,
}) => {
  const { handleApiCall } = useApiHook();
  const { auth } = useSelector((state) => state);
  const [isReplyUpdate, setIsReplyUpdate] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  const likeDislikeReply = async (data) => {
    let reviewInd, replyInd;
    reviews?.reviews?.map((isReview, reviewIndLoop) => {
      if (isReview?._id === data?.reviewId) {
        isReview?.reply?.map((isReply, replyIndLoop) => {
          if (isReply?._id === data?.replyId) {
            reviewInd = reviewIndLoop;
            replyInd = replyIndLoop;
          }
        });
      }
    });
    if (data?.like) {
      reviews.reviews[reviewInd].reply[replyInd] = {
        ...reviews?.reviews[reviewInd].reply[replyInd],
        like: [
          ...reviews?.reviews[reviewInd].reply[replyInd]?.like?.filter(
            (like) => like !== data?.userId
          ),
          data?.userId,
        ],
      };
    } else {
      reviews.reviews[reviewInd].reply[replyInd] = {
        ...reviews?.reviews[reviewInd].reply[replyInd],
        like: [
          ...reviews?.reviews[reviewInd].reply[replyInd]?.like?.filter(
            (like) => like !== data?.userId
          ),
        ],
      };
    }
    let updatedReviews = { ...reviews };
    setReviews(updatedReviews);
    await handleApiCall({
      method: 'post',
      url: `reviews/reply/like-dislike`,
      data,
    });
  };

  return (
    <div className='reviewCard block w-full mb-5'>
      <div className='replyFlexCard flex relative'>
        {!isImageError && reply?.user?.profileImage ? (
          <img
            src={reply?.user?.profileImage}
            alt='Profile Prview'
            onError={() => setIsImageError(true)}
            className='w-8 h-8 rounded-full mr-3'
          />
        ) : null}
        {isImageError && (
          <Avatar size={30} name={reply?.user?.name} round className='mr-3' />
        )}
        <div className='contentDiv'>
          <div className='w-full flex  justify-between'>
            <h4 className='text-ezBlack font-bold text-sm'>
              {reply?.user?.name}
            </h4>
            <div className='flex items-center'>
              <p className='text-xs text-ezGray'>{dateAgo(reply.createdAt)}</p>
              {isUserAuthenticated &&
                reply?.user?.userId === auth?.userInfo?.user?._id && (
                  <>
                    <span className='bg-ezGray w-1 h-1 rounded-full mx-2' />
                    <button
                      type='button'
                      onClick={() => setIsReplyUpdate(!isReplyUpdate)}
                      className='flex text-sm text-ezGray hover:text-ezGreen'
                    >
                      <FaPencilAlt className='w-3 h-3' />
                    </button>
                  </>
                )}
            </div>
          </div>

          {isReplyUpdate ? (
            <ReplyUpdateForm
              reply={reply}
              review={review}
              setReviews={setReviews}
              reviews={reviews}
              userInfo={auth?.userInfo}
              setIsReplyUpdate={setIsReplyUpdate}
            />
          ) : (
            <>
              <p className='text-ezGray text-xs md:text-sm'>{reply?.comment}</p>
              <div className='actionDiv flex items-center justify-between my-2'>
                <div className='actionBtns flex items-center'>
                  <LikeAndDislikeReply
                    reply={reply}
                    review={review}
                    userInfo={auth?.userInfo}
                    likeDislikeReply={likeDislikeReply}
                    isUserAuthenticated={isUserAuthenticated}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;
