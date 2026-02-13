import { Disclosure } from '@headlessui/react';
import { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { MdOutlineCancel } from 'react-icons/md';

const faqs = [
  {
    question: 'How can we help?',
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    question: 'How much we charge?',
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    question: 'How many station ezVoltz have?',
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    question: 'What is payment conditions?',
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
];

export default function FAQ() {
  const [isCancel, setIsCancel] = useState(false);
  return (
    <div className='ez__Settings w-full bg-ezMidWhite px-4 py-10 md:p-10'>
      <div className='ez__Title w-full flex md:items-center justify-between mb-8 flex-col md:flex-row'>
        <h3 className='text-ezBlack text-xl mb-3 md:mb-0'>
          Frequently Ask Questions
        </h3>
      </div>
      <div className='bg-white p-5 md:p-10'>
        {!isCancel && (
          <div className='card block w-full p-5 relative mb-10 '>
            <button
              className='text-ezGreen absolute top-5 right-5'
              type='button'
              onClick={() => setIsCancel(true)}
            >
              <MdOutlineCancel className='w-4 h-4' />
            </button>
            <h6 className='text-base font-bold mb-3'>What is ezVOLTz.com?</h6>
            <p className='text-ezGray text-sm'>
              Lorem ipsum dolor sit amet consectetur. Donec eget eu faucibus
              magna id senectus. In pharetra pretium vitae diam justo leo
              pellentesque. Nibh tortor turpis aliquet etiam. Laoreet et
              pharetra elit volutpat enim mauris Know about more?
            </p>
          </div>
        )}
        <dl className='space-y-3'>
          {faqs.map((faq) => (
            <Disclosure
              as='div'
              key={faq.question}
              className='border border-ezGray p-3 md:p-5 rounded-md'
            >
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className='flex w-full items-start justify-between text-left text-gray-900'>
                      <span
                        className={`${
                          open ? 'text-ezGreen' : 'text-ezBlack'
                        }  text-sm md:text-base font-semibold`}
                      >
                        {faq.question}
                      </span>
                      <span className='ml-6 flex h-7 items-center'>
                        {open ? (
                          <AiOutlineMinus className='h-5 w-5' />
                        ) : (
                          <AiOutlinePlus className='h-5 w-5' />
                        )}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as='dd' className='mt-5'>
                    <p className='text-sm text-ezGray'>{faq.answer}</p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </dl>
      </div>
    </div>
  );
}
