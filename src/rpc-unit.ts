import { HttpPostHandler } from './http-post-handler'
import { IValidate } from './section/inspect/validate'
import { IAuthorize } from './section/inspect/authorize'
import { HttpMethod } from './section/server/http-method'
import { IVanillaServer } from './section/server/vanilla-server'
import { ICreateResolver } from './section/procedure/create-resolver'
import { TypedHttpRequest } from './section/server/typed-http-request'
import { TypedHttpResponse } from './section/server/typed-http-response'

export class RpcUnit<D extends object, R extends object> {
	private authorize: IAuthorize | undefined = undefined
	private validate: IValidate<D> | undefined = undefined

	constructor(private readonly server: IVanillaServer, private readonly route: string) {}

	public setResolver(createResolver: ICreateResolver<D, R>): RpcUnit<D, R> {
		this.server.subscribe(this.route, async (httpMethod, httpRequest, httpResponse) => {
			const httpPostHandler = new HttpPostHandler(createResolver(), this.authorize, this.validate)
			const typedHttpRequest = new TypedHttpRequest(httpRequest)
			const typedHttpResponse = new TypedHttpResponse(httpResponse)

			if (httpMethod === HttpMethod.Post) await httpPostHandler.post(typedHttpRequest, typedHttpResponse)
			else {
				typedHttpResponse
					.setStatus(405)
					.setStandardHeader('content-type-json')
					.setAlertBody('method not allowed', undefined, undefined)
			}
		})

		return this
	}

	public setAuthorize(authorize: IAuthorize): RpcUnit<D, R> {
		this.authorize = authorize

		return this
	}

	public setValidation(validate: IValidate<D>): RpcUnit<D, R> {
		this.validate = validate

		return this
	}
}
