import React, { useState, useMemo, useCallback } from 'react';
import { Subject, Task, TaskStatus } from './types';
import Header from './components/Header';
import SubjectList from './components/SubjectList';
import TaskList from './components/TaskList';
import TaskDetailModal from './components/TaskDetailModal';

// --- MOCK DATA ---
const initialSubjects: Subject[] = [
  {
    subjectId: 'subj-1',
    name: '高度なWeb開発',
    professorName: 'エブリン・リード博士',
    tasks: [
      {
        taskId: 'task-1-1',
        title: 'プロジェクト提案',
        deadline: new Date('2024-09-15T23:59:59'),
        status: TaskStatus.COMPLETED,
        isCompleted: true,
        references: [{ referenceId: 'ref-1', title: 'MDN Web Docs', url: 'https://developer.mozilla.org' }],
        memos: [{ memoId: 'memo-1', content: 'リアクティブUIコンポーネントに焦点を当てる。' }],
      },
      {
        taskId: 'task-1-2',
        title: 'API統合',
        deadline: new Date('2024-10-01T23:59:59'),
        status: TaskStatus.IN_PROGRESS,
        isCompleted: false,
        references: [],
        memos: [],
      },
      {
        taskId: 'task-1-3',
        title: '最終プロジェクト提出',
        deadline: new Date('2024-10-20T23:59:59'),
        status: TaskStatus.NOT_STARTED,
        isCompleted: false,
        references: [],
        memos: [],
      },
    ],
  },
  {
    subjectId: 'subj-2',
    name: '機械学習の基礎',
    professorName: 'アラン・グラント教授',
    tasks: [
      {
        taskId: 'task-2-1',
        title: '線形回帰の実装',
        deadline: new Date('2024-09-22T23:59:59'),
        status: TaskStatus.REVIEWING,
        isCompleted: false,
        references: [{ referenceId: 'ref-2', title: 'Scikit-learn Docs', url: 'https://scikit-learn.org/' }],
        memos: [{ memoId: 'memo-2', content: 'データを正規化することを忘れない。' }],
      },
       {
        taskId: 'task-2-2',
        title: '文献レビュー：ニューラルネットワーク',
        deadline: new Date('2024-11-05T23:59:59'),
        status: TaskStatus.NOT_STARTED,
        isCompleted: false,
        references: [],
        memos: [],
      },
    ],
  },
   {
    subjectId: 'subj-3',
    name: 'データ構造とアルゴリズム',
    professorName: 'イアン・マルコム博士',
    tasks: [],
  }
];
// --- END MOCK DATA ---

export default function App() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(initialSubjects[0]?.subjectId ?? null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const selectedSubject = useMemo(() => {
    return subjects.find(s => s.subjectId === selectedSubjectId) || null;
  }, [subjects, selectedSubjectId]);

  const handleSelectSubject = useCallback((subjectId: string) => {
    setSelectedSubjectId(subjectId);
  }, []);
  
  const handleOpenTaskModal = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleCloseTaskModal = useCallback(() => {
    setEditingTask(null);
  }, []);

  const handleSaveTask = useCallback((updatedTask: Task) => {
    if (!selectedSubjectId) return;

    setSubjects(prevSubjects => {
      return prevSubjects.map(subject => {
        if (subject.subjectId === selectedSubjectId) {
          const newTasks = subject.tasks.map(task => 
            task.taskId === updatedTask.taskId ? updatedTask : task
          );
          // If task not found, it's a new one
          if (!newTasks.find(t => t.taskId === updatedTask.taskId)) {
            newTasks.push(updatedTask);
          }
          return { ...subject, tasks: newTasks };
        }
        return subject;
      });
    });

    handleCloseTaskModal();
  }, [selectedSubjectId, handleCloseTaskModal]);

  const handleAddTask = useCallback(() => {
    if (!selectedSubject) return;
    const newTask: Task = {
        taskId: `task-${crypto.randomUUID()}`,
        title: '新しいタスク',
        deadline: new Date(),
        status: TaskStatus.NOT_STARTED,
        isCompleted: false,
        references: [],
        memos: [],
    };
    handleOpenTaskModal(newTask);
  }, [selectedSubject, handleOpenTaskModal]);


  const handleDeleteTask = useCallback((taskId: string) => {
     if (!selectedSubjectId) return;
     // if (!window.confirm("このタスクを本当に削除しますか？")) return;

     setSubjects(prevSubjects => {
      return prevSubjects.map(subject => {
        if (subject.subjectId === selectedSubjectId) {
          return { ...subject, tasks: subject.tasks.filter(t => t.taskId !== taskId) };
        }
        return subject;
      });
    });
  }, [selectedSubjectId]);

  const handleAddSubject = useCallback(() => {
    const newSubject: Subject = {
      subjectId: `subj-${crypto.randomUUID()}`,
      name: '新しい科目',
      professorName: '担当教員名',
      tasks: [],
    };
    setSubjects(prev => [...prev, newSubject]);
    setSelectedSubjectId(newSubject.subjectId);
  }, []);

  const handleUpdateSubject = useCallback((subjectId: string, name: string, professorName: string) => {
    setSubjects(prev =>
      prev.map(s =>
        s.subjectId === subjectId ? { ...s, name, professorName } : s
      )
    );
  }, []);

  const handleDeleteSubject = useCallback((subjectId: string) => {
    // if (!window.confirm("この科目を削除しますか？関連するすべてのタスクも削除されます。この操作は元に戻せません。")) return;

    setSubjects(prevSubjects => {
        const newSubjects = prevSubjects.filter(s => s.subjectId !== subjectId);
        
        if (selectedSubjectId === subjectId) {
            setSelectedSubjectId(newSubjects[0]?.subjectId ?? null);
        }

        return newSubjects;
    });
  }, [selectedSubjectId]);


  return (
    <div className="flex flex-col h-screen font-sans">
      <Header />
      <main className="flex-1 flex overflow-hidden">
        <aside className="w-1/4 xl:w-1/5 bg-slate-800/50 p-4 overflow-y-auto border-r border-slate-700">
          <SubjectList
            subjects={subjects}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={handleSelectSubject}
            onAddSubject={handleAddSubject}
            onUpdateSubject={handleUpdateSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        </aside>
        <section className="flex-1 p-6 overflow-y-auto">
          {selectedSubject ? (
            <TaskList 
              subject={selectedSubject}
              onTaskSelect={handleOpenTaskModal}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-slate-500">
                <p className="text-xl">科目を選択してタスクを表示してください。</p>
                <p>または、新しい科目を追加して始めましょう。</p>
              </div>
            </div>
          )}
        </section>
      </main>
      {editingTask && selectedSubject && (
        <TaskDetailModal
          task={editingTask}
          onClose={handleCloseTaskModal}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}