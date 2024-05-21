import { MessageProps } from "../../types/types";

export const formatMessage = ({ data, messageName }: MessageProps): string => {
  const { name, description, status, priority, assignees, url } = data.payload;
  return `New ClickUp Notification:\n\n${messageName}\n\nTask name: ${name}\nDescription: ${
    description.length > 0 ? description : "No description"
  }\n\nStatus: ${status.status}\nPriority: ${
    priority ? priority.priority : "No priority"
  }\nAssignee: ${assignees
    .map((assignee) => assignee.username)
    .join(", ")}\n\nClick here to view: \n${url}`;
};
