import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import { Elysia } from "elysia";
import { httpProblemJsonPlugin } from "../src/index";

describe("HttpError.Conflict", () => {
  it("should handle explicit HttpError.Conflict", async () => {
    const app = await new Elysia()
      .use(httpProblemJsonPlugin())
      .get("/resource", () => {
        throw new HttpError.Conflict("Resource already exists");
      });

    const res = await app.handle(new Request("http://localhost/resource"));
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json).toEqual({
      type: "https://httpstatuses.com/409",
      title: "Conflict",
      status: 409,
      detail: "Resource already exists",
    });
  });
});
