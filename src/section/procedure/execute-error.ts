export class ExecuteError extends Error {
	constructor(message: string, public readonly code?: string) {
		super(message)
	}
}
