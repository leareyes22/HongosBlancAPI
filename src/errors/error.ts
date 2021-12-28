import express from "express";

class CustomError extends Error {
  public publicMessage: string;
  public code: number = -1;
  constructor(message: string, err: Error) {
    super(message + ": " + err.message);
    this.message = message + ": " + err.message;
    this.publicMessage = message;
  }
}

export class Unauthorized extends CustomError {
  constructor(message: string, err: Error) {
    super(message, err);
    this.name = "Unauthorized";
    this.code = 401;
  }
}

export class BadRequest extends CustomError {
  constructor(message: string, err: Error) {
    super(message, err);
    this.name = "Bad request";
    this.code = 400;
  }
}

export class NotFound extends CustomError {
  constructor(message: string, err: Error) {
    super(message, err);
    this.name = "Not found";
    this.code = 404;
  }
}

/**
 * Use this error for expected internal errors.
 * For example when an external service fails
 */
export class Internal extends CustomError {
  constructor(message: string, err: Error) {
    super(message, err);
    this.name = "Internal server error";
    this.code = 500;
  }
}

/**
 * Use this error for unexpected internal errors.
 * For example when assumptions made by a function were not followed by the caller
 */
export class Unexpected extends CustomError {
  constructor(message: string, err: Error) {
    super(message, err);
    this.name = "Internal server error";
    this.code = 500;
  }
}

export function errorHandler(
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (err instanceof CustomError) {
    if (err instanceof Unexpected) {
      console.error("Custom unexpected error: " + err);
    } else {
      console.debug("Handled error: " + err);
    }
    res.status(err.code);
    res.json({ msg: err.publicMessage });
    res.send();
    return;
  }
  // express-jwt error
  else if (err.name === "UnauthorizedError") {
    console.debug("express-jwt unauthorized error: " + err);
    res.status(err.status);
    res.json({ msg: err.message });
    res.send();
    return;
  }
  console.error("Unexpected error: " + err);
  res.status(500);
  res.json({ msg: "Unexpected error" });
  res.send();
}
