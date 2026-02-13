import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Select from 'react-select';
import Spiner from 'helper/Spiner';
import { MdCancel } from 'react-icons/md';
import { FileUploader } from 'react-drag-drop-files';
import { colourStyles } from 'helper/helper';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import useApiHook from 'hooks/useApiHook';

export default function UpdateVehicle({
  editedVehicle,
  isVehicleUpdate,
  setIsVehicleUpdate,
  getMyVehicles,
}) {
  const { auth } = useSelector((state) => state);
  const cancelButtonRef = useRef(null);
  const { handleApiCall, isApiLoading } = useApiHook();
  const [manufactureList, setManufactureList] = useState([]);
  const [models, setModels] = useState([]);
  const [file, setFile] = useState(null);
  const [isImagePreview, setIsImagePreview] = useState({
    isPreview: true,
    url: editedVehicle?.picture,
  });
  const [formValues, setFormValues] = useState({
    make: editedVehicle?.make?._id,
    model: editedVehicle?.model?._id,
    range: editedVehicle?.range,
  });

  const handleImagePreview = (file) => {
    setFile(file);
    const url = URL.createObjectURL(file);
    setIsImagePreview({
      isPreview: true,
      url,
    });
  };

  const handleReset = () => {
    setFormValues({
      make: null,
      model: null,
      range: null,
    });
    setIsImagePreview({
      isPreview: false,
      url: '',
    });
    setFile(null);
    setManufactureList([]);
    setModels([]);
  };

  const getVehicleManufacture = async () => {
    const result = await handleApiCall({
      method: 'get',
      url: '/vehicle-manufacture',
    });
    if (result?.status === 200) {
      setManufactureList(result?.data?.vehicleManufactur);
      setModels(
        result?.data?.vehicleManufactur?.filter(
          (make) => make?._id === editedVehicle?.make?._id
        )[0]?.models || []
      );
    }
  };

  const handleUpdateVehicle = async () => {
    if (!formValues?.make || !formValues?.model)
      return toast.error('All fields are required!');
    let data;
    let headers = {
      'Content-Type': 'application/json',
    };
    if (file) {
      data = new FormData();
      data.append('make', formValues?.make);
      data.append('model', formValues?.model);
      data.append(
        'range',
        formValues?.range ||
          models?.filter((model) => model?._id === formValues?.model)[0]?.range
      );
      data.append('image', file);
      headers = {
        'Content-Type': 'multipart/form-data',
      };
    } else {
      data = {
        make: formValues?.make,
        model: formValues?.model,
        range:
          formValues?.range ||
          models?.filter((model) => model?._id === formValues?.model)[0]?.range,
      };
    }

    const result = await handleApiCall({
      method: 'patch',
      url: `/vehicle/${auth?.userInfo?.user?._id}/${editedVehicle?._id}`,
      data,
      headers,
    });
    if (result?.status === 200) {
      toast.success(result?.data?.message);
      setIsVehicleUpdate(false);
      handleReset();
      getMyVehicles(result?.data?.vehicle);
    }
  };

  useEffect(() => {
    getVehicleManufacture();
  }, []);

  return (
    <Transition.Root show={isVehicleUpdate || false} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={() => setIsVehicleUpdate(true)}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center py-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='w-full relative transform bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                <div className='ez__StepForm w-full bg-white p-0'>
                  <div className='ez__PlanTripHead w-full bg-ezGreen py-4 px-4 md:px-12 flex items-center justify-between'>
                    <p className='text-white'>Update Vehicle</p>{' '}
                    <button
                      type='button'
                      onClick={() => {
                        setIsVehicleUpdate(false);
                        handleReset();
                      }}
                      className='bg-white text-ezGreen rounded-full'
                    >
                      <MdCancel className='w-8 h-8' />
                    </button>
                  </div>
                  <div className='ez__Form w-full grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 py-16 px-8'>
                    <div className='ez__VehicleImage block w-full'>
                      {isImagePreview?.isPreview && isImagePreview?.url ? (
                        <div className='relative border-2 border-ezGreen rounded-xl w-full h-full'>
                          <img
                            src={isImagePreview?.url}
                            alt='Vehicle'
                            className='w-full h-full object-cover rounded-xl'
                          />
                          <button
                            onClick={() => {
                              setFile(null);
                              setIsImagePreview({
                                isPreview: false,
                                url: '',
                              });
                            }}
                            className='absolute -top-2 -right-2 bg-white rounded-full'
                          >
                            <MdCancel className='w-5 h-5 text-ezRed' />
                          </button>
                        </div>
                      ) : (
                        <FileUploader
                          handleChange={handleImagePreview}
                          name='file'
                          types={['JPG', 'JPEG', 'PNG', 'GIF']}
                        />
                      )}
                    </div>
                    <div className='block w-full'>
                      <div className='block mb-5 w-full'>
                        <label
                          htmlFor='make'
                          className='block mb-1 text-sm md:text-base text-ezBlack'
                        >
                          Select Make*
                        </label>
                        <Select
                          className={`basic-single mb-4 ${
                            manufactureList?.length <= 0 ? 'disableSelect' : ''
                          }`}
                          classNamePrefix='select'
                          placeholder='Select Make'
                          isClearable={true}
                          isSearchable={true}
                          name='make'
                          styles={colourStyles}
                          value={
                            formValues?.make && {
                              label: manufactureList?.filter(
                                (vehicle) => vehicle?._id === formValues?.make
                              )[0]?.make,
                              value: formValues?.make,
                            }
                          }
                          onChange={(e) => {
                            setFormValues({
                              ...formValues,
                              make: e?.value,
                              model: '',
                              range: '',
                            });
                            setModels(
                              manufactureList?.filter(
                                (model) => model?._id === e?.value
                              )[0]?.models || []
                            );
                          }}
                          options={manufactureList?.map((vehicle) => {
                            return {
                              label: vehicle?.make,
                              value: vehicle?._id,
                            };
                          })}
                        />
                      </div>
                      <div className='block mb-5 w-full'>
                        <label
                          htmlFor='model'
                          className='block mb-1 text-sm md:text-base text-ezBlack'
                        >
                          Select Model*
                        </label>
                        <Select
                          className={`basic-single mb-4 ${
                            models?.length <= 0 ? 'disableSelect' : ''
                          }`}
                          classNamePrefix='select'
                          placeholder='Select Model'
                          isClearable={true}
                          isSearchable={true}
                          styles={colourStyles}
                          name='model'
                          value={
                            formValues?.model && {
                              label: models?.filter(
                                (model) => model?._id === formValues?.model
                              )[0]?.model,
                              value: formValues?.model,
                            }
                          }
                          onChange={(e) => {
                            setFormValues({
                              ...formValues,
                              model: e?.value,
                              range: '',
                            });
                          }}
                          isDisabled={models?.length <= 0 ? true : false}
                          options={models?.map((model) => {
                            return {
                              label: model?.model,
                              value: model?._id,
                            };
                          })}
                        />
                      </div>
                      <div className='block mb-5 w-full'>
                        <label
                          htmlFor='make'
                          className='block mb-1 text-sm md:text-base text-ezBlack'
                        >
                          Enter Range
                        </label>
                        <input
                          type='number'
                          value={formValues?.range}
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              range: e?.target?.value,
                            })
                          }
                          placeholder='Vehicle Range'
                          className='block w-full mb-4 border border-ezGray py-4 text-base text-ezGreen px-3 rounded-md'
                        />
                      </div>
                      <div className='block'>
                        <button
                          type='submit'
                          disabled={isApiLoading}
                          onClick={handleUpdateVehicle}
                          className={`py-4 text-base text-white border border-ezGreen bg-ezGreen rounded-md block w-full text-center ${
                            isApiLoading
                              ? 'cursor-wait'
                              : 'hover:bg-transparent'
                          } hover:text-ezGreen`}
                        >
                          {isApiLoading ? (
                            <Spiner color='white' />
                          ) : (
                            'Update Vehicle'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
