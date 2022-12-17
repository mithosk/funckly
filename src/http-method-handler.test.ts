import { IController } from './section/crud/controller'
import { INormalize } from './section/inspect/normalize'
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
	let normalize: jest.Mocked<INormalize<IFakeFilter>>
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

		normalize = jest.fn()

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
			setBody: jest.fn()
		}
	})

	describe('post', () => {
		it('sets the status to 201', async () => {
			validator.getErrors.mockReturnValue([])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, () => validator, undefined).post(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(201)
		})

		it('sets the status to 400', async () => {
			validator.getErrors.mockReturnValue(['xxx'])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, () => validator, undefined).post(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(400)
		})

		it('sets the status to 403', async () => {
			controller.create.mockImplementation(() => {
				throw new ForbiddenError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).post(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(403)
		})

		it('sets the status to 405', async () => {
			controller.create.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).post(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(405)
		})

		it('sets the status to 500', async () => {
			controller.create.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).post(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(500)
		})
	})

	describe('getOne', () => {
		it('sets the status to 200', async () => {
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).getOne(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(200)
		})

		it('sets the status to 400', async () => {
			prevalidator.validate.mockReturnValue(['xxx'])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, prevalidator, undefined, undefined).getOne(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(400)
		})

		it('sets the status to 404', async () => {
			controller.read.mockImplementation(() => {
				throw new NotFoundError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).getOne(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(404)
		})

		it('sets the status to 405', async () => {
			controller.read.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).getOne(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(405)
		})

		it('sets the status to 500', async () => {
			controller.read.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).getOne(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(500)
		})
	})

	describe('put', () => {
		it('sets the status to 200', async () => {
			validator.getErrors.mockReturnValue([])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, () => validator, undefined).put(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(200)
		})

		it('sets the status to 400', async () => {
			validator.getErrors.mockReturnValue(['xxx'])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, () => validator, undefined).put(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(400)
		})

		it('sets the status to 403', async () => {
			controller.update.mockImplementation(() => {
				throw new ForbiddenError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).put(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(403)
		})

		it('sets the status to 404', async () => {
			controller.update.mockImplementation(() => {
				throw new NotFoundError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).put(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(404)
		})

		it('sets the status to 405', async () => {
			controller.update.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).put(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(405)
		})

		it('sets the status to 500', async () => {
			controller.update.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).put(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(500)
		})
	})

	describe('patch', () => {
		it('sets the status to 200', async () => {
			controller.read.mockResolvedValue({ cat: 'xxx', dog: 111, tiger: 'yyy' })
			validator.getErrors.mockReturnValue([])
			request.getBody.mockReturnValue({ cat: undefined, dog: undefined, tiger: 'zzz' })
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, () => validator, undefined).patch(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(200)
		})

		it('sets the status to 400', async () => {
			controller.read.mockResolvedValue({ cat: 'xxx', dog: 111, tiger: 'yyy' })
			validator.getErrors.mockReturnValue(['xxx'])
			request.getBody.mockReturnValue({ cat: undefined, dog: undefined, tiger: 'zzz' })
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, () => validator, undefined).patch(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(400)
		})

		it('sets the status to 403', async () => {
			controller.read.mockImplementation(() => {
				throw new ForbiddenError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).patch(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(403)
		})

		it('sets the status to 404', async () => {
			controller.read.mockImplementation(() => {
				throw new NotFoundError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).patch(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(404)
		})

		it('sets the status to 405', async () => {
			controller.read.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).patch(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(405)
		})

		it('sets the status to 500', async () => {
			controller.read.mockResolvedValue({ cat: 'xxx', dog: 111, tiger: 'yyy' })
			controller.update.mockImplementation(() => {
				throw new Error('xxx')
			})
			request.getBody.mockReturnValue({ cat: undefined, dog: undefined, tiger: 'zzz' })
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).patch(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(500)
		})
	})

	describe('delete', () => {
		it('sets the status to 204', async () => {
			await new HttpMethodHandler(controller, undefined, undefined, undefined).delete(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(204)
		})

		it('sets the status to 400', async () => {
			prevalidator.validate.mockReturnValue(['xxx', 'yyy'])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, prevalidator, undefined, undefined).delete(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(400)
		})

		it('sets the status to 403', async () => {
			controller.delete.mockImplementation(() => {
				throw new ForbiddenError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).delete(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(403)
		})

		it('sets the status to 404', async () => {
			controller.delete.mockImplementation(() => {
				throw new NotFoundError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).delete(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(404)
		})

		it('sets the status to 405', async () => {
			controller.delete.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).delete(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(405)
		})

		it('sets the status to 500', async () => {
			controller.delete.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).delete(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(500)
		})
	})

	describe('getMany', () => {
		it('sets the status to 200', async () => {
			controller.list.mockResolvedValue({ models: [], pageCount: 1, itemCount: 10 })
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)
			response.setCustomHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, normalize).getMany(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(200)
		})

		it('sets the status to 405', async () => {
			controller.list.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).getMany(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(405)
		})

		it('sets the status to 500', async () => {
			controller.list.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller, undefined, undefined, undefined).getMany(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(500)
		})
	})
})
