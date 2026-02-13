import ChargingActivityCard from 'components/chargingActivity/ChargingActivityCard';
import Spiner from 'helper/Spiner';
import useApiHook from 'hooks/useApiHook';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ChargingActivity = () => {
  const { auth } = useSelector((state) => state);
  const { handleApiCall, isApiLoading } = useApiHook();
  const [chargings, setChargings] = useState([]);

  const getUserChargingActivity = async () => {
    const result = await handleApiCall({
      method: 'get',
      url: `charger/${auth?.userInfo?.user?._id}`,
    });
    if (result?.status === 200) {
      const sortedCharging = result.data?.charging?.sort((a, b) => {
        if (a.status === 'charging' && b.status !== 'charging') return -1;
        if (a.status !== 'charging' && b.status === 'charging') return 1;
        return 0;
      });
      setChargings(sortedCharging);
    }
  };

  useEffect(() => {
    getUserChargingActivity();
  }, []);

  return (
    <div className='ez__ChargingActivity w-full bg-ezMidWhite px-4 py-10 md:p-10'>
      <div className='ez__Title w-full flex items-center justify-between mb-8'>
        <h3 className='text-ezBlack text-xl'>Charging Activity</h3>
      </div>
      <div className='block w-full'>
        {isApiLoading && (
          <div className='col-span-3 block w-full h-96'>
            <Spiner color='ezGreen' />
          </div>
        )}
        {chargings?.length > 0 ? (
          chargings?.map((card) => (
            <ChargingActivityCard
              card={card}
              key={`ChargingActivityKey${card?._id}`}
            />
          ))
        ) : (
          <div className='w-full flex items-center justify-center flex-col py-32'>
            <img
              src='/assets/svgs/noCharging.svg'
              alt='No Trip'
              className='w-32 md:w-56 h-auto mb-5'
            />
            <p className='text-ezGray text-sm md:text-base mb-5'>
              There is no charging activity
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChargingActivity;
