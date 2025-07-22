import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Reference, Memo } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon, LinkIcon, ClipboardIcon } from './icons';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onSave }) => {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });

  useEffect(() => {
    // If the task prop changes (e.g., user opens a different task), reset the local state
    setEditedTask({ ...task });
  }, [task]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask(prev => ({ ...prev, deadline: new Date(e.target.value) }));
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskStatus;
    setEditedTask(prev => ({ 
        ...prev, 
        status: newStatus,
        isCompleted: newStatus === TaskStatus.COMPLETED
    }));
  };

  const handleSave = () => {
    onSave(editedTask);
  };

  const addReference = () => {
    const newRef: Reference = { referenceId: `ref-${crypto.randomUUID()}`, title: '新しい参考資料', url: '' };
    setEditedTask(prev => ({ ...prev, references: [...prev.references, newRef] }));
  };
  
  const updateReference = (index: number, field: 'title' | 'url', value: string) => {
    const newReferences = [...editedTask.references];
    newReferences[index] = { ...newReferences[index], [field]: value };
    setEditedTask(prev => ({ ...prev, references: newReferences }));
  };

  const removeReference = (refId: string) => {
    setEditedTask(prev => ({ ...prev, references: prev.references.filter(r => r.referenceId !== refId) }));
  };

  const addMemo = () => {
    const newMemo: Memo = { memoId: `memo-${crypto.randomUUID()}`, content: '' };
    setEditedTask(prev => ({ ...prev, memos: [...prev.memos, newMemo] }));
  };
  
  const updateMemo = (index: number, content: string) => {
    const newMemos = [...editedTask.memos];
    newMemos[index] = { ...newMemos[index], content };
    setEditedTask(prev => ({ ...prev, memos: newMemos }));
  };
  
  const removeMemo = (memoId: string) => {
    setEditedTask(prev => ({ ...prev, memos: prev.memos.filter(m => m.memoId !== memoId) }));
  };
  
  const deadlineForInput = editedTask.deadline.toISOString().split('T')[0];

  return (
    <Modal title="タスク詳細" onClose={onClose}>
      <div className="space-y-6">
        {/* Task Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300">タイトル</label>
          <input
            type="text"
            name="title"
            id="title"
            value={editedTask.title}
            onChange={handleInputChange}
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white"
          />
        </div>

        {/* Deadline and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-slate-300">締め切り</label>
            <input
              type="date"
              name="deadline"
              id="deadline"
              value={deadlineForInput}
              onChange={handleDateChange}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-300">ステータス</label>
            <select
              id="status"
              name="status"
              value={editedTask.status}
              onChange={handleStatusChange}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white"
            >
              {Object.values(TaskStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* References Section */}
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center"><LinkIcon className="w-5 h-5 mr-2" /> 参考資料</h3>
                <button onClick={addReference} className="flex items-center text-sm text-teal-400 hover:text-teal-300 font-semibold"><PlusIcon className="w-4 h-4 mr-1"/>追加</button>
            </div>
            {editedTask.references.map((ref, index) => (
                <div key={ref.referenceId} className="flex items-center space-x-2 bg-slate-900/50 p-2 rounded-md">
                    <input type="text" placeholder="タイトル" value={ref.title} onChange={(e) => updateReference(index, 'title', e.target.value)} className="flex-1 bg-slate-700 border-slate-600 rounded p-1 text-sm"/>
                    <input type="url" placeholder="URL" value={ref.url} onChange={(e) => updateReference(index, 'url', e.target.value)} className="flex-2 bg-slate-700 border-slate-600 rounded p-1 text-sm"/>
                    <button onClick={() => removeReference(ref.referenceId)} className="text-slate-500 hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                </div>
            ))}
        </div>

        {/* Memos Section */}
        <div className="space-y-3">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center"><ClipboardIcon className="w-5 h-5 mr-2" /> メモ</h3>
                <button onClick={addMemo} className="flex items-center text-sm text-teal-400 hover:text-teal-300 font-semibold"><PlusIcon className="w-4 h-4 mr-1"/>追加</button>
            </div>
            {editedTask.memos.map((memo, index) => (
                <div key={memo.memoId} className="flex items-start space-x-2 bg-slate-900/50 p-2 rounded-md">
                   <textarea placeholder="メモの内容..." value={memo.content} onChange={(e) => updateMemo(index, e.target.value)} rows={2} className="flex-1 bg-slate-700 border-slate-600 rounded p-1 text-sm w-full" />
                   <button onClick={() => removeMemo(memo.memoId)} className="text-slate-500 hover:text-red-400 mt-1"><TrashIcon className="w-4 h-4"/></button>
                </div>
            ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
        >
          変更を保存
        </button>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;