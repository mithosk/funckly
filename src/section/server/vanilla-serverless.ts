import { UrlParser } from './url-parser'
import { HttpRequest } from './http-request'
import { IHttpRespond } from './http-respond'
import { HttpResponse } from './http-response'
import { IVanillaServer } from './vanilla-server'
import { RouteValidator } from './route-validator'
import { HttpMethodParser } from './http-method-parser'
import { ServerlessResponse } from './serverless-response'

export class VanillaServerless implements IVanillaServer {
	private readonly urlParser = new UrlParser()
	private readonly routeValidator = new RouteValidator()
	private readonly httpMethodParser = new HttpMethodParser()
	private readonly httpResponds: { [route: string]: IHttpRespond } = {}

	public subscribe(route: string, httpRespond: IHttpRespond): void {
		if (!this.routeValidator.checkRoute(route)) throw new Error('invalid route')

		this.httpResponds[route] = httpRespond
	}

	public async send(
		method: string,
		url: string,
		headers: { [name: string]: string },
		body: string
	): Promise<ServerlessResponse> {
		const serverlessResponse = new ServerlessResponse()
		serverlessResponse.statusCode = 404

		for (const route of Object.keys(this.httpResponds))
			if (this.routeValidator.matchUrl(route, url)) {
				//http method
				const httpMethod = this.httpMethodParser.parse(method)

				//http request
				const identifiers = this.urlParser.getIdentifiers(url, route)

				const filter = this.urlParser.getFilter(url)

				const lowerCaseHeaders: { [name: string]: string } = {}
				for (const key of Object.keys(headers)) lowerCaseHeaders[key.toLowerCase()] = headers[key]

				const httpRequest = new HttpRequest(identifiers, filter, lowerCaseHeaders, body)

				//http response
				const httpResponse = new HttpResponse(serverlessResponse)

				//responder execution
				await this.httpResponds[route](httpMethod, httpRequest, httpResponse)
				break
			}

		return serverlessResponse
	}
}
