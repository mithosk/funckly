import { IValidate } from './section/inspect/validate'
import { IAuthorize } from './section/inspect/authorize'
import { IResolver } from './section/procedure/resolver'
import { ExecuteError } from './section/procedure/execute-error'
import { OperationType } from './section/inspect/operation-type'
import { ITypedHttpRequest } from './section/server/typed-http-request'
import { ITypedHttpResponse } from './section/server/typed-http-response'

export class HttpPostHandler<D extends object, R extends object> {
	constructor(
		private readonly resolver: IResolver<D, R>,
		private readonly authorize: IAuthorize | undefined,
		private readonly validate: IValidate<D> | undefined
	) {}

	public async post(request: ITypedHttpRequest, response: ITypedHttpResponse): Promise<void> {
		const authorization = request.getStringHeader('authorization')
		const data = request.getBody<D>()

		const userId = this.authorize ? this.authorize(authorization, OperationType.Generic) : undefined
		const badRequestErrors = this.validate ? this.validate(data).getErrors() : []

		if (this.authorize && !userId) {
			response
				.setStatus(401)
				.setStandardHeader('content-type-json')
				.setAlertBody('unauthorized', undefined, undefined)
		} else if (badRequestErrors.length > 0) {
			response
				.setStatus(400)
				.setStandardHeader('content-type-json')
				.setAlertBody('bad request', undefined, badRequestErrors)
		} else {
			try {
				const result = await this.resolver.execute({ userId, data })

				response.setStatus(200).setStandardHeader('content-type-json').setObjectBody(result)
			} catch (error) {
				this.manageResolverError(error as Error, response)
			}
		}
	}

	private manageResolverError(error: Error, response: ITypedHttpResponse) {
		if (error instanceof ExecuteError) {
			response
				.setStatus(403)
				.setStandardHeader('content-type-json')
				.setAlertBody(error.message, error.code, undefined)
		} else {
			response
				.setStatus(500)
				.setStandardHeader('content-type-json')
				.setAlertBody(error.message, undefined, undefined)
		}
	}
}
