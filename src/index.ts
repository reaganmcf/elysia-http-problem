import {Elysia, InternalServerError, InvalidCookieSignature, NotFoundError, ParseError, ValidationError } from "elysia";
import { HttpError, ProblemError } from "./errors";
import { ElysiaCustomStatusResponse, InvalidFileType } from "elysia/error";

export function elysiaHttpProblem() {
    return new Elysia({name: 'elysia-http-problem' })
    .error({'PROBLEM_ERROR': ProblemError})
    .onError({as: 'global'}, ({error, path, set }) => {
        if (error instanceof ProblemError) {
            return error.toJSON();
        }

        if (error instanceof ValidationError) {
        }

        if (error instanceof NotFoundError) {
            const problem = new HttpError.NotFound(
                `The requested resource ${path} was not found`
            )
            set.status = problem.status;
            return problem.toJSON();
        }

        if (error instanceof ParseError) {

        } 

        if (error instanceof InvalidCookieSignature) {

        }
        
        if (error instanceof InvalidFileType) {

        }

        if (error instanceof ElysiaCustomStatusResponse) {

        }
        
        if (error instanceof InternalServerError || error instanceof Error) {
            const problem = new HttpError.InternalServerError()
            set.status = problem.status;
            return problem.toJSON();
        }
    })
}
