import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import { Elysia } from "elysia";
import { httpProblemJsonPlugin } from "../src/index";

describe("HttpError.PaymentRequired", () => {
  it("should handle explicit HttpError.PaymentRequired", async () => {
    const app = await new Elysia()
      .use(httpProblemJsonPlugin())
      .get("/resource", () => {
        throw new HttpError.PaymentRequired("Payment required");
      });

    const res = await app.handle(new Request("http://localhost/resource"));
    const json = await res.json();

    expect(res.status).toBe(402);
    expect(json).toEqual({
      type: "https://httpstatuses.com/402",
      title: "Payment Required",
      status: 402,
      detail: "Payment required",
    });
  });
});
