import React, { Suspense } from 'react';
import ShimmerLoader from '../Auth/ShimmerLoader';

const LazyWrapper = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-white">
          <ShimmerLoader />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default LazyWrapper;
