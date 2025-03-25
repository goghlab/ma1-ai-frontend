import { CopilotBackend, OpenAIAdapter } from "@copilotkit/backend";

export const POST = async (req: Request): Promise<Response> => {
  const copilotKit = new CopilotBackend();
  return copilotKit.response(req, new OpenAIAdapter({
    model: "grok",
  }));
}; 