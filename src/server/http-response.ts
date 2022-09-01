import { ServerResponse } from 'http'

export interface IHttpResponse {
	setStatus(code: number): IHttpResponse
	setHeader(name: string, value: string): IHttpResponse
	setBody(body: string): void
}

export class HttpResponse implements IHttpResponse {
	constructor(private readonly serverResponse: ServerResponse) {}

	public setStatus(code: number): IHttpResponse {
		this.serverResponse.statusCode = code

		return this
	}

	public setHeader(name: string, value: string): IHttpResponse {
		this.serverResponse.setHeader(name, value)

		return this
	}

	public setBody(body: string): void {
		this.serverResponse.write(body)
	}
}
