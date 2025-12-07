import { Reminder } from "./types";

export const getStatusColor = (
  dueAt: number,
  type: Reminder["type"],
  colors: any
) => {
  if (type === "recurring") return colors.primary;

  const diff = dueAt - Date.now();
  if (diff <= 0) return colors.error; // Overdue
  if (diff < 60 * 60 * 1000) return "#f59e0b"; // < 1h (Warning/Orange)
  return colors.primary; // Normal
};

export const getStatusText = (reminder: Reminder, t: any) => {
  if (reminder.type === "recurring") {
    // Format interval
    const seconds = reminder.triggerSeconds || 0;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    let timeStr = "";
    if (h > 0) timeStr += `${h}${t("quick_reminders.hour_suffix", "h")}`;
    if (m > 0)
      timeStr += `${h > 0 ? " " : ""}${m}${t(
        "quick_reminders.minute_suffix",
        "m"
      )}`;

    return `${t("quick_reminders.repeat_prefix", "Repete")} ${timeStr}`;
  }

  const diff = reminder.dueAt - Date.now();
  if (diff <= 0) return t("quick_reminders.overdue");

  const minutes = Math.ceil(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours < 1) return `${mins}${t("quick_reminders.minute_suffix", "m")}`;
  if (hours > 24) return t("quick_reminders.more_than_one_day", "> 1d");

  return mins > 0
    ? `${hours}${t("quick_reminders.hour_suffix", "h")} ${mins}${t(
        "quick_reminders.minute_suffix",
        "m"
      )}`
    : `${hours}${t("quick_reminders.hour_suffix", "h")}`;
};
