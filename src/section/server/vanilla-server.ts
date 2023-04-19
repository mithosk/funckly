import { UrlParser } from './url-parser'
import { HttpRequest } from './http-request'
import { IHttpRespond } from './http-respond'
import { HttpResponse } from './http-response'
import { RouteValidator } from './route-validator'
import { HttpMethodParser } from './http-method-parser'
import { createServer, IncomingMessage, ServerResponse } from 'http'

export interface IVanillaServer {
	subscribe(route: string, httpRespond: IHttpRespond): void
}

export class VanillaServer implements IVanillaServer {
	private readonly urlParser = new UrlParser()
	private readonly routeValidator = new RouteValidator()
	private readonly httpMethodParser = new HttpMethodParser()
	private readonly httpResponds: { [route: string]: IHttpRespond } = {}

	constructor(port: number) {
		createServer((im: IncomingMessage, sr: ServerResponse) => {
			new Promise<void>(resolve => {
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
							const httpMethod = this.httpMethodParser.parse(im.method ?? '')

							//http request
							const identifiers = this.urlParser.getIdentifiers(im.url ?? '', route)

							const filter = this.urlParser.getFilter(im.url ?? '')

							const headers: { [name: string]: string } = {}
							for (const key of Object.keys(im.headers)) headers[key] = im.headers[key.toLowerCase()]?.toString() ?? ''

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

				resolve()
			})
		}).listen(port)
	}

	public subscribe(route: string, httpRespond: IHttpRespond): void {
		if (!this.routeValidator.checkRoute(route)) throw new Error('invalid route')

		this.httpResponds[route] = httpRespond
	}
}
