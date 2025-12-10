export type SlideData = {
  id: string;
  type: "welcome" | "features" | "ready";
  title?: string;
  preTitle?: string;
  subtitle?: string;
  gradient: readonly [string, string, string];
};
