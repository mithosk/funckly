import { RouteValidator } from './route-validator'

describe('checkRoute', () => {
	it('recognizes wrong route because have a too short part', () => {
		expect(new RouteValidator().checkRoute('cat/do/tiger')).toBe(false)
	})

	it('recognizes wrong route because it contains a number', () => {
		expect(new RouteValidator().checkRoute('cat2')).toBe(false)
	})

	it('recognizes wrong route because it start with illegal character', () => {
		expect(new RouteValidator().checkRoute('/cat')).toBe(false)
	})

	it('recognizes wrong route because missing a character', () => {
		expect(new RouteValidator().checkRoute('cat/{id')).toBe(false)
	})

	it('recognizes wrong route because have consecutive identifiers', () => {
		expect(new RouteValidator().checkRoute('cat/dog/{catId}/{dogId}')).toBe(false)
	})

	it('recognizes a simple well format route as correct', () => {
		expect(new RouteValidator().checkRoute('cat')).toBe(true)
	})

	it('recognizes a complex well format route as correct', () => {
		expect(new RouteValidator().checkRoute('cat/{catId}/dog/{dogId}/tiger/{tigerId}')).toBe(true)
	})
})

describe('matchUrl', () => {
	it('defines not verified match because the url is different from the route', () => {
		expect(new RouteValidator().matchUrl('cat', '/dog')).toBe(false)
	})

	it('defines not verified match because the url is too short', () => {
		expect(new RouteValidator().matchUrl('cat/dog', '/cat')).toBe(false)
	})

	it('defines not verified match because the url is too long', () => {
		expect(new RouteValidator().matchUrl('cat', '/cat/dog')).toBe(false)
	})

	it('defines verified match because the url is equal to the route', () => {
		expect(new RouteValidator().matchUrl('cat', '/cat')).toBe(true)
	})

	it('defines verified match with a correct url containing identifiers', () => {
		expect(new RouteValidator().matchUrl('cat/{catId}/dog/{dogId}/tiger/{tigerId}', '/cat/123/dog/456/tiger/789')).toBe(true)
	})

	it('defines verified match with a correct url containing filter', () => {
		expect(new RouteValidator().matchUrl('cat', '/cat?dog=xxx')).toBe(true)
	})

	it('defines verified match with a correct and upper case url', () => {
		expect(new RouteValidator().matchUrl('cat', '/CAT')).toBe(true)
	})
})
