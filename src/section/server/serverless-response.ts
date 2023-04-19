import { IServerResponse } from './server-response'

export class ServerlessResponse implements IServerResponse {
	public statusCode = 0
	public headers: { [name: string]: string } = {}
	public body: string | undefined = undefined

	public setHeader(name: string, value: string): void {
		this.headers[name] = value
	}

	public write(body: string): void {
		this.body = body
	}
}
