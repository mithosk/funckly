import { parse } from 'querystring'

export class UrlParser {
	public getIdentifiers(url: string, route: string): { [name: string]: string } {
		const identifiers: { [name: string]: string } = {}

		const routeParts = route.split('/')
		const urlParts = url.split('?')[0].split('/')

		for (let i = 0; i < routeParts.length; i++)
			if (routeParts[i].startsWith('{'))
				identifiers[routeParts[i].substring(1, routeParts[i].length - 1)] = urlParts[i + 1]

		return identifiers
	}

	public getFilter(url: string): string {
		return JSON.stringify(parse(url.split('?')[1]))
	}
}
