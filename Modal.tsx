import React from 'react';
import { XIcon } from './icons';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white hover:bg-slate-700 rounded-full p-2 transition-colors"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
