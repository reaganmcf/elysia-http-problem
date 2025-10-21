import {
  Elysia,
  t,
  InternalServerError,
  InvalidCookieSignature,
  NotFoundError,
  ParseError,
  ValidationError,
} from "elysia";
import { HttpError, ProblemError } from "./errors";
import { ElysiaCustomStatusResponse } from "elysia/error";
import { InvalidFileType } from "elysia/error";

export function elysiaHttpProblem() {
  return new Elysia({ name: "elysia-http-problem" })
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

      // elysia set's this as 422 just like validation error - should we be consistent?
      if (error instanceof InvalidFileType) {
        const problem = new HttpError.BadRequest(error.message, {
          property: error.property,
          expected: error.expected,
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
