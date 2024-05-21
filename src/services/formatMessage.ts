import { MessageProps } from "../../types/types";

export const formatMessage = ({ data, messageName }: MessageProps): string => {
  const { name, description, status, priority, assignees, url } = data.payload;
  return `*New ClickUp Notification:*
  \n*${messageName}*\n\n*Task name:* **${name}**\n*Description:* ${
    description.length > 0 ? description : "_No description_"
  }\n\n*Status:* ${status.status}\n*Priority:* ${
    priority ? priority.priority : "_No priority_"
  }\n\n*Assignee:* ${assignees.map((assignee) => assignee.username).join(", ")}
  \n[Click here to view](${url})`;
};
