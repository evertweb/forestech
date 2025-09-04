import React, { Suspense } from 'react';
import ShimmerLoader from '../Auth/ShimmerLoader';

const LazyWrapper = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <ShimmerLoader />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default LazyWrapper;
