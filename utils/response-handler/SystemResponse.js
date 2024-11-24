const StatusCodes = require("../response-handler/statusCodes");

class SystemResponse {
  static success(message, data, datalength) {
    return {
      success: true,
      data: data ?? null,
      datalength: datalength ?? null,
      message: message ?? "SUCCESS",
      status: StatusCodes.SUCCESS,
    };
  }
  static createsuccess(message, data) {
    return {
      success: true,
      data: data ?? null,
      message: message ?? "SUCCESS",
      status: StatusCodes.CREATE,
    };
  }

  static badRequest(message, error) {
    return SystemResponse.getErrorResponse(
      message,
      error,
      StatusCodes.BAD_REQUEST
    );
  }

  static invalidData(message) {
    return {
      success: false,
      message: message ?? "Invalid data",
      status: StatusCodes.UNPROCESSABLE_ENTITY,
    };
  }

  static notFound(message) {
    return {
      success: false,
      message: message ?? "Data not found",
      status: StatusCodes.NOT_FOUND,
    };
  }

  static unAuthourized(message) {
    return {
      success: false,
      message: message ?? "You have not access",
      status: StatusCodes.UNAUTHORIZED,
    };
  }


  static unAuthenticated(message) {
    return {
      success: false,
      message: message ?? "Unauthorized",
      status: StatusCodes.FORBIDDEN,
    };
  }

  static getErrorResponse(message, error, code) {
    return {
      success: false,
      error: error ?? null,
      message: message ?? "Internal Server Error",
      status: code ?? StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
}

module.exports = SystemResponse;
