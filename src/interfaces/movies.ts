import { User } from "./user";
import { Document } from "mongoose";

export interface Movie extends Document {
  title: string;
  genre?: string;
  releaseYear?: number;
  watched: boolean;
  rating?: number;
  owner: User["id"];
}