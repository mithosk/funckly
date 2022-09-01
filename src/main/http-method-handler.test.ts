import { IPage } from '../crud/page'
import { IValidate } from './validate'
import { INormalize } from './normalize'
import { Validator } from '../crud/validator'
import { IController } from '../crud/controller'
import { HttpRequest } from '../server/http-request'
import { NotFoundError } from '../crud/not-found-error'
import { IHttpResponse } from '../server/http-response'
import { ForbiddenError } from '../crud/forbidden-error'
import { HttpMethodHandler } from './http-method-handler'

class FakeModel {
	cat: string | undefined
	dog: number | undefined
	tiger: string | undefined
}

class FakeFilter {
	lion: string | undefined
	crocodile: number | undefined
	horse: string | undefined
}

class FakeController implements IController<FakeModel, FakeFilter> {
	public async create(model: FakeModel, identifiers: { [name: string]: string }): Promise<FakeModel> {
		this.throwControllerError(identifiers)

		return { ...model }
	}

	public async read(identifiers: { [name: string]: string }): Promise<FakeModel> {
		this.throwControllerError(identifiers)

		return {
			cat: 'aaa',
			dog: 111,
			tiger: 'bbb'
		}
	}

	public async update(identifiers: { [name: string]: string }, model: FakeModel): Promise<FakeModel> {
		this.throwControllerError(identifiers)

		return { ...model }
	}

	public async delete(identifiers: { [name: string]: string }): Promise<void> {
		this.throwControllerError(identifiers)
	}

	public async list(identifiers: { [name: string]: string }): Promise<IPage<FakeModel>> {
		this.throwControllerError(identifiers)

		return {
			models: [
				{
					cat: 'aaa',
					dog: 111,
					tiger: 'bbb'
				},
				{
					cat: 'ccc',
					dog: 222,
					tiger: 'ddd'
				}
			],
			sortType: 'cat-asc',
			pageCount: 10,
			itemCount: 100
		}
	}

	private throwControllerError(identifiers: { [name: string]: string }): void {
		switch (identifiers['error']) {
			case '403':
				throw new ForbiddenError('forbidden')

			case '404':
				throw new NotFoundError('not found')

			case '500':
				throw new Error('generic')
		}
	}
}

class FakeHttpResponse implements IHttpResponse {
	public status: number | undefined = undefined
	public headers: { [name: string]: string } = {}
	public body: string | undefined = undefined

	public setStatus(code: number): IHttpResponse {
		this.status = code

		return this
	}

	public setHeader(name: string, value: string): IHttpResponse {
		this.headers[name] = value

		return this
	}

	public setBody(body: string): void {
		this.body = body
	}
}

describe('post', () => {
	it('sets the status to 201', async () => {
		const httpMethodHandler = new HttpMethodHandler(new FakeController())

		const httpRequest = new HttpRequest({}, '', {}, '')
		const httpResponse = new FakeHttpResponse()
		const validate: IValidate<FakeModel> = model => new Validator(model)

		await httpMethodHandler.post(httpRequest, httpResponse, validate)

		expect(httpResponse.status).toBe(201)
	})

	it('sets the status to 400', async () => {
		const httpMethodHandler = new HttpMethodHandler(new FakeController())

		const httpRequest = new HttpRequest({}, '', {}, '{"cat":"aaa","dog":111}')
		const httpResponse = new FakeHttpResponse()
		const validate: IValidate<FakeModel> = model => new Validator(model).notEmpty(fma => fma.tiger, 'empty tiger')

		await httpMethodHandler.post(httpRequest, httpResponse, validate)

		expect(httpResponse.status).toBe(400)
	})

	it('sets the status to 403', async () => {
		const httpMethodHandler = new HttpMethodHandler(new FakeController())

		const httpRequest = new HttpRequest({ error: '403' }, '', {}, '')
		const httpResponse = new FakeHttpResponse()
		const validate: IValidate<FakeModel> = model => new Validator(model)

		await httpMethodHandler.post(httpRequest, httpResponse, validate)

		expect(httpResponse.status).toBe(403)
	})

	it('sets the status to 500', async () => {
		const httpMethodHandler = new HttpMethodHandler(new FakeController())

		const httpRequest = new HttpRequest({ error: '500' }, '', {}, '')
		const httpResponse = new FakeHttpResponse()
		const validate: IValidate<FakeModel> = model => new Validator(model)

		await httpMethodHandler.post(httpRequest, httpResponse, validate)

		expect(httpResponse.status).toBe(500)
	})
})

