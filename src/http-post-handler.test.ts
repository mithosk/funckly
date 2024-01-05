import { HttpPostHandler } from './http-post-handler'
import { IValidator } from './section/inspect/validator'
import { IResolver } from './section/procedure/resolver'
import { ExecuteError } from './section/procedure/execute-error'
import { ITypedHttpRequest } from './section/server/typed-http-request'
import { ITypedHttpResponse } from './section/server/typed-http-response'

describe('HttpPostHandler', () => {
	interface IFakeData {
		cat: string
		dog: number
		tiger: string
	}

	interface IFakeResult {
		lion: boolean
		crocodile: number
	}

	let resolver: jest.Mocked<IResolver<IFakeData, IFakeResult>>
	let validator: jest.Mocked<IValidator<IFakeData>>
	let request: jest.Mocked<ITypedHttpRequest>
	let response: jest.Mocked<ITypedHttpResponse>

	beforeEach(() => {
		resolver = {
			execute: jest.fn()
		}

		validator = {
			notAllowed: jest.fn(),
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
		it('sets the status to 200', async () => {
			const authorize = jest.fn().mockReturnValue('X1Y2Z3KNWWW4567L')
			validator.getErrors.mockReturnValue([])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpPostHandler(resolver, authorize, () => validator).post(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(200)
		})

		it('sets the status to 400', async () => {
			validator.getErrors.mockReturnValue(['abcde', 'fghil'])
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpPostHandler(resolver, undefined, () => validator).post(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(400)
		})

		it('sets the status to 401', async () => {
			const authorize = jest.fn()
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpPostHandler(resolver, authorize, undefined).post(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(401)
		})

		it('sets the status to 403', async () => {
			resolver.execute.mockImplementation(() => {
				throw new ExecuteError('abc')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpPostHandler(resolver, undefined, undefined).post(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(403)
		})

		it('sets the status to 500', async () => {
			resolver.execute.mockImplementation(() => {
				throw new Error('abc')
			})
			response.setStatus.mockReturnValue(response)
			response.setStandardHeader.mockReturnValue(response)

			await new HttpPostHandler(resolver, undefined, undefined).post(request, response)

			expect(response.setStatus).toBeCalledTimes(1)
			expect(response.setStatus).toBeCalledWith(500)
		})
	})
})
