import {
  Elysia,
  InternalServerError,
  InvalidCookieSignature,
  NotFoundError,
  ParseError,
  ValidationError,
} from "elysia";
import { HttpError, ProblemError } from "./errors";
import { ElysiaCustomStatusResponse } from "elysia/error";
import { InvalidFileType } from "elysia/error";

export * from "./errors";

export function elysiaHttpProblemJson() {
  return new Elysia({ name: "elysia-http-problem-json" })
    .error({ PROBLEM_ERROR: ProblemError })
    .onError({ as: "global" }, ({ error, path, set }) => {
      if (error instanceof ProblemError) {
        return error.toJSON();
      }

      if (error instanceof ValidationError) {
        // TODO - figure out why error.all throws an error - feels like an elysia bug
        const errorObj = JSON.parse(error.message);

        const problem = new HttpError.BadRequest("The request is invalid", {
          errors: errorObj.errors,
        });
        set.status = problem.status;
        return problem.toJSON();
      }

      if (error instanceof NotFoundError) {
        const problem = new HttpError.NotFound(
          `The requested resource ${path} was not found`,
        );
        set.status = problem.status;
        return problem.toJSON();
      }

      if (error instanceof ParseError) {
        const problem = new HttpError.BadRequest(
          `The request could not be parsed: ${error.message}`,
        );
        return problem.toJSON();
      }

      // elysia sets this as a 400 for invalid cookies
      if (error instanceof InvalidCookieSignature) {
        const problem = new HttpError.BadRequest(
          "The provided cookie signature is invalid",
          { key: error.key },
        );
        set.status = problem.status;
        return problem.toJSON();
      }

      // https://github.com/elysiajs/elysia/issues/1500
      // elysia < 1.4.13 will not pass this instanceof check correctly,
      // hence the explicit cast
      if (
        error instanceof InvalidFileType ||
        (error as InvalidFileType).code === "INVALID_FILE_TYPE"
      ) {
        const castedError = error as unknown as InvalidFileType;
        const problem = new HttpError.BadRequest(castedError.message, {
          property: castedError.property,
          expected: castedError.expected,
        });
        set.status = problem.status;
        return problem.toJSON();
      }

      if (error instanceof ElysiaCustomStatusResponse) {
        return;
      }

      if (error instanceof InternalServerError || error instanceof Error) {
        const problem = new HttpError.InternalServerError(error.message);
        set.status = problem.status;
        return problem.toJSON();
      }
    });
}
