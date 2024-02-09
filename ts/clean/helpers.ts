import Cookies from "js-cookie";
import { DomElements } from "./types";
import { obtainCorrectedText } from "../side-effect/updUI";
import { CookieError, RenderError, ERRORS } from "./errors";

const isTokenExist = (name: string): boolean =>
  Cookies.get(name) ? true : false;

function getInputValue(input: DomElements["input"]) {
  if (!input) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
  return input.value;
}

function getDataFromCookie(dataName: string) {
  try {
    const data = Cookies.get(dataName);
    if (!data) throw new CookieError(ERRORS.COOKIE_ERROR_MESSAGE);
    return data;
  } catch (error) {
    error instanceof CookieError ? console.error(error.message) : error;
    return null;
  }
}

function obtainMessageWrap(element: HTMLElement) {
  const bottomMenu =
    element.parentNode instanceof HTMLDivElement ? element.parentNode : null;
  if (!bottomMenu) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
  const message =
    bottomMenu.parentNode instanceof HTMLLIElement
      ? bottomMenu.parentNode
      : null;
  if (!message) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
  return message;
}

async function prepareToCorrectText(message: HTMLLIElement) {
  const id = message.getAttribute("id");
  if (!id) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
  const textWrapper: DomElements["span"] = message.querySelector(".text");
  if (!textWrapper) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
  const text = textWrapper.textContent;
  const correctedText = await obtainCorrectedText(text);
  return { id, textWrapper, correctedText };
}

export {
  isTokenExist,
  getInputValue,
  getDataFromCookie,
  obtainMessageWrap,
  prepareToCorrectText,
};
