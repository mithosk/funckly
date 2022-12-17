import { RegExpContainer } from './reg-exp-container'
import { PrevalidationFormat } from './prevalidation-format'

export interface IPrevalidator {
	validate(identifiers: { [name: string]: string }): string[]
}

export class Prevalidator implements IPrevalidator {
	private readonly rec = new RegExpContainer()

	constructor(private readonly format: PrevalidationFormat) {}

	public validate(identifiers: { [name: string]: string }): string[] {
		const errorKeys: string[] = []

		for (const key in identifiers) {
			const value = identifiers[key]

			switch (this.format) {
				case PrevalidationFormat.Uuid:
					if (!this.rec.uuid(value)) errorKeys.push(key)

					break

				case PrevalidationFormat.Ncode:
					if (!this.rec.ncode(value)) errorKeys.push(key)

					break
			}
		}

		return errorKeys
	}
}
