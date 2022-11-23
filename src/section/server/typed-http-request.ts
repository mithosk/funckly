import { HttpRequest } from './http-request'

type TStringHeaderName = 'sort-type'
type TIntHeaderName = 'page-index' | 'page-size'

export interface ITypedHttpRequest {
	getIdentifiers(): { [name: string]: string }
	getFilter<F extends object>(): F
	getStringHeader(name: TStringHeaderName): string
	getIntHeader(name: TIntHeaderName): number | undefined
	getBody<T extends object>(): T
}

export class TypedHttpRequest implements ITypedHttpRequest {
	constructor(private readonly httpRequest: HttpRequest) {}

	public getIdentifiers(): { [name: string]: string } {
		return this.httpRequest.getIdentifiers()
	}

	public getFilter<F extends object>(): F {
		return JSON.parse(this.httpRequest.getFilter()) as F
	}

	public getStringHeader(name: TStringHeaderName): string {
		return this.httpRequest.getHeader(name)
	}

	public getIntHeader(name: TIntHeaderName): number | undefined {
		const value = parseInt(this.httpRequest.getHeader(name))
		return isNaN(value) ? undefined : value
	}

	public getBody<T extends object>(): T {
		try {
			return JSON.parse(this.httpRequest.getBody()) as T
		} catch {
			return {} as T
		}
	}
}
