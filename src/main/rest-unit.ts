import { IValidate } from './validate'
import { INormalize } from './normalize'
import { HttpMethod } from '../server/http-method'
import { ICreateController } from './create-controller'
import { VanillaServer } from '../server/vanilla-server'
import { HttpMethodHandler } from './http-method-handler'

export class RestUnit<M extends object, F extends object> {
	private validate: IValidate<M> | undefined = undefined
	private normalize: INormalize<F> | undefined = undefined

	constructor(private readonly server: VanillaServer, private readonly route: string) {}

	public setController(createController: ICreateController<M, F>): RestUnit<M, F> {
		this.server.subscribe(this.route, async (httpMethod, httpRequest, httpResponse) => {
			const httpMethodHandler = new HttpMethodHandler(createController())

			switch (httpMethod) {
				case HttpMethod.Post:
					await httpMethodHandler.post(httpRequest, httpResponse, this.validate)
					break

				case HttpMethod.Get:
					await httpMethodHandler.getMany(httpRequest, httpResponse, this.normalize)
					break

				default:
					httpResponse.setStatus(404).setBody('method not found')
			}
		})

		this.server.subscribe(this.route + '/{id}', async (httpMethod, httpRequest, httpResponse) => {
			const httpMethodHandler = new HttpMethodHandler(createController())

			switch (httpMethod) {
				case HttpMethod.Get:
					await httpMethodHandler.getOne(httpRequest, httpResponse)
					break

				case HttpMethod.Put:
					await httpMethodHandler.put(httpRequest, httpResponse, this.validate)
					break

				case HttpMethod.Patch:
					await httpMethodHandler.patch(httpRequest, httpResponse, this.validate)
					break

				case HttpMethod.Delete:
					await httpMethodHandler.delete(httpRequest, httpResponse)
					break

				default:
					httpResponse.setStatus(404).setBody('method not found')
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
