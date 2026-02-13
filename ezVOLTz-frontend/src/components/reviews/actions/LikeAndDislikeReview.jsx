import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';

const LikeAndDislikeReview = ({
  review,
  userInfo,
  likeDislikeReiew,
  isUserAuthenticated,
}) => {
  return (
    <div className='likesDiv flex items-center'>
      <div className='likeCount flex items-center group text-sm'>
        {review?.like?.includes(userInfo?.user?._id) ? (
          <button
            disabled={!isUserAuthenticated}
            className='bg-transparent border-0'
            onClick={() =>
              likeDislikeReiew({
                like: false,
                dislike: false,
                reviewId: review?._id,
                userId: userInfo?.user?._id,
              })
            }
          >
            <FaThumbsUp className='w-4 h-4  text-ezGreen ' />
          </button>
        ) : (
          <button
            disabled={!isUserAuthenticated}
            className='bg-transparent border-0'
            onClick={() =>
              likeDislikeReiew({
                like: true,
                dislike: false,
                reviewId: review?._id,
                userId: userInfo?.user?._id,
              })
            }
          >
            <FaRegThumbsUp className='w-4 h-4 text-ezGreen' />
          </button>
        )}
        <span className='count ml-1'>{review.like?.length}</span>
      </div>
    </div>
  );
};

export default LikeAndDislikeReview;
