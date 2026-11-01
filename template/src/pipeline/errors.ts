export type PipelineErrorCode = "INVALID_TRANSITION" | "LEAD_NOT_FOUND" | "TERMINAL_STAGE";

export class PipelineError extends Error {
  readonly code: PipelineErrorCode;

  constructor(code: PipelineErrorCode, message: string) {
    super(message);
    this.name = "PipelineError";
    this.code = code;
  }
}
