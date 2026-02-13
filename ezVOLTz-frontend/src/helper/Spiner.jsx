const Spiner = ({ color }) => {
  return (
    <div className='flex items-center justify-center w-full h-full spinner'>
      <div className={`dot1 bg-${color} rounded-full m-2`}></div>
      <div className={`dot2 bg-${color} rounded-full m-2`}></div>
      <div className={`dot3 bg-${color} rounded-full m-2`}></div>
    </div>
  );
};

export default Spiner;
