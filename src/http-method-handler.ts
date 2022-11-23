import { IValidate } from './section/inspect/validate'
import { IController } from './section/crud/controller'
import { INormalize } from './section/inspect/normalize'
import { Normalizer } from './section/inspect/normalizer'
import { NotFoundError } from './section/crud/not-found-error'
import { ForbiddenError } from './section/crud/forbidden-error'
import { ITypedHttpRequest } from './section/server/typed-http-request'
import { ITypedHttpResponse } from './section/server/typed-http-response'
import { MethodNotAllowedError } from './section/crud/method-not-allowed-error'

export class HttpMethodHandler<M extends object, F extends object> {
	constructor(private readonly controller: IController<M, F>) {}

	public async post(
		httpRequest: ITypedHttpRequest,
		httpResponse: ITypedHttpResponse,
		validate: IValidate<M> | undefined
	): Promise<void> {
		const model = httpRequest.getBody<M>()
		const identifiers = httpRequest.getIdentifiers()

		const validationErrors = validate ? validate(model).getErrors() : []

		if (validationErrors.length === 0) {
			try {
				const result = await this.controller.create(model, identifiers)

				httpResponse.setStatus(201).setStandardHeader('content-type-json').setBody(result)
			} catch (error) {
				this.manageControllerError(error as Error, httpResponse)
			}
		} else {
			httpResponse.setStatus(400).setStandardHeader('content-type-json').setBody(validationErrors)
		}
	}

	public async getOne(httpRequest: ITypedHttpRequest, httpResponse: ITypedHttpResponse): Promise<void> {
		const identifiers = httpRequest.getIdentifiers()

		try {
			const result = await this.controller.read(identifiers)

			httpResponse.setStatus(200).setStandardHeader('content-type-json').setBody(result)
		} catch (error) {
			this.manageControllerError(error as Error, httpResponse)
		}
	}

	public async put(
		httpRequest: ITypedHttpRequest,
		httpResponse: ITypedHttpResponse,
		validate: IValidate<M> | undefined
	): Promise<void> {
		const identifiers = httpRequest.getIdentifiers()
		const model = httpRequest.getBody<M>()

		const validationErrors = validate ? validate(model).getErrors() : []

		if (validationErrors.length === 0) {
			try {
				const result = await this.controller.update(identifiers, model)

				httpResponse.setStatus(200).setStandardHeader('content-type-json').setBody(result)
			} catch (error) {
				this.manageControllerError(error as Error, httpResponse)
			}
		} else {
			httpResponse.setStatus(400).setStandardHeader('content-type-json').setBody(validationErrors)
		}
	}

	public async patch(
		httpRequest: ITypedHttpRequest,
		httpResponse: ITypedHttpResponse,
		validate: IValidate<M> | undefined
	): Promise<void> {
		const identifiers = httpRequest.getIdentifiers()
		const partialModel = httpRequest.getBody<M>()

		try {
			const model = await this.controller.read(identifiers)
			this.copy(model, partialModel)

			const validationErrors = validate ? validate(model).getErrors() : []

			if (validationErrors.length === 0) {
				const result = await this.controller.update(identifiers, model)

				httpResponse.setStatus(200).setStandardHeader('content-type-json').setBody(result)
			} else {
				httpResponse.setStatus(400).setStandardHeader('content-type-json').setBody(validationErrors)
			}
		} catch (error) {
			this.manageControllerError(error as Error, httpResponse)
		}
	}

	public async delete(httpRequest: ITypedHttpRequest, httpResponse: ITypedHttpResponse): Promise<void> {
		const identifiers = httpRequest.getIdentifiers()

		try {
			await this.controller.delete(identifiers)

			httpResponse.setStatus(204)
		} catch (error) {
			this.manageControllerError(error as Error, httpResponse)
		}
	}

	public async getMany(
		httpRequest: ITypedHttpRequest,
		httpResponse: ITypedHttpResponse,
		normalize: INormalize<F> | undefined
	): Promise<void> {
		const identifiers = httpRequest.getIdentifiers()
		const filter = httpRequest.getFilter<F>()
		const sortType = httpRequest.getStringHeader('sort-type')
		let pageIndex = httpRequest.getIntHeader('page-index')
		let pageSize = httpRequest.getIntHeader('page-size')

		pageIndex = pageIndex ?? 1
		pageSize = pageSize ?? 30
		if (normalize) normalize(new Normalizer(filter))

		try {
			const result = await this.controller.list(identifiers, filter, sortType, pageIndex, pageSize)

			httpResponse
				.setStatus(200)
				.setStandardHeader('content-type-json')
				.setCustomHeader('Page-Count', result.pageCount.toString())
				.setCustomHeader('Item-Count', result.itemCount.toString())
				.setBody(result.models)
		} catch (error) {
			this.manageControllerError(error as Error, httpResponse)
		}
	}

	private manageControllerError(error: Error, httpResponse: ITypedHttpResponse) {
		if (error instanceof ForbiddenError) {
			httpResponse.setStatus(403).setStandardHeader('content-type-json').setBody([error.message])
		} else if (error instanceof NotFoundError) {
			httpResponse.setStatus(404).setStandardHeader('content-type-json').setBody([error.message])
		} else if (error instanceof MethodNotAllowedError) {
			httpResponse.setStatus(405).setStandardHeader('content-type-json').setBody([error.message])
		} else {
			httpResponse.setStatus(500).setStandardHeader('content-type-json').setBody([error.message])
		}
	}

	private copy(destination: M, source: M): void {
		Object.keys(source).forEach(key => {
			if (source[key as keyof M] !== undefined) destination[key as keyof M] = source[key as keyof M]
		})
	}
}
