import { Autocomplete } from '@react-google-maps/api';
import React, { useEffect, useRef } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { MdCancel, MdLocationOn } from 'react-icons/md';

const RescheduleStopInput = ({
  index,
  between,
  handleBetween,
  setFormValues,
  formValues,
  goToLastStep,
}) => {
  const stopRef = useRef();

  useEffect(() => {
    if (formValues?.inBetween?.length > 0) {
      formValues?.inBetween?.map((stop) => {
        if (stop?.id === between?.id) stopRef.current.value = stop?.value;
      });
    }
  }, []);

  return (
    <div className='relative w-full block'>
      <Autocomplete
        onPlaceChanged={() =>
          handleBetween(between?.id, stopRef?.current?.value)
        }
      >
        <div className='ez__FormInput w-full flex items-center justify-between border border-ezGreen rounded-md p-4 mb-4'>
          <input
            type='text'
            id='stop'
            placeholder={`Choose Stop ${index + 1}`}
            className='text-base text-ezGray'
            onChange={(e) => handleBetween(between?.id, e?.target?.value)}
            ref={stopRef}
          />

          {!between?.value && (
            <button
              onClick={() =>
                goToLastStep({
                  origin: formValues.startFrom,
                  destination: formValues.destination,
                  step: 3,
                  previousStep: 1,
                })
              }
              className='text-ezGreen text-2xl cursor-pointer'
            >
              <MdLocationOn className='w-5 h-5 text-ezGreen' />
            </button>
          )}
          <button
            onClick={() =>
              setFormValues({
                ...formValues,
                inBetween: formValues?.inBetween?.filter(
                  (item) => item?.id !== between?.id
                ),
              })
            }
            className='text-ezGreen text-2xl cursor-pointer -mr-2'
          >
            <BsTrash className='w-4 h-4 text-ezRed' />
          </button>
        </div>
      </Autocomplete>
    </div>
  );
};

export default RescheduleStopInput;
