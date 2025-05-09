import React from 'react';

type DropDownIconProps = {
  color?: string;
};
const DropDownIcon = ({ color }: DropDownIconProps) => {
  return (
    <svg
      width="12"
      height="6"
      viewBox="0 0 12 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.34535 5.43305C5.72112 5.75848 6.27888 5.75848 6.65465 5.43305L10.9006 1.75593C11.6005 1.14979 11.1719 0 10.246 0H1.75402C0.828135 0 0.399465 1.14979 1.09937 1.75593L5.34535 5.43305Z"
        fill={color || 'white'}
      />
    </svg>
  );
};

export default DropDownIcon;
