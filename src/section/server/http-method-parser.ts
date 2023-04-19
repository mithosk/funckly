import { HttpMethod } from './http-method'

export class HttpMethodParser {
	public parse(method: string): HttpMethod {
		switch (method.trim().toUpperCase()) {
			case 'POST':
				return HttpMethod.Post

			case 'GET':
				return HttpMethod.Get

			case 'PUT':
				return HttpMethod.Put

			case 'PATCH':
				return HttpMethod.Patch

			case 'DELETE':
				return HttpMethod.Delete

			default:
				return HttpMethod.Unknown
		}
	}
}
