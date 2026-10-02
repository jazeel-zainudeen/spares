"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface NotFoundContextType {
  isNotFound: boolean;
  setIsNotFound: (val: boolean) => void;
}

const NotFoundContext = createContext<NotFoundContextType>({
  isNotFound: false,
  setIsNotFound: () => {},
});

export function NotFoundProvider({ children }: { children: React.ReactNode }) {
  const [isNotFound, setIsNotFound] = useState(false);
  const pathname = usePathname();

  // Reset isNotFound whenever route changes
  useEffect(() => {
    setIsNotFound(false);
  }, [pathname]);

  return (
    <NotFoundContext.Provider value={{ isNotFound, setIsNotFound }}>
      {children}
    </NotFoundContext.Provider>
  );
}

export function useNotFound() {
  return useContext(NotFoundContext);
}
