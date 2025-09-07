// Base exception class
export class BaseApplicationException extends Error {
  public statusCode: number;
  constructor(public message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Database exception
export class DatabaseException extends BaseApplicationException {
  constructor(message = "Ocorreu um erro no banco de dados") {
    super(message, 500);
  }
}

// Unauthorized access exception (401)
export class UnauthorizedException extends BaseApplicationException {
  constructor(message = "Acesso não autorizado") {
    super(message, 401);
  }
}

// Forbidden access exception (403)
export class ForbiddenException extends BaseApplicationException {
  constructor(message = "Acesso proibido") {
    super(message, 403);
  }
}

// Unprocessable entity exception (422)
export class UnprocessableEntityException extends BaseApplicationException {
  constructor(message = "Entidade não processável") {
    super(message, 422);
  }
}

// Bad request exception (400)
export class BadRequestException extends BaseApplicationException {
  constructor(message = "Requisição inválida") {
    super(message, 400);
  }
}

// Not found exception (404)
export class NotFoundException extends BaseApplicationException {
  constructor(message = "Recurso não encontrado") {
    super(message, 404);
  }
}

// Conflict exception (409)
export class ConflictException extends BaseApplicationException {
  constructor(message = "Conflito detectado") {
    super(message, 409);
  }
}

// Internal server error exception (500)
export class InternalServerErrorException extends BaseApplicationException {
  constructor(message = "Erro interno do servidor") {
    super(message, 500);
  }
}

// Service unavailable exception (503)
export class ServiceUnavailableException extends BaseApplicationException {
  constructor(message = "Serviço indisponível") {
    super(message, 503);
  }
}
