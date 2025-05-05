import type { Props as SelectProps, GroupBase } from 'react-select';
import SelectLib, { components, DropdownIndicatorProps } from 'react-select';
import DropDownIcon from './Icons/DropDownIcon';

interface CustomSelectProps<Option, IsMulti extends boolean = false>
  extends SelectProps<Option, IsMulti> {
  isHideIcon?: boolean;
}

const DropdownIndicator = <Option, IsMulti extends boolean = false>({
  isHideIcon,
  ...props
}: DropdownIndicatorProps<Option, IsMulti> & { isHideIcon?: boolean }) => {
  if (isHideIcon) return null;
  return (
    <components.DropdownIndicator {...props}>
      <DropDownIcon color="#9ca3af" />
    </components.DropdownIndicator>
  );
};

const Select = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  isHideIcon = false,
  ...props
}: CustomSelectProps<Option, IsMulti>) => {
  return (
    <SelectLib
      className="w-full font-poppins text-base font-semibold"
      classNamePrefix="react-select"
      components={{
        DropdownIndicator: (indicatorProps) => (
          <DropdownIndicator {...indicatorProps} isHideIcon={isHideIcon} />
        ),
      }}
      styles={{
        control: (base) => ({
          ...base,
          width: '100%',
          borderRadius: '0.375rem',
          borderColor: '#9ca3af',
          backgroundColor: 'white',
          boxShadow: 'none',
          '&:hover': { borderColor: '#9ca3af' },
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }),
        menu: (base) => ({
          ...base,
          zIndex: 10,
        }),
        menuList: (base) => ({
          ...base,
          backgroundColor: 'white',
          border: '1px solid white',
        }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          backgroundColor: isSelected
            ? '#E6E6E6'
            : isFocused
            ? '#F0F0F0'
            : 'white',
          color: '#000000',
        }),
        placeholder: (base) => ({
          ...base,
          color: '#9ca3af',
        }),
        indicatorSeparator: () => ({
          display: 'none',
        }),
      }}
      {...props}
    />
  );
};

export { Select };
