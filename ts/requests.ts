import * as dotenv from "dotenv";
import { Messages, DomElements } from "./clean/types";
import { getDataFromCookie } from "./clean/helpers";
import { processResponse } from "./side-effect/updUI";
import { ERRORS, RequestError, ParseError, RenderError } from "./clean/errors";

dotenv.config();

const TOKEN_NAME = process.env.TOKEN_NAME;
const TOKEN = getDataFromCookie(TOKEN_NAME);

const HEADERS = {
  BASE: { "Content-Type": "application/json;charset=utf-8" },
  AUTH: { Authorization: `${TOKEN_NAME} ${TOKEN}` },
};

const connectionOptions = `${process.env.WEB_SOCKET_URL}${TOKEN}`;

async function getMessageHistory(): Promise<Messages[]> {
  try {
    const getMessagesResponse = await fetch(process.env.MESSAGES_URL, {
      method: "GET",
      headers: {
        ...HEADERS.BASE,
        ...HEADERS.AUTH,
      },
    });
    if (!getMessagesResponse.ok)
      throw new RequestError(ERRORS.REQEST_ERROR_MESSAGE);
    const data = await getMessagesResponse.json();
    if (!data) throw new ParseError(ERRORS.PARSE_ERROR_MESSAGE);
    return data.messages;
  } catch (error) {
    error instanceof RequestError || error instanceof ParseError
      ? console.error(error.message)
      : error;
    return [];
  }
}

async function requestToSpellcheck(text: string): Promise<string> {
  try {
    const getCorrectedMessageResponse = await fetch(
      process.env.SPELLER_URL + text,
      {
        method: "GET",
      },
    );
    if (!getCorrectedMessageResponse.ok)
      throw new RequestError(ERRORS.REQEST_ERROR_MESSAGE);
    const data = await getCorrectedMessageResponse.json();
    if (!data) throw new ParseError(ERRORS.PARSE_ERROR_MESSAGE);
    const correctedWord = data[0].s[0];
    return correctedWord;
  } catch (error) {
    error instanceof RequestError || error instanceof ParseError
      ? console.error(error.message)
      : error;
    return text;
  }
}

async function changeName(input: DomElements["input"]): Promise<void> {
  try {
    const name = input.value;

    const setNameResponse = await fetch(process.env.BASE_URL, {
      method: "PATCH",
      headers: {
        ...HEADERS.BASE,
        ...HEADERS.AUTH,
      },
      body: JSON.stringify({ name: name }),
    });
    if (!setNameResponse.ok)
      throw new RequestError(ERRORS.REQEST_ERROR_MESSAGE);
  } catch (error) {
    error instanceof RenderError || error instanceof RequestError
      ? console.error(error.message)
      : error;
  }
}

async function sendCode(input: DomElements["input"]): Promise<void> {
  let status: boolean;
  let email: string;
  try {
    email = input.value;

    const response = await fetch(process.env.BASE_URL, {
      method: "POST",
      headers: HEADERS.BASE,
      body: JSON.stringify({ email: email }),
    });
    if (!response.ok) {
      status = false;
      throw new RequestError(ERRORS.REQEST_ERROR_MESSAGE);
    }
    status = true;
  } catch (error) {
    error instanceof RenderError || error instanceof RequestError
      ? console.error(error.message)
      : error;
  } finally {
    processResponse({ success: status }, email);
  }
}

export {
  TOKEN_NAME,
  HEADERS,
  connectionOptions,
  getMessageHistory,
  requestToSpellcheck,
  changeName,
  sendCode,
};
