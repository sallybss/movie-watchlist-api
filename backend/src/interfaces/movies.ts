import { User } from "./user";
import { Document } from "mongoose";

export interface Movie extends Document {
  title: string;
  posterUrl?: string;
  genre?: string;
  releaseYear?: number;
  watched: boolean;

  // ✅ allow 0 = not rated yet
  rating?: number;

  owner: User["id"];
}