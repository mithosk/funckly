import { IController } from '../crud/controller'
import { IValidator } from '../inspect/validator'
import { NotFoundError } from '../crud/not-found-error'
import { ForbiddenError } from '../crud/forbidden-error'
import { ITypedHttpRequest } from './typed-http-request'
import { HttpMethodHandler } from './http-method-handler'
import { ITypedHttpResponse } from './typed-http-response'
import { MethodNotAllowedError } from '../crud/method-not-allowed-error'

describe('HttpMethodHandler', () => {
	class FakeModel {
		cat: string | undefined
		dog: number | undefined
		tiger: string | undefined
	}

	class FakeFilter {
		lion: string | undefined
	}

	let controller: jest.Mocked<IController<FakeModel, FakeFilter>>
	let request: jest.Mocked<ITypedHttpRequest>
	let response: jest.Mocked<ITypedHttpResponse>
	let validator: jest.Mocked<IValidator<FakeModel>>

	beforeEach(() => {
		controller = {
			create: jest.fn(),
			read: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			list: jest.fn()
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
			setBody: jest.fn()
		}

		validator = {
			notEmpty: jest.fn(),
			isString: jest.fn(),
			mustLength: jest.fn(),
			isUuid: jest.fn(),
			isDate: jest.fn(),
			isEnum: jest.fn(),
			isInt: jest.fn(),
			isFloat: jest.fn(),
			mustRange: jest.fn(),
			isArray: jest.fn(),
			getErrors: jest.fn()
		}
	})

	describe('post', () => {
		it('sets the status to 201', async () => {
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)
			validator.getErrors.mockReturnValue([])

			await new HttpMethodHandler(controller).post(request, response, () => validator)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(201)
		})

		it('sets the status to 400', async () => {
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)
			validator.getErrors.mockReturnValue(['xxx'])

			await new HttpMethodHandler(controller).post(request, response, () => validator)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(400)
		})

		it('sets the status to 403', async () => {
			controller.create.mockImplementation(() => {
				throw new ForbiddenError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).post(request, response, undefined)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(403)
		})

		it('sets the status to 405', async () => {
			controller.create.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).post(request, response, undefined)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(405)
		})

		it('sets the status to 500', async () => {
			controller.create.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).post(request, response, undefined)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(500)
		})
	})

	describe('getOne', () => {
		it('sets the status to 200', async () => {
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).getOne(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(200)
		})

		it('sets the status to 404', async () => {
			controller.read.mockImplementation(() => {
				throw new NotFoundError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).getOne(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(404)
		})

		it('sets the status to 405', async () => {
			controller.read.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).getOne(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(405)
		})

		it('sets the status to 500', async () => {
			controller.read.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).getOne(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(500)
		})
	})

	describe('put', () => {
		it('sets the status to 200', async () => {
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)
			validator.getErrors.mockReturnValue([])

			await new HttpMethodHandler(controller).put(request, response, () => validator)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(200)
		})

		it('sets the status to 400', async () => {
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)
			validator.getErrors.mockReturnValue(['xxx'])

			await new HttpMethodHandler(controller).put(request, response, () => validator)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(400)
		})

		it('sets the status to 403', async () => {
			controller.update.mockImplementation(() => {
				throw new ForbiddenError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).put(request, response, undefined)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(403)
		})

		it('sets the status to 404', async () => {
			controller.update.mockImplementation(() => {
				throw new NotFoundError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).put(request, response, undefined)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(404)
		})

		it('sets the status to 405', async () => {
			controller.update.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).put(request, response, undefined)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(405)
		})

		it('sets the status to 500', async () => {
			controller.update.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).put(request, response, undefined)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(500)
		})
	})

	describe('patch', () => {
		it('sets the status to 200', async () => {
			controller.read.mockResolvedValue({ cat: 'xxx', dog: 111, tiger: 'yyy' })
			request.getBody.mockReturnValue({ cat: undefined, dog: undefined, tiger: 'zzz' })
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)
			validator.getErrors.mockReturnValue([])

			await new HttpMethodHandler(controller).patch(request, response, () => validator)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(200)
		})

		it('sets the status to 400', async () => {
			controller.read.mockResolvedValue({ cat: 'xxx', dog: 111, tiger: 'yyy' })
			request.getBody.mockReturnValue({ cat: undefined, dog: undefined, tiger: 'zzz' })
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)
			validator.getErrors.mockReturnValue(['xxx'])

			await new HttpMethodHandler(controller).patch(request, response, () => validator)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(400)
		})

		it('sets the status to 403', async () => {
			controller.read.mockImplementation(() => {
				throw new ForbiddenError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).patch(request, response, undefined)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(403)
		})

		it('sets the status to 404', async () => {
			controller.read.mockImplementation(() => {
				throw new NotFoundError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).patch(request, response, undefined)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(404)
		})

		it('sets the status to 405', async () => {
			controller.read.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).patch(request, response, undefined)

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

			await new HttpMethodHandler(controller).patch(request, response, undefined)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(500)
		})
	})

	describe('delete', () => {
		it('sets the status to 204', async () => {
			await new HttpMethodHandler(controller).delete(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(204)
		})

		it('sets the status to 403', async () => {
			controller.delete.mockImplementation(() => {
				throw new ForbiddenError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).delete(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(403)
		})

		it('sets the status to 404', async () => {
			controller.delete.mockImplementation(() => {
				throw new NotFoundError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).delete(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(404)
		})

		it('sets the status to 405', async () => {
			controller.delete.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).delete(request, response)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(405)
		})

		it('sets the status to 500', async () => {
			controller.delete.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).delete(request, response)

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

			await new HttpMethodHandler(controller).getMany(request, response, undefined)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(200)
		})

		it('sets the status to 405', async () => {
			controller.list.mockImplementation(() => {
				throw new MethodNotAllowedError('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).getMany(request, response, undefined)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(405)
		})

		it('sets the status to 500', async () => {
			controller.list.mockImplementation(() => {
				throw new Error('xxx')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpMethodHandler(controller).getMany(request, response, undefined)

			expect(response.setStatus.mock.calls.length).toBe(1)
			expect(response.setStatus.mock.calls[0][0]).toBe(500)
		})
	})
})
