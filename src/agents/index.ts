import { initialState } from "./state";
import { OrchestratorAgent } from "./orchestrator";
import { BuilderAgent } from "./builder";
import { PaymentAgent } from "./payment";
import { AnalyticsAgent } from "./analytics";

export function startAgents() {
  const state = { ...initialState };

  console.log("Starting Locus Checkout Studio Agents...");

  const orchestrator = new OrchestratorAgent(state);
  const builder = new BuilderAgent(state);
  const payment = new PaymentAgent(state);
  const analytics = new AnalyticsAgent(state);

  return { orchestrator, builder, payment, analytics };
}
