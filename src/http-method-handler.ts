import { IValidate } from './section/inspect/validate'
import { IController } from './section/crud/controller'
import { IAuthorize } from './section/inspect/authorize'
import { INormalize } from './section/inspect/normalize'
import { Normalizer } from './section/inspect/normalizer'
import { IPrevalidator } from './section/inspect/prevalidator'
import { NotFoundError } from './section/crud/not-found-error'
import { ForbiddenError } from './section/crud/forbidden-error'
import { OperationType } from './section/inspect/operation-type'
import { ITypedHttpRequest } from './section/server/typed-http-request'
import { ITypedHttpResponse } from './section/server/typed-http-response'
import { MethodNotAllowedError } from './section/crud/method-not-allowed-error'

export class HttpMethodHandler<M extends object, F extends object> {
	constructor(
		private readonly controller: IController<M, F>,
		private readonly authorize: IAuthorize | undefined,
		private readonly prevalidator: IPrevalidator | undefined,
		private readonly validate: IValidate<M> | undefined,
		private readonly normalize: INormalize<F> | undefined
	) {}

	public async post(request: ITypedHttpRequest, response: ITypedHttpResponse): Promise<void> {
		const identifiers = request.getIdentifiers()
		const authorization = request.getStringHeader('authorization')
		const model = request.getBody<M>()

		const userId = this.authorize ? this.authorize(authorization, OperationType.Write) : undefined
		const badRequestError = this.prevalidate(identifiers)
		const badRequestErrors = this.validate ? this.validate(model).getErrors() : []
		if (badRequestError) badRequestErrors.push(badRequestError)

		if (this.authorize && !userId) {
			response.setStatus(401).setStandardHeader('content-type-json').setBody(['unauthorized'])
		} else if (badRequestErrors.length > 0) {
			response.setStatus(400).setStandardHeader('content-type-json').setBody(badRequestErrors)
		} else {
			try {
				const result = await this.controller.create({ identifiers, userId, model })

				response.setStatus(201).setStandardHeader('content-type-json').setBody(result)
			} catch (error) {
				this.manageControllerError(error as Error, response)
			}
		}
	}

	public async getOne(request: ITypedHttpRequest, response: ITypedHttpResponse): Promise<void> {
		const identifiers = request.getIdentifiers()
		const authorization = request.getStringHeader('authorization')

		const userId = this.authorize ? this.authorize(authorization, OperationType.Read) : undefined
		const badRequestError = this.prevalidate(identifiers)

		if (this.authorize && !userId) {
			response.setStatus(401).setStandardHeader('content-type-json').setBody(['unauthorized'])
		} else if (badRequestError) {
			response.setStatus(400).setStandardHeader('content-type-json').setBody([badRequestError])
		} else {
			try {
				const result = await this.controller.read({ identifiers, userId })

				response.setStatus(200).setStandardHeader('content-type-json').setBody(result)
			} catch (error) {
				this.manageControllerError(error as Error, response)
			}
		}
	}

	public async put(request: ITypedHttpRequest, response: ITypedHttpResponse): Promise<void> {
		const identifiers = request.getIdentifiers()
		const authorization = request.getStringHeader('authorization')
		const model = request.getBody<M>()

		const userId = this.authorize ? this.authorize(authorization, OperationType.Write) : undefined
		const badRequestError = this.prevalidate(identifiers)
		const badRequestErrors = this.validate ? this.validate(model).getErrors() : []
		if (badRequestError) badRequestErrors.push(badRequestError)

		if (this.authorize && !userId) {
			response.setStatus(401).setStandardHeader('content-type-json').setBody(['unauthorized'])
		} else if (badRequestErrors.length > 0) {
			response.setStatus(400).setStandardHeader('content-type-json').setBody(badRequestErrors)
		} else {
			try {
				const result = await this.controller.update({ identifiers, userId, model })

				response.setStatus(200).setStandardHeader('content-type-json').setBody(result)
			} catch (error) {
				this.manageControllerError(error as Error, response)
			}
		}
	}

