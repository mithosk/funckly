import { INormalize } from './normalize'
import { IValidate } from '../inspect/validate'
import { HttpMethod } from '../server/http-method'
import { TypedHttpRequest } from './typed-http-request'
import { VanillaServer } from '../server/vanilla-server'
import { HttpMethodHandler } from './http-method-handler'
import { TypedHttpResponse } from './typed-http-response'
import { ICreateController } from '../crud/create-controller'

export class RestUnit<M extends object, F extends object> {
	private validate: IValidate<M> | undefined = undefined
	private normalize: INormalize<F> | undefined = undefined

	constructor(private readonly server: VanillaServer, private readonly route: string) {}

	public setController(createController: ICreateController<M, F>): RestUnit<M, F> {
		this.server.subscribe(this.route, async (httpMethod, httpRequest, httpResponse) => {
			const httpMethodHandler = new HttpMethodHandler(createController())
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
			const httpMethodHandler = new HttpMethodHandler(createController())
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
