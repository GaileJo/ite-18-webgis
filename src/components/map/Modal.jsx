import React from 'react';
import Close from '../../../public/pictures/controls/x.svg?react';
const Modal = ({ isOpen, setShowQuery, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'
      onClick={() => setShowQuery(false)}
    >
      {/* This is the modal box */}
      <div
        className='relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-md bg-white'
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className='flex justify-between items-center pb-3'>
          <p className='text-2xl font-bold'>Select Location</p>
          <div
            className='cursor-pointer z-50'
            onClick={() => setShowQuery(false)}
          >
            <Close className='w-[30px] h-[30px]' />
          </div>
        </div>
        {/* Modal Body */}
        <div className='mb-4'>{children}</div>
        {/* Modal Footer */}
      </div>
    </div>
  );
};

export default Modal;
