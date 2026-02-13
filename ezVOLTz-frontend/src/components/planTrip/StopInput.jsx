import { Autocomplete } from '@react-google-maps/api';
import React, { useEffect, useRef } from 'react';
import { BsTrash } from 'react-icons/bs';

const StopInput = ({
  index,
  between,
  handleBetween,
  setFormValues,
  formValues,
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
            id={`stop${index}`}
            placeholder='Choose Stop'
            className='text-base text-ezGray'
            onChange={(e) => handleBetween(between?.id, e?.target?.value)}
            ref={stopRef}
          />
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

export default StopInput;