	public async patch(request: ITypedHttpRequest, response: ITypedHttpResponse): Promise<void> {
		const identifiers = request.getIdentifiers()
		const authorization = request.getStringHeader('authorization')
		const partialModel = request.getBody<M>()

		const userId = this.authorize ? this.authorize(authorization, OperationType.Write) : undefined
		const badRequestError = this.prevalidate(identifiers)

		if (this.authorize && !userId) {
			response.setStatus(401).setStandardHeader('content-type-json').setBody(['unauthorized'])
		} else if (badRequestError) {
			response.setStatus(400).setStandardHeader('content-type-json').setBody([badRequestError])
		} else {
			try {
				const model = await this.controller.read({ identifiers, userId })
				this.copy(model, partialModel)

				const badRequestErrors = this.validate ? this.validate(model).getErrors() : []

				if (badRequestErrors.length > 0) {
					response.setStatus(400).setStandardHeader('content-type-json').setBody(badRequestErrors)
				} else {
					const result = await this.controller.update({ identifiers, userId, model })

					response.setStatus(200).setStandardHeader('content-type-json').setBody(result)
				}
			} catch (error) {
				this.manageControllerError(error as Error, response)
			}
		}
	}

	public async delete(request: ITypedHttpRequest, response: ITypedHttpResponse): Promise<void> {
		const identifiers = request.getIdentifiers()
		const authorization = request.getStringHeader('authorization')

		const userId = this.authorize ? this.authorize(authorization, OperationType.Delete) : undefined
		const badRequestError = this.prevalidate(identifiers)

		if (this.authorize && !userId) {
			response.setStatus(401).setStandardHeader('content-type-json').setBody(['unauthorized'])
		} else if (badRequestError) {
			response.setStatus(400).setStandardHeader('content-type-json').setBody([badRequestError])
		} else {
			try {
				await this.controller.delete({ identifiers, userId })

				response.setStatus(204)
			} catch (error) {
				this.manageControllerError(error as Error, response)
			}
		}
	}

	public async getMany(request: ITypedHttpRequest, response: ITypedHttpResponse): Promise<void> {
		const identifiers = request.getIdentifiers()
		const filter = request.getFilter<F>()
		const sortType = request.getStringHeader('sort-type')
		const pageIndex = request.getIntHeader('page-index')
		const pageSize = request.getIntHeader('page-size')
		const authorization = request.getStringHeader('authorization')

		const userId = this.authorize ? this.authorize(authorization, OperationType.Write) : undefined
		const badRequestError = this.prevalidate(identifiers)
		if (this.normalize) this.normalize(new Normalizer(filter))

		if (this.authorize && !userId) {
			response.setStatus(401).setStandardHeader('content-type-json').setBody(['unauthorized'])
		} else if (badRequestError) {
			response.setStatus(400).setStandardHeader('content-type-json').setBody([badRequestError])
		} else {
			try {
				const result = await this.controller.list({
					identifiers,
					filter,
					sortType: sortType ? sortType.split(',') : [],
					pageIndex,
					pageSize,
					userId
				})

				response
					.setStatus(200)
					.setStandardHeader('content-type-json')
					.setCustomHeader('Page-Count', result.pageCount.toString())
					.setCustomHeader('Item-Count', result.itemCount.toString())
					.setBody(result.models)
			} catch (error) {
				this.manageControllerError(error as Error, response)
			}
		}
	}

	private prevalidate(identifiers: { [name: string]: string }): string | undefined {
		if (this.prevalidator) {
			const errorKeys = this.prevalidator.validate(identifiers)

			if (errorKeys.length > 0) return 'invalid url for ' + errorKeys.join(',')
		}

		return undefined
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

	private copy(destination: M, source: M): void {
		Object.keys(source).forEach(key => {
			if (source[key as keyof M] !== undefined) destination[key as keyof M] = source[key as keyof M]
		})
	}
}
