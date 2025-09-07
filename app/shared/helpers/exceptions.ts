// Base exception class
export class BaseApplicationException extends Error {
  constructor(public message: string) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Database exception
export class DatabaseException extends BaseApplicationException {
  constructor(message = "Ocorreu um erro no banco de dados") {
    super(message);
  }
}

// Unauthorized access exception (401)
export class UnauthorizedException extends BaseApplicationException {
  constructor(message = "Acesso não autorizado") {
    super(message);
  }
}

// Forbidden access exception (403)
export class ForbiddenException extends BaseApplicationException {
  constructor(message = "Acesso proibido") {
    super(message);
  }
}

// Unprocessable entity exception (422)
export class UnprocessableEntityException extends BaseApplicationException {
  constructor(message = "Entidade não processável") {
    super(message);
  }
}

// Bad request exception (400)
export class BadRequestException extends BaseApplicationException {
  constructor(message = "Requisição inválida") {
    super(message);
  }
}

// Not found exception (404)
export class NotFoundException extends BaseApplicationException {
  constructor(message = "Recurso não encontrado") {
    super(message);
  }
}

// Conflict exception (409)
export class ConflictException extends BaseApplicationException {
  constructor(message = "Conflito detectado") {
    super(message);
  }
}

// Internal server error exception (500)
export class InternalServerErrorException extends BaseApplicationException {
  constructor(message = "Erro interno do servidor") {
    super(message);
  }
}

// Service unavailable exception (503)
export class ServiceUnavailableException extends BaseApplicationException {
  constructor(message = "Serviço indisponível") {
    super(message);
  }
}
