import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import { Elysia, InternalServerError } from "elysia";
import { elysiaHttpProblem } from "../src/index";
import z from "zod";

describe("HttpError.BadRequest", () => {
  it("should handle explicit HttpError.NotFound", async () => {
    const app = await new Elysia().use(elysiaHttpProblem()).get("/foo", () => {
      throw new HttpError.BadRequest("This is a bad request", [
        { field: "name", message: "Name is required" },
      ]);
    });

    const res = await app.handle(new Request("http://localhost/foo"));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual(
      new HttpError.BadRequest("This is a bad request", [
        { field: "name", message: "Name is required" },
      ]).toJSON(),
    );
  });

  it("should map elysia.ValidationError to HttpError.BadRequest", async () => {
    const app = await new Elysia().use(elysiaHttpProblem()).get(
      "/foo/:id",
      ({ params }) => {
        return params.id;
      },
      {
        params: z.object({
          id: z.coerce.number(),
        }),
      },
    );

    const res = await app.handle(new Request("http://localhost/foo/forty"));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual(
      new HttpError.BadRequest("The request is invalid", [
        {
          code: "invalid_type",
          expected: "number",
          received: "NaN",
          message: "Invalid input: expected number, received NaN",
          path: ["id"],
        },
      ]).toJSON(),
    );
  });
});
