import React from 'react';
import { Subject, Task } from '../types';
import StatusBadge from './StatusBadge';
import { PlusIcon, TrashIcon } from './icons';

interface TaskListProps {
  subject: Subject;
  onTaskSelect: (task: Task) => void;
  onAddTask: () => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskCard: React.FC<{ task: Task; onSelect: () => void, onDelete: (e: React.MouseEvent) => void }> = ({ task, onSelect, onDelete }) => {
  const deadlineFormatted = task.deadline.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const isOverdue = !task.isCompleted && new Date() > task.deadline;
  
  return (
     <div 
        onClick={onSelect}
        className="bg-slate-800/70 p-4 rounded-lg border border-slate-700 shadow-sm hover:shadow-lg hover:border-teal-500/50 transition-all duration-200 cursor-pointer group flex justify-between items-start"
      >
        <div>
            <h4 className="font-bold text-lg text-slate-100 group-hover:text-teal-400 transition-colors">{task.title}</h4>
            <div className="flex items-center space-x-4 mt-2 text-sm">
                <StatusBadge status={task.status} />
                <div className={`text-slate-400 ${isOverdue ? 'text-red-400 font-semibold' : ''}`}>
                    締め切り: {deadlineFormatted}
                </div>
            </div>
        </div>
        <button
            onClick={onDelete}
            className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10"
            aria-label="タスクを削除"
        >
            <TrashIcon className="w-5 h-5" />
        </button>
    </div>
  );
};

const TaskList: React.FC<TaskListProps> = ({ subject, onTaskSelect, onAddTask, onDeleteTask }) => {
  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-white">{subject.name}</h2>
            <p className="text-slate-400 mt-1">{subject.professorName} 担当</p>
        </div>
        <button
          onClick={onAddTask}
          className="flex items-center space-x-2 bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors shadow-md hover:shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
          <span>タスクを追加</span>
        </button>
      </div>
      
      {subject.tasks.length > 0 ? (
        <div className="space-y-4">
          {subject.tasks
            .slice() // Create a shallow copy to avoid mutating the original array
            .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
            .map(task => (
                <TaskCard 
                    key={task.taskId} 
                    task={task} 
                    onSelect={() => onTaskSelect(task)} 
                    onDelete={(e) => {
                        e.stopPropagation(); // prevent onSelect from firing
                        onDeleteTask(task.taskId);
                    }}
                />
            ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-slate-700 rounded-lg">
            <p className="text-slate-400 text-lg">この科目にはまだタスクがありません。</p>
            <p className="text-slate-500">「タスクを追加」して始めましょう！</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;