import { object, string } from 'yup';

export const addReplySchema = object({
  userId: string().required('User id is required'),
  reviewId: string().required('Review id is required'),
  comment: string().required('Comment is required'),
});

export const updateReplySchema = object({
  replyId: string().required('Reply id is required'),
  userId: string().required('User id is required'),
  reviewId: string().required('Review id is required'),
  comment: string().required('Comment is required'),
});
