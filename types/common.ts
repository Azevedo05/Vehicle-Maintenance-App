/** Position for cropped images */
export interface ImagePosition {
  xRatio: number; // 0-1, where 0 = image left edge at container left, 1 = image right edge at container right
  yRatio: number; // 0-1, where 0 = image top at container top, 1 = image bottom at container bottom
  scale: number;
}

/** Timestamp in milliseconds */
export type Timestamp = number;
