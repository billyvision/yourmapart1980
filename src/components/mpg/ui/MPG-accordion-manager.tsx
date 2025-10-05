'use client'
import React, { createContext, useContext, useState } from 'react';
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

  return (
    <AccordionManagerContext.Provider value={{ openItem, setOpenItem }}>
      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={setOpenItem}
        className={className}
      >
        {children}
      </Accordion>
    </AccordionManagerContext.Provider>
  );
}