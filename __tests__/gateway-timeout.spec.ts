import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import { Elysia } from "elysia";
import { elysiaHttpProblem } from "../src/index";

describe("HttpError.GatewayTimeout", () => {
  it("should handle explicit HttpError.GatewayTimeout", async () => {
    const app = await new Elysia()
      .use(elysiaHttpProblem())
      .get("/resource", () => {
        throw new HttpError.GatewayTimeout("Gateway timeout");
      });

    const res = await app.handle(new Request("http://localhost/resource"));
    const json = await res.json();

    expect(res.status).toBe(504);
    expect(json).toEqual({
      type: "https://httpstatuses.com/504",
      title: "Gateway Timeout",
      status: 504,
      detail: "Gateway timeout",
    });
  });
});
