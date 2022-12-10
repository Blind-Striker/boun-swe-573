import { action, createModule, mutation } from "vuex-class-component";
import { v4 as uuidv4 } from "uuid";

const VuexModule = createModule({
  namespaced: "message_box",
  strict: false,
});

export interface Message {
  id?: string;
  text: string;
  type: "success" | "error" | "warning" | "info";
  timeout: number;
  dismissible: boolean;
}

export const defaultMessage: Message = {
  id: "",
  text: "",
  type: "info",
  timeout: 0,
  dismissible: true,
};

export default class MessageBoxStore extends VuexModule.With({
  namespaced: "message_box",
}) {
  private _messages: Message[] = [];

  get messages() {
    return this._messages;
  }

  @mutation addMessageMutate(message: Message) {
    this._messages.push(message);
  }

  @mutation removeMessageMutate(id: string) {
    this._messages = this._messages.filter((message) => message.id !== id);
  }

  @action async addMessage(message: Message) {
    const id = uuidv4();
    this.addMessageMutate({ ...defaultMessage, ...message, id: id });

    if (message.timeout > 0) {
      setTimeout(() => {
        this.removeMessageMutate(id);
      }, message.timeout);
    }
  }

  @action async removeMessage(id: string) {
    this.removeMessageMutate(id);
  }
}
