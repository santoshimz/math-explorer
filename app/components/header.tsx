"use client"
import React from 'react';
import { Label } from  "@/components/ui/label";
const Header: React.FC = () => {
  return (
    <div className='flex flex-col items-center mb-4 mt-4'>
      <div className='flex flex-col'>
        <Label className='flex self-auto font-bold'>Interactive Mathematical Explorer</Label>
        <div>
          <div className='flex flex-row space-x-4'>
            <div className='h-12 w-12 bg-sky-300 border-2 border-solid border-white rounded-xl mr-4' />
            <span className='mt-3'>Bounded</span>
            <div className='h-12 w-12 bg-sky-800 border-2 border-solid border-white rounded-xl' />
            <span className='mt-3'>Unbounded</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;