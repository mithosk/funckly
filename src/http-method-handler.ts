import { IValidate } from './section/inspect/validate'
import { IController } from './section/crud/controller'
import { INormalize } from './section/inspect/normalize'
import { Normalizer } from './section/inspect/normalizer'
import { IPrevalidator } from './section/inspect/prevalidator'
import { NotFoundError } from './section/crud/not-found-error'
import { ForbiddenError } from './section/crud/forbidden-error'
import { ITypedHttpRequest } from './section/server/typed-http-request'
import { ITypedHttpResponse } from './section/server/typed-http-response'
import { MethodNotAllowedError } from './section/crud/method-not-allowed-error'

export class HttpMethodHandler<M extends object, F extends object> {
	constructor(
		private readonly controller: IController<M, F>,
		private readonly prevalidator: IPrevalidator | undefined,
		private readonly validate: IValidate<M> | undefined,
		private readonly normalize: INormalize<F> | undefined
	) {}

	public async post(request: ITypedHttpRequest, response: ITypedHttpResponse): Promise<void> {
		const model = request.getBody<M>()
		const identifiers = request.getIdentifiers()

		const badRequestErrors = this.validate ? this.validate(model).getErrors() : []
		const prevalidationError = this.prevalidate(identifiers)
		if (prevalidationError) badRequestErrors.push(prevalidationError)

		if (badRequestErrors.length === 0) {
			try {
				const result = await this.controller.create(model, identifiers)

				response.setStatus(201).setStandardHeader('content-type-json').setBody(result)
			} catch (error) {
				this.manageControllerError(error as Error, response)
			}
		} else {
			response.setStatus(400).setStandardHeader('content-type-json').setBody(badRequestErrors)
		}
	}

	public async getOne(request: ITypedHttpRequest, response: ITypedHttpResponse): Promise<void> {
		const identifiers = request.getIdentifiers()

		const badRequestError = this.prevalidate(identifiers)

		if (!badRequestError) {
			try {
				const result = await this.controller.read(identifiers)

				response.setStatus(200).setStandardHeader('content-type-json').setBody(result)
			} catch (error) {
				this.manageControllerError(error as Error, response)
			}
		} else {
			response.setStatus(400).setStandardHeader('content-type-json').setBody([badRequestError])
		}
	}

	public async put(request: ITypedHttpRequest, response: ITypedHttpResponse): Promise<void> {
		const identifiers = request.getIdentifiers()
		const model = request.getBody<M>()

		const badRequestErrors = this.validate ? this.validate(model).getErrors() : []
		const prevalidationError = this.prevalidate(identifiers)
		if (prevalidationError) badRequestErrors.push(prevalidationError)

		if (badRequestErrors.length === 0) {
			try {
				const result = await this.controller.update(identifiers, model)

				response.setStatus(200).setStandardHeader('content-type-json').setBody(result)
			} catch (error) {
				this.manageControllerError(error as Error, response)
			}
		} else {
			response.setStatus(400).setStandardHeader('content-type-json').setBody(badRequestErrors)
		}
	}

	public async patch(request: ITypedHttpRequest, response: ITypedHttpResponse): Promise<void> {
		const identifiers = request.getIdentifiers()
		const partialModel = request.getBody<M>()

		try {
			const model = await this.controller.read(identifiers)
			this.copy(model, partialModel)

			const badRequestErrors = this.validate ? this.validate(model).getErrors() : []
			const prevalidationError = this.prevalidate(identifiers)
			if (prevalidationError) badRequestErrors.push(prevalidationError)

			if (badRequestErrors.length === 0) {
				const result = await this.controller.update(identifiers, model)

				response.setStatus(200).setStandardHeader('content-type-json').setBody(result)
			} else {
				response.setStatus(400).setStandardHeader('content-type-json').setBody(badRequestErrors)
			}
		} catch (error) {
			this.manageControllerError(error as Error, response)
		}
	}

	public async delete(request: ITypedHttpRequest, response: ITypedHttpResponse): Promise<void> {
		const identifiers = request.getIdentifiers()

		const badRequestError = this.prevalidate(identifiers)

		if (!badRequestError) {
			try {
				await this.controller.delete(identifiers)

				response.setStatus(204)
			} catch (error) {
				this.manageControllerError(error as Error, response)
			}
		} else {
			response.setStatus(400).setStandardHeader('content-type-json').setBody([badRequestError])
		}
	}

	public async getMany(request: ITypedHttpRequest, response: ITypedHttpResponse): Promise<void> {
		const identifiers = request.getIdentifiers()
		const filter = request.getFilter<F>()
		const sortType = request.getStringHeader('sort-type')
		let pageIndex = request.getIntHeader('page-index')
		let pageSize = request.getIntHeader('page-size')

		pageIndex = pageIndex ?? 1
		pageSize = pageSize ?? 30
		const badRequestError = this.prevalidate(identifiers)
		if (this.normalize) this.normalize(new Normalizer(filter))

		if (!badRequestError) {
			try {
				const result = await this.controller.list(identifiers, filter, sortType, pageIndex, pageSize)

				response
					.setStatus(200)
					.setStandardHeader('content-type-json')
					.setCustomHeader('Page-Count', result.pageCount.toString())
					.setCustomHeader('Item-Count', result.itemCount.toString())
					.setBody(result.models)
			} catch (error) {
				this.manageControllerError(error as Error, response)
			}
		} else {
			response.setStatus(400).setStandardHeader('content-type-json').setBody([badRequestError])
		}
	}

	private prevalidate(identifiers: { [name: string]: string }): string | undefined {
		if (this.prevalidator) {
			const errorKeys = this.prevalidator.validate(identifiers)

			if (errorKeys.length > 0) return 'invalid url for ' + errorKeys.join(',')
		}

		return undefined
	}

	private copy(destination: M, source: M): void {
		Object.keys(source).forEach(key => {
			if (source[key as keyof M] !== undefined) destination[key as keyof M] = source[key as keyof M]
		})
	}

	private manageControllerError(error: Error, response: ITypedHttpResponse) {
		if (error instanceof ForbiddenError) {
			response.setStatus(403).setStandardHeader('content-type-json').setBody([error.message])
		} else if (error instanceof NotFoundError) {
			response.setStatus(404).setStandardHeader('content-type-json').setBody([error.message])
		} else if (error instanceof MethodNotAllowedError) {
			response.setStatus(405).setStandardHeader('content-type-json').setBody([error.message])
		} else {
			response.setStatus(500).setStandardHeader('content-type-json').setBody([error.message])
		}
	}
}
