import React from 'react';
import { BookOpenIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm border-b border-slate-700 p-4 shadow-md z-10">
      <div className="flex items-center space-x-3">
        <BookOpenIcon className="w-8 h-8 text-teal-400" />
        <h1 className="text-2xl font-bold text-white tracking-tight">課題管理アプリ</h1>
      </div>
    </header>
  );
};

export default Header;