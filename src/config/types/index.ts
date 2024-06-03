interface EnvConfig {
  ENVIRONMENT: string;
  SERVER_MONITORING_BOT_TOKEN: string;
}

const config: EnvConfig = {
  ENVIRONMENT: process.env.ENVIRONMENT!,
  SERVER_MONITORING_BOT_TOKEN: process.env.CORS_URL!,
};
export interface Assignee {
  username: string;
  email: string;
}
export interface Watcher {
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
  due_date?: string;
  assignees: Assignee[];
  watchers: Watcher[];
  url: string;
}

export interface Data {
  payload: TaskPayload;
}
export interface MessageProps {
  data: Data;
  messageName: string;
}

export interface InsertObject {
  insert: string | { image: string };
  attributes?: {
    bold?: boolean;
    underline?: boolean;
    blockId?: string;
    list?: {
      list: "ordered" | "bullet";
    };
  };
}

export default config;
