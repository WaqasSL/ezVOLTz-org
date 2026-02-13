import { object, string } from 'yup';

export const submitFeedbackSchema = object({
  title: string().required('Title is required'),
  description: string().required('Description is required'),
  user: object({
    name: string().required('Name is required'),
    email: string().required('Email is required'),
  }),
});
