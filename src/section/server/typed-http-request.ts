import { HttpRequest } from './http-request'

type TStringHeaderName = 'authorization' | 'sort-by' | 'accept-language'
type TIntHeaderName = 'page-index' | 'page-size'

export interface ITypedHttpRequest {
	getIdentifiers(): { [name: string]: string }
	getFilter<F extends object>(): F
	getStringHeader(name: TStringHeaderName): string | undefined
	getIntHeader(name: TIntHeaderName): number | undefined
	getBody<B extends object>(): B
}

export class TypedHttpRequest implements ITypedHttpRequest {
	constructor(private readonly httpRequest: HttpRequest) {}

	public getIdentifiers(): { [name: string]: string } {
		return this.httpRequest.getIdentifiers()
	}

	public getFilter<F extends object>(): F {
		return JSON.parse(this.httpRequest.getFilter()) as F
	}

	public getStringHeader(name: TStringHeaderName): string | undefined {
		return this.httpRequest.getHeader(name)
	}

	public getIntHeader(name: TIntHeaderName): number | undefined {
		const value = parseInt(this.httpRequest.getHeader(name) ?? '')
		return isNaN(value) ? undefined : value
	}

	public getBody<B extends object>(): B {
		try {
			return JSON.parse(this.httpRequest.getBody()) as B
		} catch {
			return {} as B
		}
	}
}
