import React from 'react';
import { ReactComponent as Ornament1Svg } from './assets/ornament1.svg';
import { ReactComponent as Ornament2Svg } from './assets/ornament2.svg';
import { ReactComponent as Ornament3Svg } from './assets/ornament3.svg';

const OrnamentSvg = ({ index, className }) => {
  const Ornament = [Ornament1Svg, Ornament2Svg, Ornament3Svg][index];

  return <Ornament className={className} />;
};

export default OrnamentSvg;
