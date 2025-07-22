export enum TaskStatus {
  NOT_STARTED = '未着手',
  IN_PROGRESS = '進行中',
  REVIEWING = 'レビュー中',
  COMPLETED = '完了',
}

export interface Memo {
  memoId: string;
  content: string;
}

export interface Reference {
  referenceId: string;
  title: string;
  url: string;
}

export interface Task {
  taskId: string;
  title: string;
  deadline: Date;
  status: TaskStatus;
  isCompleted: boolean;
  references: Reference[];
  memos: Memo[];
}

export interface Subject {
  subjectId: string;
  name: string;
  professorName: string;
  tasks: Task[];
}