import { IValidate } from './section/inspect/validate'
import { IAuthorize } from './section/inspect/authorize'
import { INormalize } from './section/inspect/normalize'
import { HttpMethod } from './section/server/http-method'
import { HttpMethodHandler } from './http-method-handler'
import { VanillaServer } from './section/server/vanilla-server'
import { ICreateController } from './section/crud/create-controller'
import { TypedHttpRequest } from './section/server/typed-http-request'
import { TypedHttpResponse } from './section/server/typed-http-response'
import { PrevalidationFormat } from './section/inspect/prevalidation-format'
import { IPrevalidator, Prevalidator } from './section/inspect/prevalidator'

export class RestUnit<M extends object, F extends object> {
	private authorize: IAuthorize | undefined = undefined
	private prevalidator: IPrevalidator | undefined = undefined
	private validate: IValidate<M> | undefined = undefined
	private normalize: INormalize<F> | undefined = undefined

	constructor(private readonly server: VanillaServer, private readonly route: string) {}

	public setController(createController: ICreateController<M, F>): RestUnit<M, F> {
		this.server.subscribe(this.route, async (httpMethod, httpRequest, httpResponse) => {
			const httpMethodHandler = new HttpMethodHandler(
				createController(),
				this.authorize,
				this.prevalidator,
				this.validate,
				this.normalize
			)
			const typedHttpRequest = new TypedHttpRequest(httpRequest)
			const typedHttpResponse = new TypedHttpResponse(httpResponse)

			switch (httpMethod) {
				case HttpMethod.Post:
					await httpMethodHandler.post(typedHttpRequest, typedHttpResponse)
					break

				case HttpMethod.Get:
					await httpMethodHandler.getMany(typedHttpRequest, typedHttpResponse)
					break

				default:
					typedHttpResponse.setStatus(405).setStandardHeader('content-type-json').setBody(['method not allowed'])
			}
		})

		this.server.subscribe(this.route + '/{id}', async (httpMethod, httpRequest, httpResponse) => {
			const httpMethodHandler = new HttpMethodHandler(
				createController(),
				this.authorize,
				this.prevalidator,
				this.validate,
				this.normalize
			)
			const typedHttpRequest = new TypedHttpRequest(httpRequest)
			const typedHttpResponse = new TypedHttpResponse(httpResponse)

			switch (httpMethod) {
				case HttpMethod.Get:
					await httpMethodHandler.getOne(typedHttpRequest, typedHttpResponse)
					break

				case HttpMethod.Put:
					await httpMethodHandler.put(typedHttpRequest, typedHttpResponse)
					break

				case HttpMethod.Patch:
					await httpMethodHandler.patch(typedHttpRequest, typedHttpResponse)
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

	public setAuthorize(authorize: IAuthorize): RestUnit<M, F> {
		this.authorize = authorize

		return this
	}

	public setPrevalidation(format: PrevalidationFormat): RestUnit<M, F> {
		this.prevalidator = new Prevalidator(format)

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
