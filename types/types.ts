export interface Assignee {
  username: string;
  email: string;
}

export interface TaskPayload {
  name: string;
  description: string;
  status: {
    status: string;
  };
  priority?: { priority: string };
  assignees: Assignee[];
  url: string;
}

export interface Data {
  payload: TaskPayload;
}

export interface MessageProps {
  data: Data;
  messageName: string;
}
