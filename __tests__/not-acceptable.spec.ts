import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import { Elysia } from "elysia";
import { elysiaHttpProblemJson } from "../src/index";

describe("HttpError.NotAcceptable", () => {
  it("should handle explicit HttpError.NotAcceptable", async () => {
    const app = await new Elysia()
      .use(elysiaHttpProblemJson())
      .get("/resource", () => {
        throw new HttpError.NotAcceptable("Not acceptable");
      });

    const res = await app.handle(new Request("http://localhost/resource"));
    const json = await res.json();

    expect(res.status).toBe(406);
    expect(json).toEqual({
      type: "https://httpstatuses.com/406",
      title: "Not Acceptable",
      status: 406,
      detail: "Not acceptable",
    });
  });
});
