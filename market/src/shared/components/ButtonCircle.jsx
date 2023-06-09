import React from 'react';
import FeatherIcon from 'feather-icons-react';
import '../custom-styles.css';

export const ButtonCircle = ({ type, onClick, icon = '', size = 15 }) => {
  return (
    <button className={type} onClick={onClick}>
      {icon && (
        <FeatherIcon icon={icon} size={size} style={{ strokeWidth: 2.5 }} />
      )}
    </button>
  );
};
