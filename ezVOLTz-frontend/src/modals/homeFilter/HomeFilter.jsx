import { Fragment, useRef, useState } from 'react';
import { Dialog, Switch, Transition } from '@headlessui/react';
import Select from 'react-select';
import { colourStyles } from 'helper/helper';
import {
  evConnectorTypes,
  evNetworkTypes,
  fuelTypes,
  ownerTypes,
} from 'helper/nrelData';
import { MdCancel } from 'react-icons/md';

export default function HomeFilter({
  formValues,
  setFormValues,
  isFilterModal,
  setIsFilterModal,
  applyFilters,
  resetFilter,
}) {
  const cancelButtonRef = useRef(null);
  const [values, setValues] = useState(formValues);

  const handleFilters = () => {
    setFormValues(values);
    applyFilters(values);
  };

  return (
    <Transition.Root show={isFilterModal || false} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={() => setIsFilterModal(true)}
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
              <Dialog.Panel className='w-full rounded-md relative transform overflow-hidden bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl'>
                <div className='headerFormSelect bg-white p-0'>
                  <div className='ez__PlanTripHead w-full bg-ezGreen py-4 px-4 md:px-12 flex items-center justify-between'>
                    <p className='text-white text-xl'>Filter</p>
                    <button
                      type='button'
                      onClick={() => setIsFilterModal(false)}
                      className='bg-white text-ezGreen rounded-full'
                    >
                      <MdCancel className='w-8 h-8' />
                    </button>
                  </div>

                  <div className='ez__Body w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-12'>
                    <div className='relative w-full text-sm text-ezGray'>
                      <label
                        htmlFor='fuel'
                        className='text-ezGray text-sm mb-1 block'
                      >
                        Fuel Type
                      </label>
                      <Select
                        className='basic-single'
                        classNamePrefix='select'
                        placeholder='Fuel'
                        isSearchable={true}
                        styles={colourStyles}
                        id='fuel'
                        name='fuel'
                        value={
                          values?.fuel && {
                            label: fuelTypes?.filter(
                              (fuel) => fuel?.value === values.fuel
                            )[0]?.title,
                            value: values.fuel,
                          }
                        }
                        onChange={(e) =>
                          setValues({ ...values, fuel: e?.value })
                        }
                        options={fuelTypes?.map((fuel) => {
                          return {
                            label: fuel?.title,
                            value: fuel?.value,
                          };
                        })}
                      />
                    </div>
                    <div className='relative w-full text-sm text-ezGray'>
                      <label
                        htmlFor='owner'
                        className='text-ezGray text-sm mb-1 block'
                      >
                        Owner Type
                      </label>
                      <Select
                        className='basic-single'
                        classNamePrefix='select'
                        placeholder='Owner'
                        isSearchable={true}
                        styles={colourStyles}
                        name='owner'
                        value={
                          values?.owner && {
                            label: ownerTypes?.filter(
                              (owner) => owner?.value === values.owner
                            )[0]?.title,
                            value: values.owner,
                          }
                        }
                        onChange={(e) =>
                          setValues({ ...values, owner: e?.value })
                        }
                        options={ownerTypes?.map((owner) => {
                          return {
                            label: owner?.title,
                            value: owner?.value,
                          };
                        })}
                      />
                    </div>
                    <div className='relative w-full text-sm text-ezGray'>
                      <label
                        htmlFor='network'
                        className='text-ezGray text-sm mb-1 block'
                      >
                        Network Type
                      </label>
                      <Select
                        className='basic-single'
                        classNamePrefix='select'
                        placeholder='Select Network'
                        isSearchable={true}
                        styles={colourStyles}
                        name='network'
                        value={
                          values?.network && {
                            label: evNetworkTypes?.filter(
                              (network) => network?.value === values.network
                            )[0]?.title,
                            value: values?.network,
                          }
                        }
                        onChange={(e) =>
                          setValues({ ...values, network: e?.value })
                        }
                        options={evNetworkTypes?.map((network) => {
                          return {
                            label: network?.title,
                            value: network?.value,
                          };
                        })}
                      />
                    </div>
                    <div className='relative w-full text-sm text-ezGray'>
                      <label
                        htmlFor='connector'
                        className='text-ezGray text-sm mb-1 block'
                      >
                        Connector Type
                      </label>
                      <Select
                        className='basic-single'
                        classNamePrefix='select'
                        placeholder='Select Connector'
                        isSearchable={true}
                        styles={colourStyles}
                        name='connector'
                        value={
                          values?.connector && {
                            label: evConnectorTypes?.filter(
                              (connector) =>
                                connector?.value === values.connector
                            )[0]?.title,
                            value: values?.connector,
                          }
                        }
                        onChange={(e) =>
                          setValues({
                            ...values,
                            connector: e?.value,
                          })
                        }
                        options={evConnectorTypes?.map((connector) => {
                          return {
                            label: connector?.title,
                            value: connector?.value,
                          };
                        })}
                      />
                    </div>
                    <Switch.Group
                      as='div'
                      className='flex gap-x-4 justify-between items-center'
                    >
                      <Switch.Label className='cursor-pointer text-sm leading-6 text-ezGray'>
                        Show Private Stations
                      </Switch.Label>
                      <div className='flex h-6 items-center'>
                        <Switch
                          checked={values?.previousStation}
                          onChange={(value) =>
                            setValues({
                              ...values,
                              previousStation: value,
                            })
                          }
                          className={`${
                            values?.previousStation ? 'bg-ezGreen' : 'bg-ezGray'
                          } flex w-8 flex-none cursor-pointer rounded-full p-px transition-colors duration-200 ease-in-out`}
                        >
                          <span
                            aria-hidden='true'
                            className={`${
                              values?.previousStation
                                ? 'translate-x-3.5'
                                : 'translate-x-0'
                            } h-4 w-4 transform rounded-full bg-white shadow-sm  transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </Switch.Group>
                    <Switch.Group
                      as='div'
                      className='flex gap-x-4 justify-between items-center'
                    >
                      <Switch.Label className='cursor-pointer text-sm leading-6 text-ezGray'>
                        Include AC Level 1
                      </Switch.Label>
                      <div className='flex h-6 items-center'>
                        <Switch
                          checked={values?.ev_level1_evse_num}
                          onChange={(value) =>
                            setValues({
                              ...values,
                              ev_level1_evse_num: value,
                            })
                          }
                          className={`${
                            values?.ev_level1_evse_num
                              ? 'bg-ezGreen'
                              : 'bg-ezGray'
                          } flex w-8 flex-none cursor-pointer rounded-full p-px transition-colors duration-200 ease-in-out`}
                        >
                          <span
                            aria-hidden='true'
                            className={`${
                              values?.ev_level1_evse_num
                                ? 'translate-x-3.5'
                                : 'translate-x-0'
                            } h-4 w-4 transform rounded-full bg-white shadow-sm  transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </Switch.Group>
                    <Switch.Group
                      as='div'
                      className='flex gap-x-4 justify-between items-center'
                    >
                      <Switch.Label className='cursor-pointer text-sm leading-6 text-ezGray'>
                        Include AC Level 2
                      </Switch.Label>
                      <div className='flex h-6 items-center'>
                        <Switch
                          checked={values?.ev_level2_evse_num}
                          onChange={(value) =>
                            setValues({
                              ...values,
                              ev_level2_evse_num: value,
                            })
                          }
                          className={`${
                            values?.ev_level2_evse_num
                              ? 'bg-ezGreen'
                              : 'bg-ezGray'
                          } flex w-8 flex-none cursor-pointer rounded-full p-px transition-colors duration-200 ease-in-out`}
                        >
                          <span
                            aria-hidden='true'
                            className={`${
                              values?.ev_level2_evse_num
                                ? 'translate-x-3.5'
                                : 'translate-x-0'
                            } h-4 w-4 transform rounded-full bg-white shadow-sm  transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </Switch.Group>
                    <Switch.Group
                      as='div'
                      className='flex gap-x-4 justify-between items-center'
                    >
                      <Switch.Label className='cursor-pointer text-sm leading-6 text-ezGray'>
                        Include DC Fast
                      </Switch.Label>
                      <div className='flex h-6 items-center'>
                        <Switch
                          checked={values?.ev_dc_fast_num}
                          onChange={(value) =>
                            setValues({
                              ...values,
                              ev_dc_fast_num: value,
                            })
                          }
                          className={`${
                            values?.ev_dc_fast_num ? 'bg-ezGreen' : 'bg-ezGray'
                          } flex w-8 flex-none cursor-pointer rounded-full p-px transition-colors duration-200 ease-in-out`}
                        >
                          <span
                            aria-hidden='true'
                            className={`${
                              values?.ev_dc_fast_num
                                ? 'translate-x-3.5'
                                : 'translate-x-0'
                            } h-4 w-4 transform rounded-full bg-white shadow-sm  transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </Switch.Group>
                    <Switch.Group
                      as='div'
                      className='flex gap-x-4 justify-between items-center'
                    >
                      <Switch.Label className='cursor-pointer text-sm leading-6 text-ezGray'>
                        Available Chargers
                      </Switch.Label>
                      <div className='flex h-6 items-center'>
                        <Switch
                          checked={values?.status}
                          onChange={(value) =>
                            setValues({
                              ...values,
                              status: value,
                            })
                          }
                          className={`${
                            values?.status ? 'bg-ezGreen' : 'bg-ezGray'
                          } flex w-8 flex-none cursor-pointer rounded-full p-px transition-colors duration-200 ease-in-out`}
                        >
                          <span
                            aria-hidden='true'
                            className={`${
                              values?.status
                                ? 'translate-x-3.5'
                                : 'translate-x-0'
                            } h-4 w-4 transform rounded-full bg-white shadow-sm  transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </Switch.Group>
                    <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <button
                        type='button'
                        onClick={() => resetFilter(values)}
                        className='mx-auto text-ezGreen bg-transparent hover:bg-transparent hover:text-ezGreen w-full py-3 border border-ezGreen rounded-md block'
                      >
                        Reset
                      </button>
                      <button
                        type='button'
                        onClick={handleFilters}
                        className='mx-auto block text-white bg-ezGreen hover:bg-transparent hover:text-ezGreen w-full py-3 border border-ezGreen rounded-md'
                      >
                        Done
                      </button>
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
