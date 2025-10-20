import {Elysia, InternalServerError, InvalidCookieSignature, NotFoundError, ParseError, ValidationError } from "elysia";
import { ProblemError } from "./errors";
import { ElysiaCustomStatusResponse, InvalidFileType } from "elysia/error";

export function elysiaHttpProblem() {
    return new Elysia({name: 'elysia-http-problem' })
    .error({'PROBLEM_ERROR': ProblemError})
    .onError({as: 'global'}, ({error, path, set }) => {
        if (error instanceof ProblemError) {
            // TODO - handle this
        }

        if (error instanceof ValidationError) {

        }

        if (error instanceof NotFoundError) {
            const problem = new ProblemError(
                "https://httpstatuses.com/404",
                "Not Found",
                404,
                `The requested resource ${path} was not found`
            )
            set.status = problem.status;
            return problem.toJSON();
        }

        if (error instanceof ParseError) {

        } 

        if (error instanceof InternalServerError) {

        }

        if (error instanceof InvalidCookieSignature) {

        }
        
        if (error instanceof InvalidFileType) {

        }

        if (error instanceof ElysiaCustomStatusResponse) {

        }

        if (error instanceof Error) {

        }
    })
}
