export class RouteValidator {
	public checkRoute(route: string): boolean {
		const regexp = /^[a-zA-Z]+$/

		const routeParts = route.split('/')

		for (const routePart of routeParts) {
			if (routePart.length < 3) return false

			if (routePart.startsWith('{') && !routePart.endsWith('}')) return false

			if (!regexp.test(routePart.startsWith('{') ? routePart.substring(1, routePart.length - 1) : routePart))
				return false
		}

		return route.indexOf('}/{') < 0
	}

	public matchUrl(route: string, url: string): boolean {
		const routeParts = route.split('/')
		const urlParts = url.split('?')[0].split('/')

		if (routeParts.length !== urlParts.length - 1) return false

		for (let i = 0; i < routeParts.length; i++)
			if (!routeParts[i].startsWith('{') && routeParts[i].toLocaleLowerCase() !== urlParts[i + 1].toLocaleLowerCase())
				return false

		return true
	}
}
