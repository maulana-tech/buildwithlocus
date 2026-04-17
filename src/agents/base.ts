import { AgentEvent, eventBus, GlobalState } from "./state";

export abstract class BaseAgent {
  protected state: GlobalState;

  constructor(initialState: GlobalState) {
    this.state = initialState;
    eventBus.subscribe(this.handleEvent.bind(this));
  }

  abstract handleEvent(event: AgentEvent): void;

  protected updateState(updater: (state: GlobalState) => void) {
    updater(this.state);
    // In a real app, this would trigger a UI re-render or persist to a DB
  }

  protected publish(event: AgentEvent) {
    eventBus.publish(event);
  }
}
