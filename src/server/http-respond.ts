import { HttpMethod } from './http-method'
import { HttpRequest } from './http-request'
import { HttpResponse } from './http-response'

export interface IHttpRespond {
	(method: HttpMethod, request: HttpRequest, response: HttpResponse): Promise<void>
}
