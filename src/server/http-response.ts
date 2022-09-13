import { ServerResponse } from 'http'

export class HttpResponse {
	constructor(private readonly serverResponse: ServerResponse) {}

	public setStatus(code: number): HttpResponse {
		this.serverResponse.statusCode = code

		return this
	}

	public setHeader(name: string, value: string): HttpResponse {
		this.serverResponse.setHeader(name, value)

		return this
	}

	public setBody(body: string): void {
		this.serverResponse.write(body)
	}
}
