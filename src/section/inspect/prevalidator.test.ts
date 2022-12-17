import { Prevalidator } from './prevalidator'
import { PrevalidationFormat } from './prevalidation-format'

describe('Prevalidator', () => {
	describe('validate', () => {
		it('recognizes generic strings as not uuid', () => {
			const identifiers = {
				xxxxx: 'aaaaa',
				yyyyy: 'bbbbb'
			}

			const errors = new Prevalidator(PrevalidationFormat.Uuid).validate(identifiers)

			expect(errors).toEqual(['xxxxx', 'yyyyy'])
		})

		it('recognizes generic strings as not ncode', () => {
			const identifiers = {
				xxxxx: 'aaaaa',
				yyyyy: 'bbbbb',
				zzzzz: 'X123'
			}

			const errors = new Prevalidator(PrevalidationFormat.Ncode).validate(identifiers)

			expect(errors).toEqual(['xxxxx', 'yyyyy', 'zzzzz'])
		})

		it('recognizes an uuid as correct', () => {
			const identifiers = {
				xxxxx: '0a6b586e-d79c-4664-b4e0-f0daeeab0653'
			}

			const errors = new Prevalidator(PrevalidationFormat.Uuid).validate(identifiers)

			expect(errors).toEqual([])
		})

		it('recognizes a ncode as correct', () => {
			const identifiers = {
				xxxxx: '0000012345'
			}

			const errors = new Prevalidator(PrevalidationFormat.Ncode).validate(identifiers)

			expect(errors).toEqual([])
		})
	})
})
