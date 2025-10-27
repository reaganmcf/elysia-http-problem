import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import { Elysia } from "elysia";
import { elysiaHttpProblem } from "../src/index";

describe("HttpError.NotImplemented", () => {
  it("should handle explicit HttpError.NotImplemented", async () => {
    const app = await new Elysia()
      .use(elysiaHttpProblem())
      .get("/resource", () => {
        throw new HttpError.NotImplemented("Not implemented");
      });

    const res = await app.handle(new Request("http://localhost/resource"));
    const json = await res.json();

    expect(res.status).toBe(501);
    expect(json).toEqual({
      type: "https://httpstatuses.com/501",
      title: "Not Implemented",
      status: 501,
      detail: "Not implemented",
    });
  });
});
