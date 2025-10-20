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


// 40X Errors
class BadRequest extends ProblemError {
    errors?: Array<{field: string, message: string}>;
    
    constructor(message: string, errors?: Array<{field: string, message: string}>) {
        super("https://httpstatuses.com/400", "Bad Request", 400, message);

        this.errors = errors;
    }
}

class Unauthorized extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/401", "Unauthorized", 401, detail);
    }
}

class PaymentRequired extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/402", "Payment Required", 402, detail);
    }
}

class Forbidden extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/403", "Forbidden", 403, detail);
    }
}

class NotFound extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/404", "Not Found", 404, detail);
    }
}

class MethodNotAllowed extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/405", "Method Not Allowed", 405, detail);
    }
}

class NotAcceptable extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/406", "Not Acceptable", 406, detail);
    }
}

class Conflict extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/409", "Conflict", 409, detail);
    }
}  

// 50X Errors
class InternalServerError extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/500", "Internal Server Error", 500, detail);
    }
}

class NotImplemented extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/501", "Not Implemented", 501, detail);
    }
}

class BadGateway extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/502", "Bad Gateway", 502, detail);
    }
}

class ServiceUnavailable extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/503", "Service Unavailable", 503, detail);
    }
}

class GatewayTimeout extends ProblemError {
    constructor(detail?: string) {
        super("https://httpstatuses.com/504", "Gateway Timeout", 504, detail);
    }
}

export const HttpError = {
    BadRequest,
    Unauthorized,
    PaymentRequired,
    Forbidden,
    NotFound,
    MethodNotAllowed,
    NotAcceptable,
    Conflict,
    InternalServerError,
    NotImplemented,
    BadGateway,
    ServiceUnavailable,
    GatewayTimeout
} as const