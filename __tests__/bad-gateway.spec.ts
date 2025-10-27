import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import { Elysia } from "elysia";
import { elysiaHttpProblem } from "../src/index";

describe("HttpError.BadGateway", () => {
  it("should handle explicit HttpError.BadGateway", async () => {
    const app = await new Elysia()
      .use(elysiaHttpProblem())
      .get("/resource", () => {
        throw new HttpError.BadGateway("Bad gateway");
      });

    const res = await app.handle(new Request("http://localhost/resource"));
    const json = await res.json();

    expect(res.status).toBe(502);
    expect(json).toEqual({
      type: "https://httpstatuses.com/502",
      title: "Bad Gateway",
      status: 502,
      detail: "Bad gateway",
    });
  });
});
