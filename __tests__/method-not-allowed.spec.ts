import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import { Elysia } from "elysia";
import { elysiaHttpProblem } from "../src/index";

describe("HttpError.MethodNotAllowed", () => {
  it("should handle explicit HttpError.MethodNotAllowed", async () => {
    const app = await new Elysia()
      .use(elysiaHttpProblem())
      .get("/resource", () => {
        throw new HttpError.MethodNotAllowed("Method not allowed");
      });

    const res = await app.handle(new Request("http://localhost/resource"));
    const json = await res.json();

    expect(res.status).toBe(405);
    expect(json).toEqual({
      type: "https://httpstatuses.com/405",
      title: "Method Not Allowed",
      status: 405,
      detail: "Method not allowed",
    });
  });
});
