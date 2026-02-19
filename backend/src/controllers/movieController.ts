import { Request, Response } from "express";
import { movieModel } from "../models/moviesModel";
import { connect, disconnect } from "../repository/database";

// CRUD - create, read/get, update, delete

/**
 * Creates a new movie in the data source based on the request body
 * @param req
 * @param res
 */
export async function createMovie(req: Request, res: Response): Promise<void> {
  const data = req.body;

  try {
    await connect();

    const movie = new movieModel(data);
    const result = await movie.save();

    res.status(201).send(result);
  } catch (err) {
    res.status(500).send("Error creating movie. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves all movies from the data sources
 * @param req
 * @param res
 */
export async function getAllMovies(req: Request, res: Response) {
  try {
    await connect();

    const { title, genre, watched, owner, minRating } = req.query;

    const filter: any = {};

    if (title) filter.title = { $regex: String(title), $options: "i" };
    if (genre) filter.genre = { $regex: String(genre), $options: "i" };

    if (watched !== undefined) {
      filter.watched = String(watched) === "true";
    }

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

/**
 * Retrieves a movie by its id from the data sources
 * @param req
 * @param res
 */
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

/**
 * Retrieves movies by query from the data sources
 * Example: /api/movies/search/title/Dune
 * @param req
 * @param res
 */
export async function getMoviesByQuery(req: Request, res: Response) {
  const key = String(req.params.key);
  const val = req.params.val;

  try {
    await connect();

    // NOTE:
    // TypeScript might complain about [key] - casting to any keeps it identical to teacher style
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

/**
 * Updates the movie by id
 * @param req
 * @param res
 */
export async function updateMovieById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await connect();

    const result = await movieModel.findByIdAndUpdate(id, req.body);

    if (!result) {
      res.status(404).send("Cannot update movie with id=" + id);
    } else {
      res.status(200).send("Movie was succesfully updated.");
    }
  } catch (err) {
    res.status(500).send("Error updating movie by id. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Deletes the movie by its id from the data sources
 * @param req
 * @param res
 */
export async function deleteMovieById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await connect();

    const result = await movieModel.findByIdAndDelete(id);

    if (!result) {
      res.status(404).send("Cannot delete movie with id=" + id);
    } else {
      res.status(200).send("Movie was succesfully deleted.");
    }
  } catch (err) {
    res.status(500).send("Error deleting movie by id. Error: " + err);
  } finally {
    await disconnect();
  }
}

export async function updateMovieRating(req: Request, res: Response) {
  const id = req.params.id;
  const rating = Number(req.body.rating);

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    res.status(400).send("Rating must be a number between 1 and 5.");
    return;
  }

  try {
    await connect();

    const result = await movieModel.findByIdAndUpdate(
      id,
      { rating },
      { new: true }
    );

    if (!result) {
      res.status(404).send("Cannot update rating for movie with id=" + id);
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    res.status(500).send("Error updating rating. Error: " + err);
  } finally {
    await disconnect();
  }
}