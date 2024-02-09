const ACCESS = {
  SUCCESS_AUTH_MESSAGE:
    "Проверьте почтовый ящик (не забудьте заглянуть в спам)",
  FAIL_AUTH_MESSAGE:
    "Сейчас наш кодогенератор приуныл. Пожалуйста, повторите попытку позже",
  FAIL_CONF_MESSAGE: "Код недействителен",
  NEED_EMAIL_MESSAGE: "Пожалуйста, запросите отправку нового кода",
};

const ERRORS = {
  RENDER_ERROR_MESSAGE: "Не удалось обновить интерфейс",
  REQEST_ERROR_MESSAGE: "Не удалось отправить код",
  CONNECTION_ERROR_MESSAGE: "Не удалось установить соединение",
  PARSE_ERROR_MESSAGE: "Не удалось приобразовать полученные данные",
  COOKIE_ERROR_MESSAGE: "Не удалось получить данные из кук",
};

class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}

class RenderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RenderError";
  }
}

class RequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RequestError";
  }
}

class ConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConnectionError";
  }
}

class CookieError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CookieError";
  }
}

export {
  ACCESS,
  ERRORS,
  ParseError,
  RenderError,
  RequestError,
  ConnectionError,
  CookieError,
};
