class BaseError extends Error {
   status;
   errors;
   constructor(status: number, messages: string, errors?: any) {
      super(messages);
      this.status = status;
      this.errors = errors;
   }

   static UnauthorizedError() {
      return new BaseError(401, "User is not authorized");
   }

   static BadRequest(message: string, errors = []) {
      return new BaseError(400, message, errors);
   }
   static ValidationError(errors: any) {
      return new BaseError(400, "Validation Error", errors);
   }
   static NotFound(message: string, errors = []) {
      return new BaseError(404, message, errors);
   }
}

export default BaseError;
