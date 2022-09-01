import { Validator } from './validator'

describe('notEmpty', () => {
	it('recognizes null and undefined as empty', () => {
		const model = {
			cat: null,
			dog: undefined
		}

		const errors = new Validator(model)
			.notEmpty(model => model.cat, 'empty cat')
			.notEmpty(model => model.dog, 'empty dog')
			.getErrors()

		expect(errors.length).toBe(2)
		expect(errors[0]).toBe('empty cat')
		expect(errors[1]).toBe('empty dog')
	})

	it('finds no errors', () => {
		const model = {
			cat: 'xxx',
			dog: 'yyy'
		}

		const errors = new Validator(model)
			.notEmpty(model => model.cat, 'empty cat')
			.notEmpty(model => model.dog, 'empty dog')
			.getErrors()

		expect(errors.length).toBe(0)
	})
})
