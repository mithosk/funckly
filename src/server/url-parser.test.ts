import { UrlParser } from './url-parser'

describe('UrlParser', () => {
	describe('getIdentifiers', () => {
		it('finds no identifiers', () => {
			const identifiers = new UrlParser().getIdentifiers('/cat', 'cat')

			expect(Object.keys(identifiers).length).toBe(0)
		})

		it('finds three identifiers', () => {
			const identifiers = new UrlParser().getIdentifiers(
				'/cat/123/dog/456/tiger/789',
				'cat/{catId}/dog/{dogId}/tiger/{tigerId}'
			)

			expect(Object.keys(identifiers).length).toBe(3)
			expect(identifiers['catId']).toBe('123')
			expect(identifiers['dogId']).toBe('456')
			expect(identifiers['tigerId']).toBe('789')
		})
	})

	describe('getFilter', () => {
		it('finds empty filter', () => {
			const filter = new UrlParser().getFilter('/cat')

			expect(filter).toBe('{}')
		})

		it('finds not empty filter', () => {
			const filter = new UrlParser().getFilter('/cat?dog=xxx&tiger=yyy')

			expect(filter).toBe('{"dog":"xxx","tiger":"yyy"}')
		})

		it('finds not empty filter with array', () => {
			const filter = new UrlParser().getFilter('/cat?dog=xxx&dog=yyy')

			expect(filter).toBe('{"dog":["xxx","yyy"]}')
		})
	})
})
