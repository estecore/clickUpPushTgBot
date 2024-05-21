import { MessageProps } from "../../types/types";

export const formatMessage = ({ data, messageName }: MessageProps): string => {
  const { name, description, status, priority, assignees, url } = data.payload;
  return `*Новое уведомление от ClickUp:*
  \n*${messageName}*\n\n*Имя таски:* **${name}**\n*Описание:* ${
    description.length > 0 ? description : "_Нет описания.._"
  }\n\n*Статус:* ${status.status}\n*Приоритет:* ${
    priority ? priority.priority : "_Нет приоритета.._"
  }\n\n*Ответственные:* ${assignees
    .map((assignee) => assignee.username)
    .join(", ")}
  \n[Нажмите сюда, чтобы перейти к задаче](${url})`;
};
