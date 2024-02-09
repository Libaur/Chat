type DomElements = {
  dialog: HTMLDialogElement | null;
  ul: HTMLUListElement | null;
  li: HTMLLIElement | null;
  form: HTMLFormElement | null;
  input: HTMLInputElement | null;
  button: HTMLButtonElement | null;
  span: HTMLSpanElement | null;
  p: HTMLParagraphElement | null;
};

type Messages = {
  _id: string;
  text: string;
  user: {
    email: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

type EventHandler = (event: Event) => void | Promise<void> | Promise<Messages>;

interface AddEventParams {
  (
    element: DomElements["ul"] | DomElements["form"] | DomElements["button"],
    event: string,
    handler: EventHandler,
  );
}

export { DomElements, AddEventParams, Messages };
