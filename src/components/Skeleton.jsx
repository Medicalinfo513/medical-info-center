import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="relative h-[80vh] flex flex-col items-center justify-center bg-slate-50 overflow-hidden">
      <div className="container-custom relative z-10 w-full px-5">
        <div className="max-w-4xl flex flex-col items-start">
          <Skeleton className="h-6 w-32 mb-6 rounded-full" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-12 w-1/2 mb-8" />
          <Skeleton className="h-20 w-full max-w-xl mb-10" />
          <div className="flex gap-4 w-full sm:w-auto">
            <Skeleton className="h-14 w-full sm:w-48 rounded-full" />
            <Skeleton className="h-14 w-full sm:w-48 rounded-full" />
          </div>
        </div>
      </div>
      {/* Decorative pulse circles */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-slate-200/50 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-slate-200/50 blur-[80px] rounded-full animate-pulse" />
    </div>
  );
};

export const SectionSkeleton = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <Skeleton className="h-[300px] md:h-[450px] w-full rounded-3xl" />
          </div>
          <div className="w-full md:w-1/2">
            <Skeleton className="h-4 w-24 mb-4 rounded-full" />
            <Skeleton className="h-10 w-3/4 mb-6" />
            <Skeleton className="h-24 w-full mb-8" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
