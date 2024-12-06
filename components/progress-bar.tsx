"use client";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useEffect, useState } from 'react';

export function ProgressBarProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ProgressBar
      height="2px"
      color="#dc2626"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
} 