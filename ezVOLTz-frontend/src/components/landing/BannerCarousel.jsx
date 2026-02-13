import React, { useState } from 'react';

const data = [
  {
    id: 0,
    img: '/assets/images/banner/banner1.png',
  },
  {
    id: 1,
    img: '/assets/images/banner/banner2.png',
  },
  {
    id: 2,
    img: '/assets/images/banner/banner3.png',
  },
];

function BannerCarousel() {
  const [activeID, setActiveID] = useState(0);
  const [wrapperStyle, setWrapperStyle] = useState({
    backgroundImage: `url('${data[0].img}')`,
  });

  const changeActive = (id) => {
    setActiveID(id);
    setWrapperStyle({
      backgroundImage: `url('${data[id].img}')`,
    });
  };

  return (
    <section className='wrapper' style={wrapperStyle}>
      {/* <aside className='panel'>
        <img src={data[activeID]?.img} alt='Home Banner' />
      </aside> */}
      <div className='selectors'>
        {data.map((item) => (
          <div
            key={item.id}
            className={`${
              activeID === item?.id ? 'selector active' : 'selector'
            }`}
            onClick={() => activeID !== item.id && changeActive(item.id)}
          >
            <span />
          </div>
        ))}
      </div>
    </section>
  );
}

export default BannerCarousel;
