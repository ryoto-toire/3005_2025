import React, { useState, useEffect } from 'react';
import { Subject } from '../types';
import { FolderIcon, PlusIcon, PencilIcon, TrashIcon, CheckIcon, XIcon } from './icons';

interface SubjectListProps {
  subjects: Subject[];
  selectedSubjectId: string | null;
  onSelectSubject: (subjectId: string) => void;
  onAddSubject: () => void;
  onUpdateSubject: (subjectId: string, name: string, professorName: string) => void;
  onDeleteSubject: (subjectId: string) => void;
}

const SubjectCard: React.FC<{
    subject: Subject;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (subjectId: string, name: string, professorName: string) => void;
    onDelete: (subjectId: string) => void;
}> = ({ subject, isSelected, onSelect, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(subject.name);
  const [professorName, setProfessorName] = useState(subject.professorName);

  const taskCount = subject.tasks.length;
  const completedCount = subject.tasks.filter(t => t.isCompleted).length;
  
  useEffect(() => {
    if(subject.name === '新しい科目' && subject.professorName === '担当教員名') {
        setIsEditing(true);
    }
  }, [subject.subjectId]);


  const baseClasses = "p-3 rounded-lg transition-all duration-200 ease-in-out";
  const selectedClasses = isSelected && !isEditing ? "bg-teal-500/20 border border-teal-500/50 shadow-lg" : "bg-slate-800 border border-transparent";
  const cursorClass = isEditing ? 'cursor-default' : 'cursor-pointer transform hover:bg-slate-700/80 hover:scale-[1.02]';
  
  const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditing(true);
  };
  
  const handleCancel = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditing(false);
      setName(subject.name);
      setProfessorName(subject.professorName);
  };

  const handleSave = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (name.trim()) {
          onUpdate(subject.subjectId, name.trim(), professorName.trim());
          setIsEditing(false);
      }
  };

  const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(subject.subjectId);
  };

  if (isEditing) {
      return (
          <li className={`${baseClasses} bg-slate-700/50 border border-teal-500/50 ring-2 ring-teal-500/50`}>
              <div className="flex items-start mb-2">
                  <FolderIcon className={`w-6 h-6 mr-4 text-teal-400 mt-1 flex-shrink-0`} />
                  <div className="flex-1 space-y-2 min-w-0">
                      <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-600 rounded p-1 text-sm font-semibold text-white focus:ring-1 focus:ring-teal-400 focus:outline-none"
                          placeholder="科目名"
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                      />
                      <input
                          type="text"
                          value={professorName}
                          onChange={(e) => setProfessorName(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-600 rounded p-1 text-sm text-slate-300 focus:ring-1 focus:ring-teal-400 focus:outline-none"
                          placeholder="担当教員名"
                          onClick={(e) => e.stopPropagation()}
                      />
                  </div>
              </div>
              <div className="flex justify-end items-center space-x-2">
                  <button onClick={handleCancel} aria-label="キャンセル" className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-600 transition-colors"><XIcon className="w-5 h-5" /></button>
                  <button onClick={handleSave} aria-label="保存" className="p-2 text-teal-400 hover:text-white rounded-full hover:bg-teal-500 transition-colors"><CheckIcon className="w-5 h-5" /></button>
              </div>
          </li>
      );
  }

  return (
    <li onClick={onSelect} className={`${baseClasses} ${selectedClasses} ${cursorClass}`} role="button" tabIndex={0}>
      <div className="flex items-center">
          <FolderIcon className={`w-6 h-6 mr-4 flex-shrink-0 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>{subject.name}</h3>
            <p className="text-sm text-slate-400 truncate">{subject.professorName}</p>
          </div>
          <div className="text-right flex items-center space-x-2 ml-2">
            <span className={`text-sm font-mono px-2 py-1 rounded transition-colors ${isSelected ? 'bg-teal-400/20 text-teal-300' : 'bg-slate-700 text-slate-300'}`}>
              {completedCount}/{taskCount}
            </span>
            <div className="flex items-center">
                <button onClick={handleEdit} aria-label={`${subject.name}を編集`} className="p-2 text-slate-400 hover:text-teal-400 rounded-full hover:bg-slate-700/50"><PencilIcon className="w-4 h-4"/></button>
                <button onClick={handleDelete} aria-label={`${subject.name}を削除`} className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-700/50"><TrashIcon className="w-4 h-4"/></button>
            </div>
          </div>
      </div>
    </li>
  );
};


const SubjectList: React.FC<SubjectListProps> = ({ subjects, selectedSubjectId, onSelectSubject, onAddSubject, onUpdateSubject, onDeleteSubject }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-lg font-semibold text-slate-300">科目一覧</h2>
        <button 
          onClick={onAddSubject}
          className="flex items-center space-x-2 bg-slate-700/50 text-slate-300 font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          aria-label="科目追加"
        >
          <PlusIcon className="w-5 h-5" />
          <span>科目追加</span>
        </button>
      </div>

      <ul className="space-y-2">
        {subjects.map(subject => (
          <SubjectCard 
            key={subject.subjectId}
            subject={subject}
            isSelected={subject.subjectId === selectedSubjectId}
            onSelect={() => onSelectSubject(subject.subjectId)}
            onUpdate={onUpdateSubject}
            onDelete={onDeleteSubject}
          />
        ))}
      </ul>
    </div>
  );
};

export default SubjectList;