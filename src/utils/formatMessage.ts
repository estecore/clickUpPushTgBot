import { MessageProps, InsertObject } from "../config/types";

const formatDate = (date: string) => {
  return new Date(parseInt(date)).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

const parseTaskDescription = (jsonDescription: string): string => {
  try {
    const descriptionObj: { ops: InsertObject[] } = JSON.parse(jsonDescription);
    let parsedDescription = "";
    let currentListType: "ordered" | "bullet" | null = null;

    descriptionObj.ops.forEach((op) => {
      if (typeof op.insert === "string") {
        let text = op.insert;
        if (op.attributes?.bold) {
          text = `*${text}*`;
        }
        if (op.attributes?.underline) {
          text = `_${text}_`;
        }
        if (op.attributes?.list) {
          if (op.attributes.list.list !== currentListType) {
            parsedDescription += "\n";
            currentListType = op.attributes.list.list;
          }
          text = (op.attributes.list.list === "ordered" ? "1. " : "- ") + text;
        } else {
          currentListType = null;
        }
        parsedDescription += text;
      } else if ("image" in op.insert) {
        parsedDescription += "[Изображение]";
      }
      if (op.attributes?.blockId) {
        parsedDescription += "\n";
      }
    });

    return parsedDescription;
  } catch (error) {
    return jsonDescription;
  }
};

const formatMessage = ({ data, messageName }: MessageProps): string => {
  const { name, description, status, priority, assignees, url, due_date } =
    data.payload;

  return `*Новое уведомление от ClickUp:*
  \n*${messageName}*\n\n*Имя таски:* **${
    name ? name : "_Нет имени.._"
  }**\n*Описание:* ${
    description.length > 0
      ? parseTaskDescription(description)
      : "_Нет описания.._"
  }\n\n*Статус:* ${
    status.status ? status.status : "_Нет статуса.._"
  }\n*Приоритет:* ${
    priority ? priority.priority : "_Нет приоритета.._"
  }\n\n*Дедлайн:* ${
    due_date ? formatDate(due_date) : "_Нет дедлайна.._"
  }\n\n*Ответственные:* ${
    assignees
      ? assignees.map((assignee) => assignee.username).join(", ")
      : "_Нет ответственных.._"
  }
  \n[Нажмите сюда, чтобы перейти к задаче](${url})`;
};

export default formatMessage;
