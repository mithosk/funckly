import { HttpResponse } from '../server/http-response'

type TStatusCode = 200 | 201 | 204 | 400 | 403 | 404 | 500
type TStandardHeader = 'content-type-json'
type TCustomHeaderName = 'Page-Count' | 'Item-Count'

export interface ITypedHttpResponse {
	setStatus(code: TStatusCode): ITypedHttpResponse
	setStandardHeader(header: TStandardHeader): ITypedHttpResponse
	setCustomHeader(name: TCustomHeaderName, value: string): ITypedHttpResponse
	setBody<T extends object>(body: T): void
}

export class TypedHttpResponse implements ITypedHttpResponse {
	constructor(private readonly httpResponse: HttpResponse) {}

	public setStatus(code: TStatusCode): ITypedHttpResponse {
		this.httpResponse.setStatus(code)

		return this
	}

	public setStandardHeader(header: TStandardHeader): ITypedHttpResponse {
		switch (header) {
			case 'content-type-json':
				this.httpResponse.setHeader('Content-Type', 'application/json; charset=utf-8')
				break

			default:
				throw new Error('not managed standard header')
		}

		return this
	}

	public setCustomHeader(name: TCustomHeaderName, value: string): ITypedHttpResponse {
		this.httpResponse.setHeader(name, value)

		return this
	}

	public setBody<T extends object>(body: T): void {
		this.httpResponse.setBody(JSON.stringify(body))
	}
}
