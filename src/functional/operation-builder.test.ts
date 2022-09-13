import { OperationBuilder } from './operation-builder'

describe('OperationBuilder', () => {
	describe('combine', () => {
		it('combines a function with itself', () => {
			const concatenate = (strR: string) => (strL: string) => strL + '-' + strR

			const combined = new OperationBuilder((param: string) => param)
				.combine(concatenate('dog'))
				.combine(concatenate('tiger'))
				.combine(concatenate('lion'))
				.getOperation()

			const result = combined('cat')

			expect(result).toBe('cat-dog-tiger-lion')
		})

		it('combines two functions', () => {
			const concatenate = (strR: string) => (strL: string) => strL + '-' + strR
			const measure = (str: string) => str.length

			const combined = new OperationBuilder((param: string) => param)
				.combine(concatenate('dog'))
				.combine(measure)
				.getOperation()

			const result = combined('cat')

			expect(result).toBe(7)
		})
	})
})
