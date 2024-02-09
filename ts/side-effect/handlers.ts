import { Chat } from "./classChat";
import { DomManager } from "../clean/classDomManager";
import {
  TOKEN_NAME,
  getMessageHistory,
  sendCode,
  changeName,
} from "../requests";
import {
  isTokenExist,
  getInputValue,
  getDataFromCookie,
} from "../clean/helpers";
import {
  setAuthCodeToCookie,
  markMessageAsRead,
  correctAndEditMessageText
} from "./updUICookieStorage";
import {
  actionsForIncorrectCodeCase,
  dropScrollAfterLoading,
  scrollDrop,
  scrollBounce,
  actionsForNoEmail,
} from "./updUI";
import { sendMessage } from "./websocket";
import {
  ERRORS,
  ParseError,
  RenderError,
  ConnectionError,
} from "../clean/errors";

const dom = new DomManager();
const chat = new Chat(dom.display);

const PATTERN = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+$/;

function manageLoadingEvents() {
  if (!isTokenExist(TOKEN_NAME)) {
    dom.showDialog["authDialog"];
  }
  chat.render(getMessageHistory());
  dropScrollAfterLoading(scrollDrop);
}

function handleMessage(event: MessageEvent) {
  try {
    const incomingMessage = JSON.parse(event.data);
    if (!incomingMessage) throw new ParseError(ERRORS.PARSE_ERROR_MESSAGE);
    const addedMessage = chat.createMessage(incomingMessage);
    chat.display.appendChild(addedMessage);
  } catch (error) {
    error instanceof ParseError ? console.error(error.message) : error;
  }
  scrollDrop();
}

function prepareMessageForSending(event: Event) {
  event.preventDefault();
  try {
    const value = getInputValue(dom.inputs.chatInput);
    sendMessage(value);
  } catch (error) {
    error instanceof RenderError || error instanceof ConnectionError
      ? console.error(error.message)
      : error;
  }
  dom.resetForm("chatForm");
}

function handleMessageSpellcheck(event: Event) {
  const element = event.target as HTMLElement;
  if (element.tagName !== "SPAN") return;
  try {
    correctAndEditMessageText(element);
  } catch (error) {
    error instanceof RenderError ? console.error(error.message) : error;
  }
}

function handleAuthCode(event: Event) {
  try {
    if (!getDataFromCookie("email")) {
      event.preventDefault();
      actionsForNoEmail(dom.spans.confOutput);
      return;
    }
    const code = getInputValue(dom.inputs.confirmInput);
    if (!PATTERN.test(code)) {
      event.preventDefault();
      actionsForIncorrectCodeCase(dom.spans.confOutput);
      return;
    }
    setAuthCodeToCookie(TOKEN_NAME, code);
  } catch (error) {
    error instanceof RenderError ? console.error(error.message) : error;
  }
  dom.resetForm("confirmForm");
}

function handleScroll() {
  if (!chat.messagesToLoad.length) return;
  if (!chat.display.scrollTop) {
    chat.lazyLoading();
    scrollBounce();
  }
}

function handleChangeName(event: Event) {
  event.preventDefault();
  if (!dom.inputs.chooseNameInput)
    throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
  changeName(dom.inputs.chooseNameInput);
  dom.resetForm("chooseNameForm");
}

function handleMessageReading(event: Event) {
  const element = event.target as HTMLElement;
  const partnerMessage =
    element.tagName === "LI" && element.classList.contains("partner__message");
  const id = partnerMessage ? element.getAttribute("id") : null;
  markMessageAsRead(id, element);
}

function handleSendCode(event: Event) {
  event.preventDefault();
  if (!dom.inputs.authInput) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
  sendCode(dom.inputs.authInput);
}

export {
  manageLoadingEvents,
  prepareMessageForSending,
  handleMessage,
  handleAuthCode,
  handleChangeName,
  handleMessageReading,
  handleMessageSpellcheck,
  handleScroll,
  handleSendCode,
};
