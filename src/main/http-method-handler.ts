import { IValidate } from './validate'
import { INormalize } from './normalize'
import { IController } from '../crud/controller'
import { HttpRequest } from '../server/http-request'
import { NotFoundError } from '../crud/not-found-error'
import { IHttpResponse } from '../server/http-response'
import { ForbiddenError } from '../crud/forbidden-error'

export class HttpMethodHandler<M extends object, F extends object> {
	constructor(private readonly controller: IController<M, F>) {}

	public async post(
		httpRequest: HttpRequest,
		httpResponse: IHttpResponse,
		validate: IValidate<M> | undefined
	): Promise<void> {
		const model = this.deserialize<M>(httpRequest.getBody())
		const identifiers = httpRequest.getIdentifiers()

		const validationErrors = validate ? validate(model).getErrors() : []

		if (validationErrors.length === 0) {
			try {
				const result = await this.controller.create(model, identifiers)

				httpResponse.setStatus(201).setHeader('Content-Type', 'application/json').setBody(JSON.stringify(result))
			} catch (error) {
				this.manageControllerError(error as Error, httpResponse)
			}
		} else {
			httpResponse.setStatus(400).setHeader('Content-Type', 'application/json').setBody(JSON.stringify(validationErrors))
		}
	}

	public async getOne(httpRequest: HttpRequest, httpResponse: IHttpResponse): Promise<void> {
		const identifiers = httpRequest.getIdentifiers()

		try {
			const result = await this.controller.read(identifiers)

			httpResponse.setStatus(200).setHeader('Content-Type', 'application/json').setBody(JSON.stringify(result))
		} catch (error) {
			this.manageControllerError(error as Error, httpResponse)
		}
	}

	public async put(
		httpRequest: HttpRequest,
		httpResponse: IHttpResponse,
		validate: IValidate<M> | undefined
	): Promise<void> {
		const identifiers = httpRequest.getIdentifiers()
		const model = this.deserialize<M>(httpRequest.getBody())

		const validationErrors = validate ? validate(model).getErrors() : []

		if (validationErrors.length === 0) {
			try {
				const result = await this.controller.update(identifiers, model)

				httpResponse.setStatus(200).setHeader('Content-Type', 'application/json').setBody(JSON.stringify(result))
			} catch (error) {
				this.manageControllerError(error as Error, httpResponse)
			}
		} else {
			httpResponse.setStatus(400).setHeader('Content-Type', 'application/json').setBody(JSON.stringify(validationErrors))
		}
	}

	public async patch(
		httpRequest: HttpRequest,
		httpResponse: IHttpResponse,
		validate: IValidate<M> | undefined
	): Promise<void> {
		const identifiers = httpRequest.getIdentifiers()
		const partialModel = this.deserialize<M>(httpRequest.getBody())

		try {
			const model = await this.controller.read(identifiers)
			this.copy(model, partialModel)

			const validationErrors = validate ? validate(model).getErrors() : []

			if (validationErrors.length === 0) {
				const result = await this.controller.update(identifiers, model)

				httpResponse.setStatus(200).setHeader('Content-Type', 'application/json').setBody(JSON.stringify(result))
			} else {
				httpResponse.setStatus(400).setHeader('Content-Type', 'application/json').setBody(JSON.stringify(validationErrors))
			}
		} catch (error) {
			this.manageControllerError(error as Error, httpResponse)
		}
	}

	public async delete(httpRequest: HttpRequest, httpResponse: IHttpResponse): Promise<void> {
		const identifiers = httpRequest.getIdentifiers()

		try {
			await this.controller.delete(identifiers)

			httpResponse.setStatus(204)
		} catch (error) {
			this.manageControllerError(error as Error, httpResponse)
		}
	}

	public async getMany(
		httpRequest: HttpRequest,
		httpResponse: IHttpResponse,
		normalize: INormalize<F> | undefined
	): Promise<void> {
		const identifiers = httpRequest.getIdentifiers()
		const filter = this.deserialize<F>(httpRequest.getFilter())
		const sortType = httpRequest.getHeader('sorttype')
		let pageIndex = parseInt(httpRequest.getHeader('pageindex'))
		let pageSize = parseInt(httpRequest.getHeader('pagesize'))

		pageIndex = isNaN(pageIndex) ? 1 : pageIndex
		pageSize = isNaN(pageSize) ? 15 : pageSize
		if (normalize) normalize(filter)

		try {
			const result = await this.controller.list(identifiers, filter, sortType, pageIndex, pageSize)

			httpResponse
				.setStatus(200)
				.setHeader('Content-Type', 'application/json')
				.setHeader('SortType', result.sortType.toString())
				.setHeader('PageIndex', pageIndex.toString())
				.setHeader('PageSize', pageSize.toString())
				.setHeader('PageCount', result.pageCount.toString())
				.setHeader('ItemCount', result.itemCount.toString())
				.setBody(JSON.stringify(result.models))
		} catch (error) {
			this.manageControllerError(error as Error, httpResponse)
		}
	}

	private deserialize<T extends object>(json: string): T {
		try {
			return <T>JSON.parse(json)
		} catch {
			return <T>{}
		}
	}

	private manageControllerError(error: Error, httpResponse: IHttpResponse) {
		if (error instanceof ForbiddenError) {
			httpResponse.setStatus(403).setBody(error.message)
		} else if (error instanceof NotFoundError) {
			httpResponse.setStatus(404).setBody(error.message)
		} else {
			httpResponse.setStatus(500).setBody(error.message)
		}
	}

	private copy(destination: M, source: M): void {
		Object.keys(destination).forEach(key => {
			if (source[key as keyof M] !== undefined) destination[key as keyof M] = source[key as keyof M]
		})
	}
}
