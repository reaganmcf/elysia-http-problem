import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import { Elysia } from "elysia";
import { elysiaHttpProblem } from "../src/index";

describe("HttpError.Unauthorized", () => {
  it("should handle explicit HttpError.Unauthorized", async () => {
    const app = await new Elysia()
      .use(elysiaHttpProblem())
      .get("/protected", () => {
        throw new HttpError.Unauthorized("Protected resource");
      });

    const res = await app.handle(new Request("http://localhost/protected"));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({
      type: "https://httpstatuses.com/401",
      title: "Unauthorized",
      status: 401,
      detail: "Protected resource",
    });
  });
});
