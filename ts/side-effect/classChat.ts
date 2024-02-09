import { DomElements, Messages } from "../clean/types";
import {
  defineMessageWrap,
  fillMessageInside,
  addSpellcheck,
  createSpellcheck,
  addNotificationOfMessageStoryEnd,
} from "./updUI";

class Chat {
  display: DomElements["ul"];
  messages: Array<Messages>;
  initialLoadingPosition: number;
  loadMessageCount: number;
  messagesToLoad: Array<Messages>;
  constructor(display: DomElements["ul"]) {
    this.display = display;
    this.messages = [];
    this.initialLoadingPosition = 0;
    this.loadMessageCount = 20;
    this.messagesToLoad = [];
  }
  createMessage = (message: Messages): HTMLLIElement => {
    const { li, messageClass, getItem } = defineMessageWrap(message);
    const text = getItem && messageClass === "message" ? getItem : message.text;
    li.innerHTML = fillMessageInside(message, text);
    if (li.classList.contains("message")) {
      addSpellcheck(li, createSpellcheck());
    }
    return li;
  };

  lazyLoading() {
    const nextDownloadGroupOfMessages = this.messagesToLoad.slice(
      this.initialLoadingPosition,
      this.loadMessageCount,
    );
    nextDownloadGroupOfMessages.forEach(message => {
      const li = this.createMessage(message);
      this.display.insertAdjacentElement("afterbegin", li);
    });
    this.messagesToLoad = this.messagesToLoad.slice(this.loadMessageCount);
    if (!this.messagesToLoad.length) {
      this.display.firstChild.before(addNotificationOfMessageStoryEnd());
    }
  }

  async render(messageHistory: Promise<Messages[]>) {
    const receivedMessages = await messageHistory;
    this.messages.push(...receivedMessages);
    this.messagesToLoad.push(...this.messages);
    this.lazyLoading();
  }
}

export { Chat };
