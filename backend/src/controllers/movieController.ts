import { Request, Response } from "express";
import { movieModel } from "../models/moviesModel";
import { connect, disconnect } from "../repository/database";

function isValidUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function pickMovieBody(body: any) {
  const movie: any = {};

  if (typeof body.title === "string") movie.title = body.title;
  if (typeof body.genre === "string") movie.genre = body.genre;
  if (typeof body.releaseYear === "number") movie.releaseYear = body.releaseYear;
  if (typeof body.watched === "boolean") movie.watched = body.watched;
  if (typeof body.owner === "string") movie.owner = body.owner;

  // ✅ posterUrl (optional)
  if (body.posterUrl !== undefined) {
    if (!isValidUrl(body.posterUrl)) {
      throw new Error("posterUrl must be a valid http/https URL");
    }
    movie.posterUrl = body.posterUrl;
  }

  // ✅ rating (optional, allow 0-5)
  if (body.rating !== undefined) {
    const r = Number(body.rating);
    if (!Number.isFinite(r) || r < 0 || r > 5) {
      throw new Error("rating must be a number between 0 and 5");
    }
    movie.rating = r;
  }

  return movie;
}

export async function createMovie(req: Request, res: Response): Promise<void> {
  try {
    await connect();

    const data = pickMovieBody(req.body); // ✅ only allowed fields
    const movie = new movieModel(data);
    const result = await movie.save();

    res.status(201).send(result);
  } catch (err: any) {
    const msg = String(err?.message || err);
    res.status(msg.includes("posterUrl") || msg.includes("rating") ? 400 : 500).send(msg);
  } finally {
    await disconnect();
  }
}

export async function getAllMovies(req: Request, res: Response) {
  try {
    await connect();

    const { title, genre, watched, owner, minRating } = req.query;
    const filter: any = {};

    if (title) filter.title = { $regex: String(title), $options: "i" };
    if (genre) filter.genre = { $regex: String(genre), $options: "i" };

    if (watched !== undefined) filter.watched = String(watched) === "true";
    if (owner) filter.owner = String(owner);

    if (minRating !== undefined) {
      const r = Number(minRating);
      if (!Number.isNaN(r)) filter.rating = { $gte: r };
    }

    const result = await movieModel.find(filter).sort({ createdAt: -1 });
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving movies. Error: " + err);
  } finally {
    await disconnect();
  }
}

export async function getMovieById(req: Request, res: Response) {
  try {
    await connect();

    const id = req.params.id;
    const result = await movieModel.findById(id);

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving movie by id. Error: " + err);
  } finally {
    await disconnect();
  }
}

export async function getMoviesByQuery(req: Request, res: Response) {
  const key = String(req.params.key);
  const val = req.params.val;

  try {
    await connect();

    const result = await movieModel.find({
      [key]: { $regex: val, $options: "i" }
    } as any);

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving movies. Error: " + err);
  } finally {
    await disconnect();
  }
}

export async function updateMovieById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await connect();

    const update = pickMovieBody(req.body); // ✅ validate + pick
    const result = await movieModel.findByIdAndUpdate(id, update, { new: true });

    if (!result) res.status(404).send("Cannot update movie with id=" + id);
    else res.status(200).send(result);
  } catch (err: any) {
    const msg = String(err?.message || err);
    res.status(msg.includes("posterUrl") || msg.includes("rating") ? 400 : 500).send(msg);
  } finally {
    await disconnect();
  }
}

export async function deleteMovieById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await connect();

    const result = await movieModel.findByIdAndDelete(id);

    if (!result) res.status(404).send("Cannot delete movie with id=" + id);
    else res.status(200).send("Movie was succesfully deleted.");
  } catch (err) {
    res.status(500).send("Error deleting movie by id. Error: " + err);
  } finally {
    await disconnect();
  }
}

export async function updateMovieRating(req: Request, res: Response) {
  const id = req.params.id;
  const rating = Number(req.body.rating);

  // ✅ allow 0-5
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    res.status(400).send("Rating must be a number between 0 and 5.");
    return;
  }

  try {
    await connect();

    const result = await movieModel.findByIdAndUpdate(
      id,
      { rating },
      { new: true }
    );

    if (!result) res.status(404).send("Cannot update rating for movie with id=" + id);
    else res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error updating rating. Error: " + err);
  } finally {
    await disconnect();
  }
}