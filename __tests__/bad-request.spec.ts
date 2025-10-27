import { expect, describe, it } from "bun:test";
import { HttpError } from "../src/errors";
import {
  Elysia,
  fileType,
  InternalServerError,
  InvalidCookieSignature,
} from "elysia";
import { elysiaHttpProblem } from "../src/index";
import z from "zod";
import { InvalidFileType } from "elysia/error";

describe("HttpError.BadRequest", () => {
  it("should handle explicit HttpError.BadRequest", async () => {
    const app = await new Elysia().use(elysiaHttpProblem()).get("/foo", () => {
      throw new HttpError.BadRequest("This is a bad request", {
        field: "name",
        message: "Name is required",
      });
    });

    const res = await app.handle(new Request("http://localhost/foo"));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      type: "https://httpstatuses.com/400",
      title: "Bad Request",
      status: 400,
      detail: "This is a bad request",
      field: "name",
      message: "Name is required",
    });
  });

  it("should map elysia.ValidationError to HttpError.BadRequest", async () => {
    const app = await new Elysia().use(elysiaHttpProblem()).get(
      "/foo/:id",
      ({ params }) => {
        return params.id;
      },
      {
        params: z.object({
          id: z.coerce.number(),
        }),
      },
    );

    const res = await app.handle(new Request("http://localhost/foo/forty"));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      type: "https://httpstatuses.com/400",
      title: "Bad Request",
      status: 400,
      detail: "The request is invalid",
      errors: [
        {
          code: "invalid_type",
          expected: "number",
          received: "NaN",
          path: ["id"],
          message: "Invalid input: expected number, received NaN",
        },
      ],
    });
  });

  it("should map elysia.ParseError  to HttpError.BadRequest", async () => {
    const app = await new Elysia()
      .use(elysiaHttpProblem())
      .post("/foo", ({ body }) => {
        return body;
      });

    const res = await app.handle(
      new Request("http://localhost/foo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "{ invalidJson: true ",
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      type: "https://httpstatuses.com/400",
      title: "Bad Request",
      status: 400,
      detail: "The request could not be parsed: Bad Request",
    });
  });

  it("should map elysia.InvalidCookieSignature to HttpError.Unauthorized", async () => {
    const app = await new Elysia()
      .use(elysiaHttpProblem())
      .get("/protected", () => {
        throw new InvalidCookieSignature("foo");
      });

    const res = await app.handle(new Request("http://localhost/protected"));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      type: "https://httpstatuses.com/400",
      title: "Bad Request",
      status: 400,
      detail: "The provided cookie signature is invalid",
      key: "foo",
    });
  });

  it("should map elysia.InvalidFileType to HttpError.BadRequest", async () => {
    const app = await new Elysia().use(elysiaHttpProblem()).post(
      "/upload",
      async ({ body }) => {
        await fileType(body.file, "application/json");
        return { success: true };
      },
      {
        body: z.object({
          file: z.file(),
        }),
      },
    );

    const jpegFile = new File(["dummy content"], "photo.jpg", {
      type: "image/jpeg",
    });

    const formData = new FormData();
    formData.append("file", jpegFile);
    const res = await app.handle(
      new Request("http://localhost/upload", {
        method: "POST",
        body: formData,
      }),
    );

    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json).toEqual({
      type: "https://httpstatuses.com/400",
      title: "Bad Request",
      status: 400,
      detail: '"photo.jpg" has invalid file type',
      property: "photo.jpg",
      expected: "application/json",
    });
  });
});
