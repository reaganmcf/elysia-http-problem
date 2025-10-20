import { expect, describe, it } from 'bun:test';
import { HttpError } from '../src/errors';
import {Elysia, InternalServerError } from 'elysia';
import {elysiaHttpProblem} from '../src/index';

describe('HttpError.NotFound', () => {
    it('should handle explicit HttpError.NotFound', async () => {
        const app = await   new Elysia()
        .use(elysiaHttpProblem())
        .get('/foo', () => {
            throw new HttpError.NotFound('The requested resource /foo was not found');
        })

        const res = await app.handle(new Request('http://localhost/foo'));
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json).toEqual(
            new HttpError.NotFound('The requested resource /foo was not found').toJSON()
        )
    });

    it('should map elysia.NotFound to HttpError.NotFound', async () => {
        const app = await   new Elysia()
        .use(elysiaHttpProblem())
        .get('/foo', () => 'bar');

        const res = await app.handle(new Request('http://localhost/unknown'));
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json).toEqual(
            new HttpError.NotFound('The requested resource /unknown was not found').toJSON()
        )
    });
});