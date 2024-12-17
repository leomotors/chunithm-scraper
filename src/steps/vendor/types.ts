import { StdChartDifficulty } from "../../types.js";

export type QmanScore = {
  title: string;
  difficulty: "Basic" | "Advanced" | "Expert" | "Master" | "Ultima";
  score: number;
  isAllJustice: boolean;
  isFullCombo: boolean;
};

export function toStdDifficulty(
  qmanDiff: QmanScore["difficulty"],
): StdChartDifficulty {
  switch (qmanDiff) {
    case "Basic":
      return "basic";
    case "Advanced":
      return "advanced";
    case "Expert":
      return "expert";
    case "Master":
      return "master";
    case "Ultima":
      return "ultima";
  }
}

export type QmanData = {
  honor: string;
  name: string;
  rating: number;
  ratingMax: number;
  updatedAt: string;
  best: QmanScore[];
  recent: QmanScore[];
  candidate: QmanScore[];
  score: QmanScore[];
};
