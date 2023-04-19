import { HttpMethod } from './http-method'
import { HttpMethodParser } from './http-method-parser'

describe('HttpMethodParser', () => {
	describe('parse', () => {
		it('parses Post method', () => {
			expect(new HttpMethodParser().parse('POST')).toBe(HttpMethod.Post)
		})

		it('parses Get method', () => {
			expect(new HttpMethodParser().parse('get')).toBe(HttpMethod.Get)
		})

		it('parses Put method', () => {
			expect(new HttpMethodParser().parse(' put ')).toBe(HttpMethod.Put)
		})

		it('parses Patch method', () => {
			expect(new HttpMethodParser().parse(' PaTcH ')).toBe(HttpMethod.Patch)
		})

		it('parses Delete method', () => {
			expect(new HttpMethodParser().parse('  dElEtE  ')).toBe(HttpMethod.Delete)
		})

		it('parses Unknown method', () => {
			expect(new HttpMethodParser().parse('X')).toBe(HttpMethod.Unknown)
		})
	})
})
