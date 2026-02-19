import { Schema, model, Document } from "mongoose";
import { Movie } from "../interfaces/movies";

const movieSchema = new Schema<Movie>({
  title: { type: String, required: true, min: 1, max: 255 },
  genre: { type: String, required: false, min: 1, max: 100 },
  releaseYear: { type: Number, required: false, min: 1888, max: 2100 },
  watched: { type: Boolean, required: true, default: false },
  rating: { type: Number, required: false, min: 1, max: 5 },

  owner: { type: String, ref: "User", required: true }
});

type UpdateQuery<T> = {
  [key: string]: unknown;
} & {
  __v?: number;
  $set?: Partial<T> & { __v?: number };
  $setOnInsert?: Partial<T> & { __v?: number };
  $inc?: { __v?: number };
};

movieSchema.pre("findOneAndUpdate", function <T extends Document>(this: any) {
  const update = this.getUpdate() as UpdateQuery<T>;

  if (update.__v != null) {
    delete update.__v;
  }

  const keys: Array<"$set" | "$setOnInsert"> = ["$set", "$setOnInsert"];

  for (const key of keys) {
    if (update[key] != null && update[key]!.__v != null) {
      delete update[key]!.__v;

      if (Object.keys(update[key]!).length === 0) {
        delete update[key];
      }
    }
  }

  update.$inc = update.$inc || {};
  update.$inc.__v = 1;
});

export const movieModel = model<Movie>("Movie", movieSchema);