import { DomElements } from "./types";
import { TOKEN_NAME } from "../requests";
import { isTokenExist } from "./helpers";

class DomManager {
  display: DomElements["ul"];
  dialogs: { [key: string]: DomElements["dialog"] };
  forms: { [key: string]: DomElements["form"] };
  inputs: { [key: string]: DomElements["input"] };
  buttons: { [key: string]: DomElements["button"] };
  spans: { [key: string]: DomElements["span"] };

  constructor() {
    this.display = document.querySelector(".chat__display");
    this.dialogs = {
      settingsDialog: document.querySelector("#settings"),
      confirmDialog: document.querySelector("#confirm_code"),
      authDialog: document.querySelector("#auth"),
    };
    this.forms = {
      chatForm: document.querySelector(".chat__form"),
      authForm: document.querySelector("#auth_form"),
      confirmForm: document.querySelector("#confirm_form"),
      chooseNameForm: document.querySelector("#choose_name_form"),
    };
    this.inputs = {
      chatInput: document.querySelector("#write_message"),
      chooseNameInput: document.querySelector("#choose_name_input"),
      authInput: document.querySelector("#auth_input"),
      confirmInput: document.querySelector("#confirm_input"),
    };
    this.buttons = {
      scrolldrop: document.querySelector("#scrolldrop"),
      settingsShow: document.querySelector("#settings_show"),
      settingsClose: document.querySelector("#settings_close"),
      authClose: document.querySelector("#auth_close"),
      confirmClose: document.querySelector("#confirm_close"),
      setCode: document.querySelector("#set_code"),
      getCode: document.querySelector("#get_code"),
      chatClose: document.querySelector("#close"),
    };
    this.spans = {
      authOutput: document.querySelector("#auth_output"),
      confOutput: document.querySelector("#conf_output"),
    };
  }
  showDialog(dialogName: string) {
    this.dialogs[dialogName].showModal();
    this.dialogs[dialogName].classList.add(STYLE.VISIBLE);
  }
  closeDialog(dialogName: string) {
    const unauthorized =
      this.dialogs[dialogName] === this.dialogs.authDialog &&
      !isTokenExist(TOKEN_NAME);
    if (unauthorized) return;
    this.dialogs[dialogName].close();
    this.dialogs[dialogName].classList.remove(STYLE.VISIBLE);
  }
  resetForm(formName: string) {
    this.forms[formName].reset();
  }
}

const STYLE = {
  VISIBLE: "visible",
  SUCCESS: "success",
  FAIL: "fail",
};

export { STYLE, DomManager };
