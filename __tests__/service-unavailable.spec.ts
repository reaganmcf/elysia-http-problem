import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import { Elysia } from "elysia";
import { elysiaHttpProblem } from "../src/index";

describe("HttpError.ServiceUnavailable", () => {
  it("should handle explicit HttpError.ServiceUnavailable", async () => {
    const app = await new Elysia()
      .use(elysiaHttpProblem())
      .get("/resource", () => {
        throw new HttpError.ServiceUnavailable("Service unavailable");
      });

    const res = await app.handle(new Request("http://localhost/resource"));
    const json = await res.json();

    expect(res.status).toBe(503);
    expect(json).toEqual({
      type: "https://httpstatuses.com/503",
      title: "Service Unavailable",
      status: 503,
      detail: "Service unavailable",
    });
  });
});
