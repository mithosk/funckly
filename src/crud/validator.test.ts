import { Validator } from './validator'

describe('Validator', () => {
	describe('notEmpty', () => {
		it('recognizes null and undefined as empty', () => {
			const model = {
				cat: null,
				dog: undefined
			}

			const errors = new Validator(model)
				.notEmpty(model => model.cat, 'xxx')
				.notEmpty(model => model.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('finds no errors', () => {
			const model = {
				cat: 'aaa',
				dog: 1.23,
				tiger: [],
				lion: {}
			}

			const errors = new Validator(model)
				.notEmpty(model => model.cat, 'xxx')
				.notEmpty(model => model.dog, 'yyy')
				.notEmpty(model => model.tiger, 'zzz')
				.notEmpty(model => model.lion, 'kkk')
				.getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('isString', () => {
		it('recognizes numbers as not strings', () => {
			const model = {
				cat: 145,
				dog: 1.23
			}

			const errors = new Validator(model)
				.isString(model => model.cat, 'xxx')
				.isString(model => model.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('recognizes an array as not string', () => {
			const model = {
				cat: []
			}

			const errors = new Validator(model).isString(model => model.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('recognizes an object as not string', () => {
			const model = {
				cat: {}
			}

			const errors = new Validator(model).isString(model => model.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors', () => {
			const model = {
				cat: 'aaa',
				dog: null,
				tiger: undefined
			}

			const errors = new Validator(model)
				.isString(model => model.cat, 'xxx')
				.isString(model => model.dog, 'yyy')
				.isString(model => model.tiger, 'zzz')
				.getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('isUuid', () => {
		it('recognizes numbers as not uuid', () => {
			const model = {
				cat: 145,
				dog: 1.23
			}

			const errors = new Validator(model)
				.isUuid(model => model.cat, 'xxx')
				.isUuid(model => model.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('recognizes a string as not uuid', () => {
			const model = {
				cat: 'aaa'
			}

			const errors = new Validator(model).isUuid(model => model.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors', () => {
			const model = {
				cat: '9fccd79b-be40-4bfb-b0f6-06b21810c8eb',
				dog: null,
				tiger: undefined
			}

			const errors = new Validator(model)
				.isUuid(model => model.cat, 'xxx')
				.isUuid(model => model.dog, 'yyy')
				.isUuid(model => model.tiger, 'zzz')
				.getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('isInt', () => {
		it('recognizes strings as not int', () => {
			const model = {
				cat: 'aaa',
				dog: '145'
			}

			const errors = new Validator(model)
				.isInt(model => model.cat, 'xxx')
				.isInt(model => model.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('recognizes a number with dot as not int', () => {
			const model = {
				cat: 1.23
			}

			const errors = new Validator(model).isInt(model => model.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('recognizes an array as not int', () => {
			const model = {
				cat: []
			}

			const errors = new Validator(model).isInt(model => model.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('recognizes an object as not int', () => {
			const model = {
				cat: {}
			}

			const errors = new Validator(model).isInt(model => model.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors', () => {
			const model = {
				cat: 145,
				dog: 213.0,
				tiger: null,
				lion: undefined
			}

			const errors = new Validator(model)
				.isInt(model => model.cat, 'xxx')
				.isInt(model => model.dog, 'yyy')
				.isInt(model => model.tiger, 'zzz')
				.isInt(model => model.lion, 'kkk')
				.getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('isFloat', () => {
		it('recognizes strings as not float', () => {
			const model = {
				cat: 'aaa',
				dog: '1.23'
			}

			const errors = new Validator(model)
				.isFloat(model => model.cat, 'xxx')
				.isFloat(model => model.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('recognizes an array as not float', () => {
			const model = {
				cat: []
			}

			const errors = new Validator(model).isFloat(model => model.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('recognizes an object as not float', () => {
			const model = {
				cat: {}
			}

			const errors = new Validator(model).isFloat(model => model.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors', () => {
			const model = {
				cat: 1.23,
				dog: 145,
				tiger: null,
				lion: undefined
			}

			const errors = new Validator(model)
				.isFloat(model => model.cat, 'xxx')
				.isFloat(model => model.dog, 'yyy')
				.isFloat(model => model.tiger, 'zzz')
				.isFloat(model => model.lion, 'kkk')
				.getErrors()

			expect(errors).toEqual([])
		})
	})
})
