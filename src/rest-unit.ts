import { IValidate } from './section/inspect/validate'
import { IController } from './section/crud/controller'
import { INormalize } from './section/inspect/normalize'
import { HttpMethod } from './section/server/http-method'
import { HttpMethodHandler } from './http-method-handler'
import { VanillaServer } from './section/server/vanilla-server'
import { TypedHttpRequest } from './section/server/typed-http-request'
import { TypedHttpResponse } from './section/server/typed-http-response'

export class RestUnit<M extends object, F extends object> {
	private validate: IValidate<M> | undefined = undefined
	private normalize: INormalize<F> | undefined = undefined

	constructor(private readonly server: VanillaServer, private readonly route: string) {}

	public setController(controller: IController<M, F>): RestUnit<M, F> {
		this.server.subscribe(this.route, async (httpMethod, httpRequest, httpResponse) => {
			const httpMethodHandler = new HttpMethodHandler(controller)
			const typedHttpRequest = new TypedHttpRequest(httpRequest)
			const typedHttpResponse = new TypedHttpResponse(httpResponse)

			switch (httpMethod) {
				case HttpMethod.Post:
					await httpMethodHandler.post(typedHttpRequest, typedHttpResponse, this.validate)
					break

				case HttpMethod.Get:
					await httpMethodHandler.getMany(typedHttpRequest, typedHttpResponse, this.normalize)
					break

				default:
					typedHttpResponse.setStatus(405).setStandardHeader('content-type-json').setBody(['method not allowed'])
			}
		})

		this.server.subscribe(this.route + '/{id}', async (httpMethod, httpRequest, httpResponse) => {
			const httpMethodHandler = new HttpMethodHandler(controller)
			const typedHttpRequest = new TypedHttpRequest(httpRequest)
			const typedHttpResponse = new TypedHttpResponse(httpResponse)

			switch (httpMethod) {
				case HttpMethod.Get:
					await httpMethodHandler.getOne(typedHttpRequest, typedHttpResponse)
					break

				case HttpMethod.Put:
					await httpMethodHandler.put(typedHttpRequest, typedHttpResponse, this.validate)
					break

				case HttpMethod.Patch:
					await httpMethodHandler.patch(typedHttpRequest, typedHttpResponse, this.validate)
					break

				case HttpMethod.Delete:
					await httpMethodHandler.delete(typedHttpRequest, typedHttpResponse)
					break

				default:
					typedHttpResponse.setStatus(405).setStandardHeader('content-type-json').setBody(['method not allowed'])
			}
		})

		return this
	}

	public setValidation(validate: IValidate<M>): RestUnit<M, F> {
		this.validate = validate

		return this
	}

	public setNormalization(normalize: INormalize<F>): RestUnit<M, F> {
		this.normalize = normalize

		return this
	}
}
