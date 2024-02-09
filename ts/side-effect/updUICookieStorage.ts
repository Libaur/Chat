import Cookies from "js-cookie";
import { DomElements } from "../clean/types";
import { STYLE } from "../clean/classDomManager";
import { TOKEN_NAME } from "../requests";
import { ACCESS, ERRORS, RenderError } from "../clean/errors";
import { obtainMessageWrap, prepareToCorrectText } from "../clean/helpers";

const setAuthCodeToCookie = (tokenName: string, value: string) =>
  Cookies.set(tokenName, `${value}`, { expires: 14 });

const setEmailToCookie = (email: string) => {
  Cookies.set("email", email, { expires: 14 });
};

function actionsAfterSuccess(output: DomElements["span"], email: string) {
  if (!output) throw new RenderError(ERRORS.RENDER_ERROR_MESSAGE);
  output.className = STYLE.SUCCESS;
  output.textContent = ACCESS.SUCCESS_AUTH_MESSAGE;
  setEmailToCookie(email);
}

function logOut() {
  Cookies.remove("email");
  Cookies.remove(TOKEN_NAME);
  location.reload();
}

function markMessageAsRead(id: string, element: HTMLElement) {
  if (!id) return;
  element.classList.remove("unread");
  localStorage.setItem(id, "read");
}

async function editMessageText(
  draftedData: Promise<{
    id: string;
    textWrapper: HTMLSpanElement;
    correctedText: string[];
  }>,
) {
  const { id, textWrapper, correctedText } = await draftedData;
  textWrapper.textContent = correctedText.join(" ");
  localStorage.setItem(id, textWrapper.textContent);
}

async function correctAndEditMessageText(element: HTMLElement) {
  const message = obtainMessageWrap(element);
  const draftedData = prepareToCorrectText(message);
  await editMessageText(draftedData);
}

export {
  logOut,
  markMessageAsRead,
  actionsAfterSuccess,
  setAuthCodeToCookie,
  correctAndEditMessageText
};
