export class ProblemError extends Error {
    type: string;
    title: string;
    status: number;
    detail?: string;
    instance?: string;

    constructor(type :string, title: string, status: number, detail?: string, instance?: string) {
        super(detail || title);
        this.type = type;
        this.title = title;
        this.status = status;
        this.detail = detail;
        this.instance = instance;
    }

    toJSON() {
        return {
            type: this.type,
            title: this.title,
            status: this.status,
            ...(this.detail && {detail: this.detail}),
            ...(this.instance && {instance: this.instance})
        }
    }
}

export class BadRequest extends ProblemError {
    errors?: Array<{field: string, message: string}>;
    
    constructor(message: string, errors?: Array<{field: string, message: string}>) {
        super("https://httpstatuses.com/400", "Bad Request", 400, message);

        this.errors = errors;
    }
}

export class NotFound extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/404", "Not Found", 404, detail);
    }
}

export class Unauthorized extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/401", "Unauthorized", 401, detail);
    }
}