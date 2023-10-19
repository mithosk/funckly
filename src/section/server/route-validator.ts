export class RouteValidator {
	public checkRoute(route: string): boolean {
		const lowerCaseRegExp = /^[a-z]+$/
		const camelCaseRegExp = /^[a-zA-Z]+$/

		const routeParts = route.split('/')

		for (const routePart of routeParts)
			if (routePart.startsWith('{')) {
				if (!routePart.endsWith('}')) return false

				if (!camelCaseRegExp.test(routePart.substring(1, routePart.length - 1))) return false
			} else {
				const routePartWords = routePart.split('-')

				for (const routePartWord of routePartWords) if (!lowerCaseRegExp.test(routePartWord)) return false
			}

		return true
	}

	public matchUrl(route: string, url: string): boolean {
		const routeParts = route.split('/')
		const urlParts = url.split('?')[0].split('/')

		if (routeParts.length !== urlParts.length - 1) return false

		for (let i = 0; i < routeParts.length; i++)
			if (!routeParts[i].startsWith('{') && routeParts[i] !== urlParts[i + 1].toLowerCase()) return false

		return true
	}
}
