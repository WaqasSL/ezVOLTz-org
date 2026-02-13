import { object, string } from 'yup';

export const submitAdSchema = object({
  title: string().required('Company name is required'),
  company: string().required('Campaign name is required'),
  heading: string().required('Ad heading is required.'),
  link: string().required('Company link is required.')
});