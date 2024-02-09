import { AddEventParams } from "../clean/types";
import { DomManager } from "../clean/classDomManager";
import { Chat } from "./classChat";
import {
  manageLoadingEvents,
  prepareMessageForSending,
  handleScroll,
  handleAuthCode,
  handleChangeName,
  handleMessageReading,
  handleMessageSpellcheck,
  handleSendCode,
} from "./handlers";
import { scrollDrop } from "./updUI";
import { logOut } from "./updUICookieStorage";
import { ERRORS, RenderError } from "../clean/errors";
import { connect } from "./websocket";

const dom = new DomManager();
const chat = new Chat(dom.display);

const addEvent: AddEventParams = (element, event, handler) => {
  if (!element) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
  element.addEventListener(event, handler);
};

document.addEventListener("DOMContentLoaded", manageLoadingEvents);
window.addEventListener("load", connect);

try {
  addEvent(chat.display, "scroll", handleScroll);
  addEvent(dom.buttons.scrolldrop, "click", scrollDrop);
  addEvent(chat.display, "click", handleMessageSpellcheck);
  addEvent(chat.display, "mouseover", handleMessageReading);
  addEvent(dom.forms.chatForm, "submit", prepareMessageForSending);
  addEvent(dom.forms.authForm, "submit", handleSendCode);
  addEvent(dom.forms.confirmForm, "submit", handleAuthCode);
  addEvent(dom.forms.chooseNameForm, "submit", handleChangeName);
  addEvent(
    dom.forms.chooseNameForm,
    "submit",
    dom.closeDialog["settingsDialog"],
  );
  addEvent(dom.buttons.settingsShow, "click", dom.showDialog["settingsDialog"]);
  addEvent(
    dom.buttons.settingsClose,
    "click",
    dom.closeDialog["settingsDialog"],
  );
  addEvent(dom.buttons.authClose, "click", dom.closeDialog["authDialog"]);
  addEvent(dom.buttons.setCode, "click", dom.showDialog["confirmDialog"]);
  addEvent(dom.buttons.confirmClose, "click", dom.closeDialog["confirmDialog"]);
  addEvent(dom.buttons.confirmClose, "click", dom.closeDialog["authDialog"]);
  addEvent(dom.buttons.chatClose, "click", logOut);
} catch (error) {
  error instanceof RenderError ? console.error(error.message) : error;
}
