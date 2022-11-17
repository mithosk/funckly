import { Normalizer } from './normalizer'

describe('Normalizer', () => {
	describe('asString', () => {
		it('converts an array to undefined', () => {
			const filter = {
				cat: []
			}

			new Normalizer(filter).asString('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('does not modify an undefined', () => {
			const filter = {
				cat: undefined
			}

			new Normalizer(filter).asString('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('does not modify a string', () => {
			const filter = {
				cat: 'xxxxx'
			}

			new Normalizer(filter).asString('cat')

			expect(filter.cat).toBe('xxxxx')
		})
	})

	describe('asUuid', () => {
		it('converts an array to undefined', () => {
			const filter = {
				cat: []
			}

			new Normalizer(filter).asUuid('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('does not modify an undefined', () => {
			const filter = {
				cat: undefined
			}

			new Normalizer(filter).asUuid('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('converts a generic string to undefined', () => {
			const filter = {
				cat: 'xxxxx'
			}

			new Normalizer(filter).asUuid('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('does not modify an uuid', () => {
			const uuid = 'b1d72dd2-6990-45c6-87c2-5ceba7b1c827'

			const filter = {
				cat: uuid
			}

			new Normalizer(filter).asUuid('cat')

			expect(filter.cat).toBe(uuid)
		})
	})

	describe('asDate', () => {
		it('converts an array to undefined', () => {
			const filter = {
				cat: []
			}

			new Normalizer(filter).asDate('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('does not modify an undefined', () => {
			const filter = {
				cat: undefined
			}

			new Normalizer(filter).asDate('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('converts a generic string to undefined', () => {
			const filter = {
				cat: 'xxxxx'
			}

			new Normalizer(filter).asDate('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('does not modify a date', () => {
			const date = '1985-09-19T12:30:27'

			const filter = {
				cat: date
			}

			new Normalizer(filter).asDate('cat')

			expect(filter.cat).toBe(date)
		})
	})

	describe('asEnum', () => {
		it('converts an array to undefined', () => {
			const filter = {
				cat: []
			}

			new Normalizer(filter).asEnum('cat', ['aaa', 'bbb'])

			expect(filter.cat).toBeUndefined()
		})

		it('does not modify an undefined', () => {
			const filter = {
				cat: undefined
			}

			new Normalizer(filter).asEnum('cat', ['aaa', 'bbb'])

			expect(filter.cat).toBeUndefined()
		})

		it('converts a generic string to undefined', () => {
			const filter = {
				cat: 'xxxxx'
			}

			new Normalizer(filter).asEnum('cat', ['aaa', 'bbb'])

			expect(filter.cat).toBeUndefined()
		})

		it('does not modify a member string', () => {
			const filter = {
				cat: 'bbb'
			}

			new Normalizer(filter).asEnum('cat', ['aaa', 'bbb'])

			expect(filter.cat).toBe('bbb')
		})
	})

	describe('asInt', () => {
		it('converts an array to undefined', () => {
			const filter = {
				cat: []
			}

			new Normalizer(filter).asInt('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('does not modify an undefined', () => {
			const filter = {
				cat: undefined
			}

			new Normalizer(filter).asInt('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('converts a generic string to undefined', () => {
			const filter = {
				cat: 'xxxxx'
			}

			new Normalizer(filter).asInt('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('converts number strings to int', () => {
			const filter = {
				cat: '10',
				dog: '14.12'
			}

			new Normalizer(filter).asInt('cat').asInt('dog')

			expect(filter.cat).toBe(10)
			expect(filter.dog).toBe(14)
		})
	})

	describe('asFloat', () => {
		it('converts an array to undefined', () => {
			const filter = {
				cat: []
			}

			new Normalizer(filter).asFloat('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('does not modify an undefined', () => {
			const filter = {
				cat: undefined
			}

			new Normalizer(filter).asFloat('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('converts a generic string to undefined', () => {
			const filter = {
				cat: 'xxxxx'
			}

			new Normalizer(filter).asFloat('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('converts number strings to float', () => {
			const filter = {
				cat: '10',
				dog: '14.12'
			}

			new Normalizer(filter).asFloat('cat').asFloat('dog')

			expect(filter.cat).toBe(10)
			expect(filter.dog).toBe(14.12)
		})
	})

	describe('asBoolean', () => {
		it('converts an array to undefined', () => {
			const filter = {
				cat: []
			}

			new Normalizer(filter).asBoolean('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('does not modify an undefined', () => {
			const filter = {
				cat: undefined
			}

			new Normalizer(filter).asBoolean('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('converts a generic string to undefined', () => {
			const filter = {
				cat: 'xxxxx'
			}

			new Normalizer(filter).asBoolean('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('converts strings to boolean', () => {
			const filter = {
				cat: 'true',
				dog: 'false'
			}

			new Normalizer(filter).asBoolean('cat').asBoolean('dog')

			expect(filter.cat).toBe(true)
			expect(filter.dog).toBe(false)
		})
	})

	describe('asStringArray', () => {
		it('does not modify an undefined', () => {
			const filter = {
				cat: undefined
			}

			new Normalizer(filter).asStringArray('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('does not modify an array', () => {
			const filter = {
				cat: ['xxxxx', 'yyyyy']
			}

			new Normalizer(filter).asStringArray('cat')

			expect(filter.cat).toEqual(['xxxxx', 'yyyyy'])
		})

		it('converts a generic string to array', () => {
			const filter = {
				cat: '12345'
			}

			new Normalizer(filter).asStringArray('cat')

			expect(filter.cat).toEqual(['12345'])
		})
	})

	describe('asUuidArray', () => {
		it('does not modify an undefined', () => {
			const filter = {
				cat: undefined
			}

			new Normalizer(filter).asUuidArray('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('removes from array generic strings', () => {
			const uuid = '6fbed005-d7ca-4fdd-95ae-1d9680bda3bf'

			const filter = {
				cat: ['xxxxx', uuid, 'yyyyy']
			}

			new Normalizer(filter).asUuidArray('cat')

			expect(filter.cat).toEqual([uuid])
		})

		it('converts a single uuid to array', () => {
			const uuid = '0d95a9d6-1fa3-4b9f-b879-6767db5a30c5'

			const filter = {
				cat: uuid
			}

			new Normalizer(filter).asUuidArray('cat')

			expect(filter.cat).toEqual([uuid])
		})
	})

	describe('asDateArray', () => {
		it('does not modify an undefined', () => {
			const filter = {
				cat: undefined
			}

			new Normalizer(filter).asDateArray('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('removes from array generic strings', () => {
			const date = '2018-12-14T05:25:19.789'

			const filter = {
				cat: ['xxxxx', date, 'yyyyy']
			}

			new Normalizer(filter).asDateArray('cat')

			expect(filter.cat).toEqual([date])
		})

		it('converts a single date to array', () => {
			const date = '2021-12-10T03:30:19.789'

			const filter = {
				cat: date
			}

			new Normalizer(filter).asDateArray('cat')

			expect(filter.cat).toEqual([date])
		})
	})

	describe('asEnumArray', () => {
		it('does not modify an undefined', () => {
			const filter = {
				cat: undefined
			}

			new Normalizer(filter).asEnumArray('cat', ['aaa', 'bbb'])

			expect(filter.cat).toBeUndefined()
		})

		it('removes from array generic strings', () => {
			const filter = {
				cat: ['xxxxx', 'aaa', 'yyyyy']
			}

			new Normalizer(filter).asEnumArray('cat', ['aaa', 'bbb'])

			expect(filter.cat).toEqual(['aaa'])
		})

		it('converts a single member string to array', () => {
			const filter = {
				cat: 'aaa'
			}

			new Normalizer(filter).asEnumArray('cat', ['aaa', 'bbb'])

			expect(filter.cat).toEqual(['aaa'])
		})
	})

	describe('asIntArray', () => {
		it('does not modify an undefined', () => {
			const filter = {
				cat: undefined
			}

			new Normalizer(filter).asIntArray('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('removes from array generic strings', () => {
			const filter = {
				cat: ['xxxxx', '74', 'yyyyy']
			}

			new Normalizer(filter).asIntArray('cat')

			expect(filter.cat).toEqual([74])
		})

		it('converts a single int to array', () => {
			const filter = {
				cat: '37'
			}

			new Normalizer(filter).asIntArray('cat')

			expect(filter.cat).toEqual([37])
		})

		it('converts numbers with dot to int', () => {
			const filter = {
				cat: ['89.1', '89.5', '89.9']
			}

			new Normalizer(filter).asIntArray('cat')

			expect(filter.cat).toEqual([89, 89, 89])
		})
	})

	describe('asFloatArray', () => {
		it('does not modify an undefined', () => {
			const filter = {
				cat: undefined
			}

			new Normalizer(filter).asFloatArray('cat')

			expect(filter.cat).toBeUndefined()
		})

		it('removes from array generic strings', () => {
			const filter = {
				cat: ['xxxxx', '74.8', 'yyyyy', '12']
			}

			new Normalizer(filter).asFloatArray('cat')

			expect(filter.cat).toEqual([74.8, 12])
		})

		it('converts a single float to array', () => {
			const filter = {
				cat: '37.7'
			}

			new Normalizer(filter).asFloatArray('cat')

			expect(filter.cat).toEqual([37.7])
		})
	})
})
