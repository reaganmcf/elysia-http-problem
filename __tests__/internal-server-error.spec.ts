import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import { Elysia, InternalServerError } from "elysia";
import { elysiaHttpProblem } from "../src/index";

describe("HttpError.InternalServerError", () => {
  it("should handle explicit InternalServerError", async () => {
    const app = await new Elysia()
      .use(elysiaHttpProblem())
      .get("/error", () => {
        throw new HttpError.InternalServerError("Database connection failed");
      });

    const res = await app.handle(new Request("http://localhost/error"));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      type: "https://httpstatuses.com/500",
      title: "Internal Server Error",
      status: 500,
      detail: "Database connection failed",
    });
  });

  it("should map generic Error to InternalServerError", async () => {
    const app = await new Elysia()
      .use(elysiaHttpProblem())
      .get("/error", () => {
        throw new Error("Something went wrong");
      });

    const res = await app.handle(new Request("http://localhost/error"));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      type: "https://httpstatuses.com/500",
      title: "Internal Server Error",
      status: 500,
      detail: "Something went wrong",
    });
  });

  it("should map elysia.InternalServerError to HttpError.InternalServerError", async () => {
    const app = await new Elysia()
      .use(elysiaHttpProblem())
      .get("/error", () => {
        throw new InternalServerError("Elysia internal error");
      });

    const res = await app.handle(new Request("http://localhost/error"));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      type: "https://httpstatuses.com/500",
      title: "Internal Server Error",
      status: 500,
      detail: "Elysia internal error",
    });
  });
});
