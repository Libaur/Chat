import { STYLE, DomManager } from "../clean/classDomManager";
import { Chat } from "./classChat";
import { DomElements, Messages } from "../clean/types";
import { getDataFromCookie } from "../clean/helpers";
import { actionsAfterSuccess } from "./updUICookieStorage";
import { requestToSpellcheck } from "../requests";
import { ACCESS, ERRORS, RenderError } from "../clean/errors";

const MESSAGES_OUT = "Вся история загружена";

const dom = new DomManager();
const chat = new Chat(dom.display);

const scrollBounce = () => {
  const scrollBounce = chat.display.scrollHeight / 7;
  chat.display.scrollTop = scrollBounce;
};

function scrollDrop() {
  chat.display.scrollTop = chat.display.scrollHeight;
}

function dropScrollAfterLoading(scrollDrop: () => void) {
  setTimeout(() => {
    scrollDrop();
  }, 500);
}

function addNotificationOfMessageStoryEnd() {
  const finallyMessage: HTMLSpanElement = document.createElement("span");
  finallyMessage.textContent = MESSAGES_OUT;
  finallyMessage.classList.add("happy__end");
  return finallyMessage;
}

function actionsAfterFail(output: DomElements["span"]) {
  if (!output) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
  output.className = STYLE.FAIL;
  output.textContent = ACCESS.FAIL_AUTH_MESSAGE;
}

function defineMessageWrap(message: Messages) {
  const messageClass =
    message.user.email === getDataFromCookie("email")
      ? "message"
      : "partner__message";
  const li = document.createElement("li");
  li.setAttribute("id", message._id);
  li.className = messageClass;
  const getItem = localStorage.getItem(message._id);
  if (getItem !== "read") li.classList.add("unread");
  return { li, messageClass, getItem };
}

function fillMessageInside(message: Messages, text: string) {
  return `<p class="message__output">${message.user.name}: <span class="text">${text}</span></p>
      <div class="bottom__menu">
      <span class="sending__time">${new Date(
        message.createdAt,
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}</span></div>
    `;
}

function addSpellcheck(li: HTMLLIElement, spellcheck: HTMLSpanElement) {
  try {
    const bottomMenu = li.querySelector(".bottom__menu");
    if (!bottomMenu) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
    bottomMenu.classList.add("with__spellcheck");
    const sendingTime = li.querySelector(".sending__time");
    if (!sendingTime) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
    bottomMenu.insertBefore(spellcheck, sendingTime);
  } catch (error) {
    error instanceof RenderError ? console.error(error.message) : error;
  }
}

function createSpellcheck() {
  const spellcheck = document.createElement("span");
  spellcheck.className = "spellcheck";
  spellcheck.textContent = "правописание";
  return spellcheck;
}

function actionsForIncorrectCodeCase(output: DomElements["span"]) {
  if (!output) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
  output.className = STYLE.FAIL;
  output.textContent = ACCESS.FAIL_CONF_MESSAGE;
}

function actionsForNoEmail(output: DomElements["span"]) {
  if (!output) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
  output.className = STYLE.FAIL;
  output.textContent = ACCESS.NEED_EMAIL_MESSAGE;
}

function processResponse(response: { success: boolean }, email: string) {
  if (!dom.spans.authOutput) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
  if (!response.success) actionsAfterFail(dom.spans.authOutput);
  actionsAfterSuccess(dom.spans.authOutput, email);
}

async function obtainCorrectedText(text: string) {
  const draftedText = text.split(" ");
  const correctedText = await Promise.all(
    draftedText.map(async word => {
      return await requestToSpellcheck(word);
    }),
  );
  return correctedText;
}

export {
  dropScrollAfterLoading,
  scrollDrop,
  scrollBounce,
  processResponse,
  defineMessageWrap,
  fillMessageInside,
  addSpellcheck,
  createSpellcheck,
  obtainCorrectedText,
  addNotificationOfMessageStoryEnd,
  actionsForNoEmail,
  actionsForIncorrectCodeCase,
};
