import {expect, it, describe} from 'bun:test'
import {Elysia} from 'elysia'
import {elysiaHttpProblem} from '.';
import { ProblemError, NotFound,BadRequest, Unauthorized } from '../src/errors';

describe('elysia-http-problem', () => {
    it('should not trigger error on normal request', async () => {
        const app = await new Elysia()
        .use(elysiaHttpProblem())
        .get('/hello', () => 'world');

        const res = await app.handle(new Request('http://localhost/hello'));
        const text = await res.text();

        expect(res.status).toBe(200);
        expect(text).toBe('world');
    });

    it('converts elysia.NotFoundError to ProblemError', async () => {
        const app = await new Elysia()
        .use(elysiaHttpProblem())
        .get('/hello', () => 'world');

        const res = await app.handle(new Request('http://localhost/unknown'));
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json).toEqual(
            new NotFound(`The requested resource /unknown was not found`).toJSON()
        )
    })
});