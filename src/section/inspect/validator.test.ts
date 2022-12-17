import { Validator } from './validator'

describe('Validator', () => {
	describe('notEmpty', () => {
		it('recognizes null and undefined as empty', () => {
			const body = {
				cat: null,
				dog: undefined
			}

			const errors = new Validator(body)
				.notEmpty(body => body.cat, 'xxx')
				.notEmpty(body => body.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('finds no errors', () => {
			const body = {
				cat: 'AbcDefGhi',
				dog: 1.23,
				tiger: [],
				lion: {}
			}

			const errors = new Validator(body)
				.notEmpty(body => body.cat, 'xxx')
				.notEmpty(body => body.dog, 'yyy')
				.notEmpty(body => body.tiger, 'zzz')
				.notEmpty(body => body.lion, 'kkk')
				.getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('isString', () => {
		it('recognizes numbers as not strings', () => {
			const body = {
				cat: 145,
				dog: 1.23
			}

			const errors = new Validator(body)
				.isString(body => body.cat, 'xxx')
				.isString(body => body.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('recognizes an array as not string', () => {
			const body = {
				cat: []
			}

			const errors = new Validator(body).isString(body => body.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('recognizes an object as not string', () => {
			const body = {
				cat: {}
			}

			const errors = new Validator(body).isString(body => body.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors', () => {
			const body = {
				cat: 'ABCdefGHI',
				dog: '234',
				tiger: null,
				lion: undefined
			}

			const errors = new Validator(body)
				.isString(body => body.cat, 'xxx')
				.isString(body => body.dog, 'yyy')
				.isString(body => body.tiger, 'zzz')
				.isString(body => body.lion, 'kkk')
				.getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('mustLength', () => {
		it('ignores data if not strings', () => {
			const body = {
				cat: 145,
				dog: 1.23,
				tiger: [],
				lion: {}
			}

			const errors = new Validator(body)
				.mustLength(body => body.cat, 10, 14, 'xxx')
				.mustLength(body => body.dog, 10, 14, 'yyy')
				.mustLength(body => body.tiger, 10, 14, 'zzz')
				.mustLength(body => body.lion, 10, 14, 'kkk')
				.getErrors()

			expect(errors).toEqual([])
		})

		it('recognizes a string as too short', () => {
			const body = {
				cat: 'aaa'
			}

			const errors = new Validator(body).mustLength(body => body.cat, 4, 5, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('recognizes a string as too long', () => {
			const body = {
				cat: 'aaa'
			}

			const errors = new Validator(body).mustLength(body => body.cat, 1, 2, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors with a correct string', () => {
			const body = {
				cat: 'aaa'
			}

			const errors = new Validator(body).mustLength(body => body.cat, 0, 4, 'xxx').getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('isUuid', () => {
		it('recognizes numbers as not uuid', () => {
			const body = {
				cat: 145,
				dog: 1.23
			}

			const errors = new Validator(body)
				.isUuid(body => body.cat, 'xxx')
				.isUuid(body => body.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('recognizes a generic string as not uuid', () => {
			const body = {
				cat: 'aaa'
			}

			const errors = new Validator(body).isUuid(body => body.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors', () => {
			const body = {
				cat: '9fccd79b-be40-4bfb-b0f6-06b21810c8eb',
				dog: null,
				tiger: undefined
			}

			const errors = new Validator(body)
				.isUuid(body => body.cat, 'xxx')
				.isUuid(body => body.dog, 'yyy')
				.isUuid(body => body.tiger, 'zzz')
				.getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('isDate', () => {
		it('recognizes numbers as not date', () => {
			const body = {
				cat: 145,
				dog: 1.23
			}

			const errors = new Validator(body)
				.isDate(body => body.cat, 'xxx')
				.isDate(body => body.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('recognizes a generic string as not date', () => {
			const body = {
				cat: 'aaa'
			}

			const errors = new Validator(body).isDate(body => body.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors', () => {
			const body = {
				cat: '2022-10-07T12:57:59',
				dog: null,
				tiger: undefined
			}

			const errors = new Validator(body)
				.isDate(body => body.cat, 'xxx')
				.isDate(body => body.dog, 'yyy')
				.isDate(body => body.tiger, 'zzz')
				.getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('isEmail', () => {
		it('recognizes numbers as not email', () => {
			const body = {
				cat: 145,
				dog: 1.23
			}

			const errors = new Validator(body)
				.isEmail(body => body.cat, 'xxx')
				.isEmail(body => body.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('recognizes a generic string as not email', () => {
			const body = {
				cat: 'aaa'
			}

			const errors = new Validator(body).isEmail(body => body.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors', () => {
			const body = {
				cat: 'peter.parker@en.spider.net',
				dog: null,
				tiger: undefined
			}

			const errors = new Validator(body)
				.isEmail(body => body.cat, 'xxx')
				.isEmail(body => body.dog, 'yyy')
				.isEmail(body => body.tiger, 'zzz')
				.getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('isEnum', () => {
		it('recognizes numbers as not enum', () => {
			const body = {
				cat: 145,
				dog: 1.23
			}

			const errors = new Validator(body)
				.isEnum(body => body.cat, [], 'xxx')
				.isEnum(body => body.dog, [], 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('recognizes a generic string as not enum', () => {
			const body = {
				cat: 'aaa'
			}

			const errors = new Validator(body).isEnum(body => body.cat, [], 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors', () => {
			const body = {
				cat: 'ONE',
				dog: 'TWO',
				tiger: null,
				lion: undefined
			}

			const members = ['ONE', 'TWO']

			const errors = new Validator(body)
				.isEnum(body => body.cat, members, 'xxx')
				.isEnum(body => body.dog, members, 'yyy')
				.isEnum(body => body.tiger, members, 'zzz')
				.isEnum(body => body.lion, members, 'kkk')
				.getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('isInt', () => {
		it('recognizes strings as not int', () => {
			const body = {
				cat: 'aaa',
				dog: '145'
			}

			const errors = new Validator(body)
				.isInt(body => body.cat, 'xxx')
				.isInt(body => body.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('recognizes a number with dot as not int', () => {
			const body = {
				cat: 1.23
			}

			const errors = new Validator(body).isInt(body => body.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('recognizes an array as not int', () => {
			const body = {
				cat: []
			}

			const errors = new Validator(body).isInt(body => body.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('recognizes an object as not int', () => {
			const body = {
				cat: {}
			}

			const errors = new Validator(body).isInt(body => body.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors', () => {
			const body = {
				cat: 145,
				dog: 213.0,
				tiger: null,
				lion: undefined
			}

			const errors = new Validator(body)
				.isInt(body => body.cat, 'xxx')
				.isInt(body => body.dog, 'yyy')
				.isInt(body => body.tiger, 'zzz')
				.isInt(body => body.lion, 'kkk')
				.getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('isFloat', () => {
		it('recognizes strings as not float', () => {
			const body = {
				cat: 'aaa',
				dog: '1.23'
			}

			const errors = new Validator(body)
				.isFloat(body => body.cat, 'xxx')
				.isFloat(body => body.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('recognizes an array as not float', () => {
			const body = {
				cat: []
			}

			const errors = new Validator(body).isFloat(body => body.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('recognizes an object as not float', () => {
			const body = {
				cat: {}
			}

			const errors = new Validator(body).isFloat(body => body.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors', () => {
			const body = {
				cat: 1.23,
				dog: 145,
				tiger: null,
				lion: undefined
			}

			const errors = new Validator(body)
				.isFloat(body => body.cat, 'xxx')
				.isFloat(body => body.dog, 'yyy')
				.isFloat(body => body.tiger, 'zzz')
				.isFloat(body => body.lion, 'kkk')
				.getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('mustRange', () => {
		it('ignores data if not numbers', () => {
			const body = {
				cat: 'aaa',
				dog: [],
				tiger: {}
			}

			const errors = new Validator(body)
				.mustRange(body => body.cat, 10, 14, 'xxx')
				.mustRange(body => body.dog, 10, 14, 'yyy')
				.mustRange(body => body.tiger, 10, 14, 'zzz')
				.getErrors()

			expect(errors).toEqual([])
		})

		it('recognizes a number as too small', () => {
			const body = {
				cat: 15
			}

			const errors = new Validator(body).mustRange(body => body.cat, 16, 17, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('recognizes a number as too big', () => {
			const body = {
				cat: 15
			}

			const errors = new Validator(body).mustRange(body => body.cat, 13, 14, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors with a correct number', () => {
			const body = {
				cat: 15
			}

			const errors = new Validator(body).mustRange(body => body.cat, 15, 15, 'xxx').getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('isBoolean', () => {
		it('recognizes strings as not boolean', () => {
			const body = {
				cat: 'true',
				dog: 'false'
			}

			const errors = new Validator(body)
				.isBoolean(body => body.cat, 'xxx')
				.isBoolean(body => body.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('recognizes numbers as not boolean', () => {
			const body = {
				cat: 12,
				dog: 54.7
			}

			const errors = new Validator(body)
				.isBoolean(body => body.cat, 'xxx')
				.isBoolean(body => body.dog, 'yyy')
				.getErrors()

			expect(errors).toEqual(['xxx', 'yyy'])
		})

		it('recognizes an array as not boolean', () => {
			const body = {
				cat: []
			}

			const errors = new Validator(body).isBoolean(body => body.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('recognizes an object as not boolean', () => {
			const body = {
				cat: {}
			}

			const errors = new Validator(body).isBoolean(body => body.cat, 'xxx').getErrors()

			expect(errors).toEqual(['xxx'])
		})

		it('finds no errors', () => {
			const body = {
				cat: true,
				dog: false,
				tiger: null,
				lion: undefined
			}

			const errors = new Validator(body)
				.isBoolean(body => body.cat, 'xxx')
				.isBoolean(body => body.dog, 'yyy')
				.isBoolean(body => body.tiger, 'zzz')
				.isBoolean(body => body.lion, 'kkk')
				.getErrors()

			expect(errors).toEqual([])
		})
	})

	describe('isArray', () => {
		it('recognizes a string as not array', () => {
			const body = {
				cat: 'aaa'
			}

			const validator = new Validator(body)
			const array = validator.isArray(body => body.cat, 'xxx')
			const errors = validator.getErrors()

			expect(array).toBe(false)
			expect(errors).toEqual(['xxx'])
		})

		it('recognizes a number as not array', () => {
			const body = {
				cat: 4.7
			}

			const validator = new Validator(body)
			const array = validator.isArray(body => body.cat, 'xxx')
			const errors = validator.getErrors()

			expect(array).toBe(false)
			expect(errors).toEqual(['xxx'])
		})

		it('recognizes an object as not array', () => {
			const body = {
				cat: {}
			}

			const validator = new Validator(body)
			const array = validator.isArray(body => body.cat, 'xxx')
			const errors = validator.getErrors()

			expect(array).toBe(false)
			expect(errors).toEqual(['xxx'])
		})

		it('skips error check because the field is null', () => {
			const body = {
				cat: null
			}

			const validator = new Validator(body)
			const array = validator.isArray(body => body.cat, 'xxx')
			const errors = validator.getErrors()

			expect(array).toBe(false)
			expect(errors).toEqual([])
		})

		it('skips error check because the field is undefined', () => {
			const body = {
				cat: undefined
			}

			const validator = new Validator(body)
			const array = validator.isArray(body => body.cat, 'xxx')
			const errors = validator.getErrors()

			expect(array).toBe(false)
			expect(errors).toEqual([])
		})

		it('finds no errors', () => {
			const body = {
				cat: ['one', 'two', 'three']
			}

			const validator = new Validator(body)
			const array = validator.isArray(body => body.cat, 'xxx')
			const errors = validator.getErrors()

			expect(array).toBe(true)
			expect(errors).toEqual([])
		})
	})
})
