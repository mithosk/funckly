import { UrlParser } from './url-parser'
import { HttpMethod } from './http-method'
import { HttpRequest } from './http-request'
import { IHttpRespond } from './http-respond'
import { HttpResponse } from './http-response'
import { RouteValidator } from './route-validator'
import { createServer, IncomingMessage, ServerResponse } from 'http'

export class VanillaServer {
	private readonly urlParser = new UrlParser()
	private readonly routeValidator = new RouteValidator()
	private readonly httpResponds: { [route: string]: IHttpRespond } = {}

	constructor(port: number) {
		createServer((im: IncomingMessage, sr: ServerResponse) => {
			new Promise(() => {
				sr.statusCode = 404

				let body = ''
				im.on('readable', () => {
					const bodyPart = im.read()
					if (bodyPart !== null) body += bodyPart
				})

				im.on('end', async () => {
					for (const route of Object.keys(this.httpResponds))
						if (this.routeValidator.matchUrl(route, im.url ?? '')) {
							//http method
							const httpMethod = this.getHttpMethod(im.method ?? '')

							//http request
							const identifiers = this.urlParser.getIdentifiers(im.url ?? '', route)

							const filter = this.urlParser.getFilter(im.url ?? '')

							const headers: { [name: string]: string } = {}
							for (const key of Object.keys(im.headers)) headers[key] = im.headers[key]?.toString() ?? ''

							body = body.replace(/\s/g, '')

							const httpRequest = new HttpRequest(identifiers, filter, headers, body)

							//http response
							const httpResponse = new HttpResponse(sr)

							//responder execution
							await this.httpResponds[route](httpMethod, httpRequest, httpResponse)
							break
						}

					sr.end()
				})
			})
		}).listen(port)
	}

	public subscribe(route: string, httpRespond: IHttpRespond): void {
		if (!this.routeValidator.checkRoute(route)) throw new Error('invalid route')

		this.httpResponds[route] = httpRespond
	}

	private getHttpMethod(method: string): HttpMethod {
		switch (method) {
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
