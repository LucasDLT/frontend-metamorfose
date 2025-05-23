'use client';

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export const PortalWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};