describe('getOne', () => {
	it('sets the status to 200', async () => {
		const httpMethodHandler = new HttpMethodHandler(new FakeController())

		const httpRequest = new HttpRequest({}, '', {}, '')
		const httpResponse = new FakeHttpResponse()

		await httpMethodHandler.getOne(httpRequest, httpResponse)

		expect(httpResponse.status).toBe(200)
	})

	it('sets the status to 404', async () => {
		const httpMethodHandler = new HttpMethodHandler(new FakeController())

		const httpRequest = new HttpRequest({ error: '404' }, '', {}, '')
		const httpResponse = new FakeHttpResponse()

		await httpMethodHandler.getOne(httpRequest, httpResponse)

		expect(httpResponse.status).toBe(404)
	})
})

describe('put', () => {
	it('sets the status to 200', async () => {
		const httpMethodHandler = new HttpMethodHandler(new FakeController())

		const httpRequest = new HttpRequest({}, '', {}, '')
		const httpResponse = new FakeHttpResponse()
		const validate: IValidate<FakeModel> = model => new Validator(model)

		await httpMethodHandler.put(httpRequest, httpResponse, validate)

		expect(httpResponse.status).toBe(200)
	})

	it('sets the status to 400', async () => {
		const httpMethodHandler = new HttpMethodHandler(new FakeController())

		const httpRequest = new HttpRequest({}, '', {}, '{"cat":"aaa","dog":111}')
		const httpResponse = new FakeHttpResponse()
		const validate: IValidate<FakeModel> = model => new Validator(model).notEmpty(fma => fma.tiger, 'empty tiger')

		await httpMethodHandler.put(httpRequest, httpResponse, validate)

		expect(httpResponse.status).toBe(400)
	})
})

describe('patch', () => {
	it('sets the status to 200', async () => {
		const httpMethodHandler = new HttpMethodHandler(new FakeController())

		const httpRequest = new HttpRequest({}, '', {}, '{"cat":"xxx"}')
		const httpResponse = new FakeHttpResponse()
		const validate: IValidate<FakeModel> = model =>
			new Validator(model)
				.notEmpty(fma => fma.cat, 'empty cat')
				.notEmpty(fma => fma.dog, 'empty dog')
				.notEmpty(fma => fma.tiger, 'empty tiger')

		await httpMethodHandler.patch(httpRequest, httpResponse, validate)

		expect(httpResponse.status).toBe(200)
	})

	it('sets the status to 400', async () => {
		const httpMethodHandler = new HttpMethodHandler(new FakeController())

		const httpRequest = new HttpRequest({}, '', {}, '{"cat":null}')
		const httpResponse = new FakeHttpResponse()
		const validate: IValidate<FakeModel> = model => new Validator(model).notEmpty(fma => fma.cat, 'empty cat')

		await httpMethodHandler.patch(httpRequest, httpResponse, validate)

		expect(httpResponse.status).toBe(400)
	})
})

describe('delete', () => {
	it('sets the status to 204', async () => {
		const httpMethodHandler = new HttpMethodHandler(new FakeController())

		const httpRequest = new HttpRequest({}, '', {}, '')
		const httpResponse = new FakeHttpResponse()

		await httpMethodHandler.delete(httpRequest, httpResponse)

		expect(httpResponse.status).toBe(204)
	})
})

describe('getMany', () => {
	it('sets the status to 200', async () => {
		const httpMethodHandler = new HttpMethodHandler<FakeModel, FakeFilter>(new FakeController())

		const httpRequest = new HttpRequest({}, '', {}, '')
		const httpResponse = new FakeHttpResponse()
		const normalize: INormalize<FakeFilter> = () => undefined

		await httpMethodHandler.getMany(httpRequest, httpResponse, normalize)

		expect(httpResponse.status).toBe(200)
	})

	it('sets the status to 200 without normalization', async () => {
		const httpMethodHandler = new HttpMethodHandler(new FakeController())

		const httpRequest = new HttpRequest({}, '', {}, '')
		const httpResponse = new FakeHttpResponse()

		await httpMethodHandler.getMany(httpRequest, httpResponse, undefined)

		expect(httpResponse.status).toBe(200)
	})

	it('sets the status to 200 with pagination params', async () => {
		const httpMethodHandler = new HttpMethodHandler<FakeModel, FakeFilter>(new FakeController())

		const httpRequest = new HttpRequest({}, '', { pageindex: '2', pagesize: '30' }, '')
		const httpResponse = new FakeHttpResponse()
		const normalize: INormalize<FakeFilter> = () => undefined

		await httpMethodHandler.getMany(httpRequest, httpResponse, normalize)

		expect(httpResponse.status).toBe(200)
	})
})
