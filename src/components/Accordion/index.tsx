import { ChevronDown } from 'lucide-react';
import { ReactNode, useState } from 'react';

type AccordionType = {
  title: string;
  children: ReactNode;
};
const Accordion = ({ title, children }: AccordionType) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col w-full gap-2.5">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="flex px-3 items-center justify-between w-full font-medium text-themeGray-30"
      >
        <span> {title}</span>
        <ChevronDown
          className={`w-5 h-5 transform transition-transform ${
            !isOpen ? '-rotate-90' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-all w-full duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
