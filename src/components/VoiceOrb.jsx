import React from 'react';

const VoiceOrb = ({ state }) => {
  // state: idle, listening, thinking, speaking
  
  return (
    <div className={`vision-core-container ${state}`}>
      <div className="orb-wrapper">
        <div className="orb-ring ring-outer"></div>
        <div className="orb-ring ring-inner"></div>
        
        <div className="main-orb">
          <div className="orb-glow"></div>
          <div className="orb-glitter"></div>
          <svg className="orb-svg" viewBox="0 0 100 100">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
              </filter>
            </defs>
            <g filter="url(#goo)">
              <circle cx="50" cy="50" r="35" className="base-circle" />
              <circle cx="50" cy="50" r="30" className="inner-circle" />
            </g>
          </svg>
        </div>
      </div>
      
      <div className="orb-shadow"></div>
    </div>
  );
};

export default VoiceOrb;
