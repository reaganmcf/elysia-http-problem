import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import { Elysia } from "elysia";
import { httpProblemJsonPlugin } from "../src/index";

describe("HttpError.NotFound", () => {
  it("should handle explicit HttpError.NotFound", async () => {
    const app = await new Elysia()
      .use(httpProblemJsonPlugin())
      .get("/foo", () => {
        throw new HttpError.NotFound(
          "The requested resource /foo was not found",
        );
      });

    const res = await app.handle(new Request("http://localhost/foo"));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({
      type: "https://httpstatuses.com/404",
      title: "Not Found",
      status: 404,
      detail: "The requested resource /foo was not found",
    });
  });

  it("should map elysia.NotFound to HttpError.NotFound", async () => {
    const app = await new Elysia()
      .use(httpProblemJsonPlugin())
      .get("/foo", () => "bar");

    const res = await app.handle(new Request("http://localhost/unknown"));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({
      type: "https://httpstatuses.com/404",
      title: "Not Found",
      status: 404,
      detail: "The requested resource /unknown was not found",
    });
  });
});
