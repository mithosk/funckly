import { RegExpContainer } from './reg-exp-container'

export class Normalizer<F extends object> {
	private readonly rec = new RegExpContainer()

	constructor(private readonly filter: F) {}

	public asString(key: keyof F): Normalizer<F> {
		if (typeof this.filter[key] !== 'string') this.filter[key] = undefined as F[keyof F]

		return this
	}

	public asUuid(key: keyof F): Normalizer<F> {
		if (typeof this.filter[key] !== 'string' || !this.rec.uuid(this.filter[key] as string))
			this.filter[key] = undefined as F[keyof F]

		return this
	}

	public asDate(key: keyof F): Normalizer<F> {
		if (typeof this.filter[key] !== 'string' || !this.rec.date(this.filter[key] as string))
			this.filter[key] = undefined as F[keyof F]

		return this
	}

	public asEnum(key: keyof F, members: string[]): Normalizer<F> {
		if (typeof this.filter[key] !== 'string' || members.indexOf(this.filter[key] as string) < 0)
			this.filter[key] = undefined as F[keyof F]

		return this
	}

	public asInt(key: keyof F): Normalizer<F> {
		const value = Number.parseInt(this.filter[key] as string)
		this.filter[key] = (isNaN(value) ? undefined : value) as F[keyof F]

		return this
	}

	public asFloat(key: keyof F): Normalizer<F> {
		const value = Number.parseFloat(this.filter[key] as string)
		this.filter[key] = (isNaN(value) ? undefined : value) as F[keyof F]

		return this
	}

	public asBoolean(key: keyof F): Normalizer<F> {
		this.filter[key] = (
			this.filter[key] === 'true' ? true : this.filter[key] === 'false' ? false : undefined
		) as F[keyof F]

		return this
	}

	public asStringArray(key: keyof F): Normalizer<F> {
		this.toStringArray(key)

		return this
	}

	public asUuidArray(key: keyof F): Normalizer<F> {
		const array = this.toStringArray(key)
		const clone = array?.map(item => item)

		for (const item of clone ?? []) if (!this.rec.uuid(item)) array.splice(array.indexOf(item), 1)

		return this
	}

	public asDateArray(key: keyof F): Normalizer<F> {
		const array = this.toStringArray(key)
		const clone = array?.map(item => item)

		for (const item of clone ?? []) if (!this.rec.date(item)) array.splice(array.indexOf(item), 1)

		return this
	}

	public asEnumArray(key: keyof F, members: string[]): Normalizer<F> {
		const array = this.toStringArray(key)
		const clone = array?.map(item => item)

		for (const item of clone ?? []) if (members.indexOf(item) < 0) array.splice(array.indexOf(item), 1)

		return this
	}

	public asIntArray(key: keyof F): Normalizer<F> {
		const array = this.toStringArray(key)
		const clone = array?.map(item => item)

		for (const item of clone ?? []) {
			const value = Number.parseInt(item)

			array.splice(array.indexOf(item), 1)
			if (!isNaN(value)) array.push(value as never)
		}

		return this
	}

	public asFloatArray(key: keyof F): Normalizer<F> {
		const array = this.toStringArray(key)
		const clone = array?.map(item => item)

		for (const item of clone ?? []) {
			const value = Number.parseFloat(item)

			array.splice(array.indexOf(item), 1)
			if (!isNaN(value)) array.push(value as never)
		}

		return this
	}

	private toStringArray(key: keyof F): string[] {
		if (this.filter[key] !== undefined && !Array.isArray(this.filter[key]))
			this.filter[key] = [this.filter[key]] as F[keyof F]

		return this.filter[key] as string[]
	}
}
