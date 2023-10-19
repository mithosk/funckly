import { RouteValidator } from './route-validator'

describe('RouteValidator', () => {
	describe('checkRoute', () => {
		it('recognizes wrong route because it start with slash character', () => {
			expect(new RouteValidator().checkRoute('/cat/dog/tiger')).toBe(false)
		})

		it('recognizes wrong route because it end with slash character', () => {
			expect(new RouteValidator().checkRoute('cat/dog/tiger/')).toBe(false)
		})

		it('recognizes wrong route because it contains an uppercase character', () => {
			expect(new RouteValidator().checkRoute('cat/dog/Tiger')).toBe(false)
		})

		it('recognizes wrong route because it contains a number', () => {
			expect(new RouteValidator().checkRoute('cat/dog2/tiger')).toBe(false)
		})

		it('recognizes wrong route because an internal part start with minus character', () => {
			expect(new RouteValidator().checkRoute('cat/-dog/tiger')).toBe(false)
		})

		it('recognizes wrong route because an internal part end with minus character', () => {
			expect(new RouteValidator().checkRoute('cat/dog-/tiger')).toBe(false)
		})

		it('recognizes wrong route because it contains consecutive minus characters', () => {
			expect(new RouteValidator().checkRoute('cat--dog')).toBe(false)
		})

		it('recognizes wrong route because an identifier missing end character', () => {
			expect(new RouteValidator().checkRoute('cat/{id')).toBe(false)
		})

		it('recognizes wrong route because an identifier missing start character', () => {
			expect(new RouteValidator().checkRoute('cat/id}')).toBe(false)
		})

		it('recognizes a simple well format route as correct', () => {
			expect(new RouteValidator().checkRoute('cat')).toBe(true)
		})

		it('recognizes a route with minus character as correct', () => {
			expect(new RouteValidator().checkRoute('cat-dog')).toBe(true)
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

		it('defines not verified match because the url end with slash character', () => {
			expect(new RouteValidator().matchUrl('cat', '/cat/')).toBe(false)
		})

		it('defines verified match because the url is equal to the route', () => {
			expect(new RouteValidator().matchUrl('cat', '/cat')).toBe(true)
		})

		it('defines verified match with a correct url containing identifiers', () => {
			expect(
				new RouteValidator().matchUrl('cat/{catId}/dog/{dogId}/tiger/{tigerId}', '/cat/123/dog/456/tiger/789')
			).toBe(true)
		})

		it('defines verified match with a correct url containing filter', () => {
			expect(new RouteValidator().matchUrl('cat', '/cat?dog=xxx')).toBe(true)
		})

		it('defines verified match with a correct and upper case url', () => {
			expect(new RouteValidator().matchUrl('cat', '/CAT')).toBe(true)
		})
	})
})
