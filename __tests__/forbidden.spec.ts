import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import { Elysia } from "elysia";
import { elysiaHttpProblem } from "../src/index";

describe("HttpError.Forbidden", () => {
  it("should handle explicit HttpError.Forbidden", async () => {
    const app = await new Elysia()
      .use(elysiaHttpProblem())
      .get("/protected", () => {
        throw new HttpError.Forbidden("Access denied");
      });

    const res = await app.handle(new Request("http://localhost/protected"));
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json).toEqual({
      type: "https://httpstatuses.com/403",
      title: "Forbidden",
      status: 403,
      detail: "Access denied",
    });
  });
});
