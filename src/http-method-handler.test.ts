import { IController } from './section/crud/controller'
import { IValidator } from './section/inspect/validator'
import { HttpMethodHandler } from './http-method-handler'
import { NotFoundError } from './section/crud/not-found-error'
import { IPrevalidator } from './section/inspect/prevalidator'
import { ForbiddenError } from './section/crud/forbidden-error'
import { ITypedHttpRequest } from './section/server/typed-http-request'
import { ITypedHttpResponse } from './section/server/typed-http-response'
import { MethodNotAllowedError } from './section/crud/method-not-allowed-error'

describe('HttpMethodHandler', () => {
	interface IFakeModel {
		cat: string
		dog: number
		tiger: string
	}

	interface IFakeFilter {
		lion: boolean
		crocodile: number
	}

	let controller: jest.Mocked<IController<IFakeModel, IFakeFilter>>
	let prevalidator: jest.Mocked<IPrevalidator>
	let validator: jest.Mocked<IValidator<IFakeModel>>
	let request: jest.Mocked<ITypedHttpRequest>
	let response: jest.Mocked<ITypedHttpResponse>

	beforeEach(() => {
		controller = {
			create: jest.fn(),
			read: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			list: jest.fn()
		}

		prevalidator = {
			validate: jest.fn()
		}

		validator = {
			notEmpty: jest.fn(),
			isString: jest.fn(),
			mustLength: jest.fn(),
			isUuid: jest.fn(),
			isDate: jest.fn(),
			isEmail: jest.fn(),
			isEnum: jest.fn(),
			isInt: jest.fn(),
			isFloat: jest.fn(),
			mustRange: jest.fn(),
			isBoolean: jest.fn(),
			isArray: jest.fn(),
			getErrors: jest.fn()
		}

		request = {
			getIdentifiers: jest.fn(),
			getFilter: jest.fn(),
			getStringHeader: jest.fn(),
			getIntHeader: jest.fn(),
			getBody: jest.fn()
		}

		response = {
			setStatus: jest.fn(),
			setStandardHeader: jest.fn(),
			setCustomHeader: jest.fn(),
			setObjectBody: jest.fn(),
			setAlertBody: jest.fn()
		}
	})

	describe('post', () => {
		it('sets the status to 201', async () => {
			const authorize = jest.fn().mockReturnValue('ABCD1234')
			validator.getErrors.mockReturnValue([])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, authorize, undefined, () => validator, undefined).post(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(201)
		})

		it('sets the status to 400', async () => {
			validator.getErrors.mockReturnValue(['xxx'])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, () => validator, undefined).post(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(400)
		})

		it('sets the status to 401', async () => {
			const authorize = jest.fn()
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, authorize, undefined, undefined, undefined).post(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(401)
		})

		it('sets the status to 403', async () => {
			controller.create.mockImplementation(() => {
				throw new ForbiddenError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).post(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(403)
		})

		it('sets the status to 405', async () => {
			controller.create.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).post(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(405)
		})

		it('sets the status to 500', async () => {
			controller.create.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).post(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(500)
		})
	})

	describe('getOne', () => {
		it('sets the status to 200', async () => {
			const authorize = jest.fn().mockReturnValue('ABCD1234')
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, authorize, undefined, undefined, undefined).getOne(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(200)
		})

		it('sets the status to 400', async () => {
			prevalidator.validate.mockReturnValue(['xxx'])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, prevalidator, undefined, undefined).getOne(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(400)
		})

		it('sets the status to 401', async () => {
			const authorize = jest.fn()
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, authorize, undefined, undefined, undefined).getOne(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(401)
		})

		it('sets the status to 404', async () => {
			controller.read.mockImplementation(() => {
				throw new NotFoundError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).getOne(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(404)
		})

		it('sets the status to 405', async () => {
			controller.read.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).getOne(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(405)
		})

		it('sets the status to 500', async () => {
			controller.read.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).getOne(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(500)
		})
	})

	describe('put', () => {
		it('sets the status to 200', async () => {
			const authorize = jest.fn().mockReturnValue('ABCD1234')
			validator.getErrors.mockReturnValue([])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, authorize, undefined, () => validator, undefined).put(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(200)
		})

		it('sets the status to 400', async () => {
			validator.getErrors.mockReturnValue(['xxx'])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, () => validator, undefined).put(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(400)
		})

		it('sets the status to 401', async () => {
			const authorize = jest.fn()
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, authorize, undefined, undefined, undefined).put(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(401)
		})

		it('sets the status to 403', async () => {
			controller.update.mockImplementation(() => {
				throw new ForbiddenError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).put(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(403)
		})

		it('sets the status to 404', async () => {
			controller.update.mockImplementation(() => {
				throw new NotFoundError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).put(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(404)
		})

		it('sets the status to 405', async () => {
			controller.update.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).put(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(405)
		})

		it('sets the status to 500', async () => {
			controller.update.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).put(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(500)
		})
	})

	describe('patch', () => {
		it('sets the status to 200', async () => {
			controller.read.mockResolvedValue({ cat: 'xxx', dog: 111, tiger: 'yyy' })
			const authorize = jest.fn().mockReturnValue('ABCD1234')
			validator.getErrors.mockReturnValue([])
			request.getBody.mockReturnValue({ cat: undefined, dog: undefined, tiger: 'zzz' })
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, authorize, undefined, () => validator, undefined).patch(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(200)
		})

		it('sets the status to 400', async () => {
			controller.read.mockResolvedValue({ cat: 'xxx', dog: 111, tiger: 'yyy' })
			validator.getErrors.mockReturnValue(['xxx'])
			request.getBody.mockReturnValue({ cat: undefined, dog: undefined, tiger: 'zzz' })
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, () => validator, undefined).patch(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(400)
		})

		it('sets the status to 401', async () => {
			const authorize = jest.fn()
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, authorize, undefined, undefined, undefined).patch(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(401)
		})

		it('sets the status to 403', async () => {
			controller.read.mockImplementation(() => {
				throw new ForbiddenError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).patch(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(403)
		})

		it('sets the status to 404', async () => {
			controller.read.mockImplementation(() => {
				throw new NotFoundError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).patch(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(404)
		})

		it('sets the status to 405', async () => {
			controller.read.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).patch(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(405)
		})

		it('sets the status to 500', async () => {
			controller.read.mockResolvedValue({ cat: 'xxx', dog: 111, tiger: 'yyy' })
			controller.update.mockImplementation(() => {
				throw new Error('xxx')
			})
			request.getBody.mockReturnValue({ cat: undefined, dog: undefined, tiger: 'zzz' })
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).patch(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(500)
		})
	})

	describe('delete', () => {
		it('sets the status to 204', async () => {
			const authorize = jest.fn().mockReturnValue('ABCD1234')

			await new HttpMethodHandler(controller, authorize, undefined, undefined, undefined).delete(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(204)
		})

		it('sets the status to 400', async () => {
			prevalidator.validate.mockReturnValue(['xxx', 'yyy'])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, prevalidator, undefined, undefined).delete(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(400)
		})

		it('sets the status to 401', async () => {
			const authorize = jest.fn()
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, authorize, undefined, undefined, undefined).delete(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(401)
		})

		it('sets the status to 403', async () => {
			controller.delete.mockImplementation(() => {
				throw new ForbiddenError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).delete(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(403)
		})

		it('sets the status to 404', async () => {
			controller.delete.mockImplementation(() => {
				throw new NotFoundError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).delete(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(404)
		})

		it('sets the status to 405', async () => {
			controller.delete.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).delete(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(405)
		})

		it('sets the status to 500', async () => {
			controller.delete.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).delete(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(500)
		})
	})

	describe('getMany', () => {
		it('sets the status to 200', async () => {
			controller.list.mockResolvedValue({ models: [], pageCount: 1, itemCount: 10 })
			const authorize = jest.fn().mockReturnValue('ABCD1234')
			const normalize = jest.fn()
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)
			response.setCustomHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, authorize, undefined, undefined, normalize).getMany(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(200)
		})

		it('sets the status to 400', async () => {
			prevalidator.validate.mockReturnValue(['xxx', 'yyy'])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, prevalidator, undefined, undefined).getMany(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(400)
		})

		it('sets the status to 401', async () => {
			const authorize = jest.fn()
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, authorize, undefined, undefined, undefined).getMany(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(401)
		})

		it('sets the status to 405', async () => {
			controller.list.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).getMany(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(405)
		})

		it('sets the status to 500', async () => {
			controller.list.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined, undefined).getMany(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(500)
		})
	})
})
