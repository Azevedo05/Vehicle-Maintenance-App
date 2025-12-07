export interface Reminder {
  id: string;
  text: string;
  createdAt: number;
  dueAt: number;
  type: "one-time" | "recurring";
  notificationId?: string;
  triggerSeconds?: number;
}
