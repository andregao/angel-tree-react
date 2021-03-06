import React, { useState } from 'react';

const OrnamentCollections = ({ variant, color }) => {
  const variantOptions = ['round', 'oval', 'star'];
  const colorOptions = [
    '#983843',
    '#cc231e',
    '#f5624d',
    '#F8B229',
    '#FCE43C',
    '#3A6671',
    '#FBF5E9',
    '#F6A9A9',
  ];
  const getRandomItem = collection =>
    collection[Math.floor(Math.random() * collection.length)];
  // keep random selection state
  const [randomConfig] = useState(() => ({
    variant: getRandomItem(variantOptions),
    color: getRandomItem(colorOptions),
  }));

  const config = {
    variant: variant || randomConfig.variant,
    color: color || randomConfig.color,
  };

  switch (config.variant) {
    case 'round':
      return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 35.81 44.74'>
          <circle cx='17.91' cy='26.83' r='17.91' fill={config.color} />
          <path
            d='M18.47,7.87l1,0c.73,0,1.45.05,2.17.11a5.93,5.93,0,0,1,1,.16,1.48,1.48,0,0,1,1,.54,1.51,1.51,0,0,1,.17.67c0,.32,0,.64,0,1v0c0,.15-.12.18-.5.14a8.78,8.78,0,0,0-2.35,0l-.46.08a1.46,1.46,0,0,1-.59,0,9,9,0,0,0-.91-.1,10.53,10.53,0,0,0-2.4.12,2.9,2.9,0,0,1-1.14,0,7,7,0,0,0-2.21-.09l-.51,0c-.28,0-.42,0-.49-.13a.85.85,0,0,1-.08-.17c-.11-.41-.22-.81-.31-1.22a.93.93,0,0,1,0-.37c0-.13.19-.23.45-.31a7,7,0,0,1,1.27-.25c1.06-.12,2.13-.2,3.23-.24h.28s0-.06,0-.09c0-.61-.05-1.21-.08-1.82L16.91,2.8c.9-5.57,1.2-1.12,1.2-1.12s.11,1.91.16,2.86c.05.79.09,1.58.13,2.38,0,.29,0,.58.05.87A.24.24,0,0,0,18.47,7.87Z'
            fill='#cccbcb'
          />
        </svg>
      );
    case 'oval':
      return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.48 44.63'>
          <ellipse
            cx='11.74'
            cy='27.14'
            rx='11.74'
            ry='17.49'
            fill={config.color}
          />
          <path
            d='M17.43,6.15V5.28c0-.37,0-.74,0-1.11,0-1.41.1-3.84.75-3.89s0,2.05.06,3.07L18.28,6s0,.06,0,.11l.17,0a12.55,12.55,0,0,1,1.92.22,2,2,0,0,1,.77.36,1.43,1.43,0,0,1,.51.81,5.65,5.65,0,0,1,.11.7c0,.48,0,.95,0,1.42,0,.27,0,.53,0,.8v.1c0,.27-.07.33-.32.25a2.29,2.29,0,0,0-1.84.24.33.33,0,0,1-.36,0,2.69,2.69,0,0,0-2.19,0c-.41.15-.37.17-.77-.06a1.78,1.78,0,0,0-1.28-.18l-.39.09c-.27.05-.39,0-.44-.31s-.1-.77-.14-1.16S14,8.67,14,8.26c0-.2,0-.41,0-.61A.8.8,0,0,1,14.34,7a2.56,2.56,0,0,1,1-.49,11.12,11.12,0,0,1,2-.36Z'
            transform='translate(-6.14 -0.28)'
            fill='#cccbcb'
          />
        </svg>
      );
    case 'star':
      return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 43.26'>
          <path
            d='M20.64,11.78l2.81,5.89a3.15,3.15,0,0,0,2.37,1.79l6.29.95A3.29,3.29,0,0,1,33.86,26l-4.55,4.6a3.36,3.36,0,0,0-.91,2.89l1.08,6.48a3.18,3.18,0,0,1-4.58,3.44l-5.62-3.06a3,3,0,0,0-2.93,0l-5.62,3.06a3.18,3.18,0,0,1-4.58-3.44l1.08-6.48a3.36,3.36,0,0,0-.91-2.89L1.77,26a3.29,3.29,0,0,1,1.75-5.56l6.28-.95a3.15,3.15,0,0,0,2.38-1.79L15,11.78A3.1,3.1,0,0,1,20.64,11.78Z'
            transform='translate(-0.81 -0.51)'
            fill={config.color}
          />
          <path
            d='M18,8.18c.25,0,.49,0,.73.05a8.17,8.17,0,0,1,1,.16,1.28,1.28,0,0,1,1,1.11,9.31,9.31,0,0,1,.08,1.5c0,.26,0,.53,0,.79s0,.33-.31.25a1.75,1.75,0,0,0-1.41.2.32.32,0,0,1-.31,0,2.14,2.14,0,0,0-1.77,0l-.09,0a.37.37,0,0,1-.38,0,2.81,2.81,0,0,0-.47-.21,1.47,1.47,0,0,0-.75,0l-.28.06a.22.22,0,0,1-.29-.2,3.18,3.18,0,0,1-.06-.43c-.05-.54-.1-1.08-.14-1.63a4,4,0,0,1,0-.49.66.66,0,0,1,.25-.5,2,2,0,0,1,.61-.35,8.22,8.22,0,0,1,1.62-.35l.27,0V8.05c0-1.29,0-2.59-.08-3.88,0-.82,0-1.63,0-2.45,0-1.28.6-2.49.7,1.62,0,.84,0,1.68.05,2.52s0,1.48.05,2.22A.16.16,0,0,0,18,8.18Z'
            transform='translate(-0.81 -0.51)'
            fill='#cccbcb'
          />
        </svg>
      );
    default:
      return false;
  }
};

export default OrnamentCollections;
