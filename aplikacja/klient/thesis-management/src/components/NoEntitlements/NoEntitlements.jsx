import React from 'react';
import './NoEntitlementsStyle.css';
import ExclamationIcon from '../../assets/pics/exclamation.svg';

export const NoEntitlements = () => {
  return (
    <>
    <div className='no-entitlements-container'>
    <div className='div-no-entitlements-main1'>
        <img src={ExclamationIcon} alt="exclamationIcon" className="no-entitlements-size"/>
    </div>

    <div className='div-no-entitlements-main2'>
      <p className='no-entitlements-p'>Nie masz uprawnień do tego zasobu</p>
    </div>
</div>
     </>
  );
 
};