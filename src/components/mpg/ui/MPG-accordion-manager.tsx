'use client'
import React, { createContext, useContext, useState, useRef } from 'react';
import { Accordion } from '@/components/ui/accordion';

interface AccordionManagerContextType {
  openItem: string | undefined;
  setOpenItem: (value: string | undefined) => void;
}

const AccordionManagerContext = createContext<AccordionManagerContextType | undefined>(undefined);

export function useAccordionManager() {
  const context = useContext(AccordionManagerContext);
  if (!context) {
    throw new Error('useAccordionManager must be used within an AccordionManager');
  }
  return context;
}

interface MPGAccordionManagerProps {
  children: React.ReactNode;
  className?: string;
  defaultOpen?: string[];
}

export function MPGAccordionManager({ children, className, defaultOpen }: MPGAccordionManagerProps) {
  const [openItem, setOpenItem] = useState<string | undefined>(defaultOpen?.[0]);
  const scrollPositionRef = useRef<number>(0);
  const isChangingRef = useRef<boolean>(false);

  // Store scroll position before accordion change
  const handleValueChange = (value: string | undefined) => {
    // Store current scroll position
    scrollPositionRef.current = window.scrollY;
    isChangingRef.current = true;

    setOpenItem(value);

    // Restore scroll position after a brief delay to let animation start
    requestAnimationFrame(() => {
      if (isChangingRef.current) {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'instant'
        });
        isChangingRef.current = false;
      }
    });
  };

  return (
    <AccordionManagerContext.Provider value={{ openItem, setOpenItem }}>
      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={handleValueChange}
        className={className}
      >
        {children}
      </Accordion>
    </AccordionManagerContext.Provider>
  );
}