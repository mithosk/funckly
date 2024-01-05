import { IValue } from './value'
import { RegExpContainer } from './reg-exp-container'

export interface IValidator<B extends object> {
	notAllowed<V>(value: IValue<B, V>, message: string): IValidator<B>
	notEmpty<V>(value: IValue<B, V>, message: string): IValidator<B>
	isString<V>(value: IValue<B, V>, message: string): IValidator<B>
	mustLength<V>(value: IValue<B, V>, min: number, max: number, message: string): IValidator<B>
	isUuid<V>(value: IValue<B, V>, message: string): IValidator<B>
	isDate<V>(value: IValue<B, V>, message: string): IValidator<B>
	isEmail<V>(value: IValue<B, V>, message: string): IValidator<B>
	isEnum<V>(value: IValue<B, V>, members: string[], message: string): IValidator<B>
	isInt<V>(value: IValue<B, V>, message: string): IValidator<B>
	isFloat<V>(value: IValue<B, V>, message: string): IValidator<B>
	mustRange<V>(value: IValue<B, V>, min: number, max: number, message: string): IValidator<B>
	isBoolean<V>(value: IValue<B, V>, message: string): IValidator<B>
	isArray<V>(value: IValue<B, V>, message: string): boolean
	getErrors(): string[]
}

export class Validator<B extends object> implements IValidator<B> {
	private readonly errors: string[] = []
	private readonly rec = new RegExpContainer()

	constructor(private readonly body: B) {}

	public notAllowed<V>(value: IValue<B, V>, message: string): IValidator<B> {
		const v = value(this.body)

		if (v !== undefined) this.errors.push(message)

		return this
	}

	public notEmpty<V>(value: IValue<B, V>, message: string): IValidator<B> {
		const v = value(this.body)

		if (v === null || v === undefined) this.errors.push(message)

		return this
	}

	public isString<V>(value: IValue<B, V>, message: string): IValidator<B> {
		const v = value(this.body)

		if (v !== null && v !== undefined) if (typeof v !== 'string') this.errors.push(message)

		return this
	}

	public mustLength<V>(value: IValue<B, V>, min: number, max: number, message: string): IValidator<B> {
		const v = value(this.body)

		if (v !== null && v !== undefined && typeof v === 'string')
			if (v.length < min || v.length > max) this.errors.push(message)

		return this
	}

	public isUuid<V>(value: IValue<B, V>, message: string): IValidator<B> {
		const v = value(this.body)

		if (v !== null && v !== undefined)
			if (typeof v !== 'string' || !this.rec.uuid(v)) this.errors.push(message)

		return this
	}

	public isDate<V>(value: IValue<B, V>, message: string): IValidator<B> {
		const v = value(this.body)

		if (v !== null && v !== undefined)
			if (typeof v !== 'string' || !this.rec.date(v)) this.errors.push(message)

		return this
	}

	public isEmail<V>(value: IValue<B, V>, message: string): IValidator<B> {
		const v = value(this.body)

		if (v !== null && v !== undefined)
			if (typeof v !== 'string' || !this.rec.email(v)) this.errors.push(message)

		return this
	}

	public isEnum<V>(value: IValue<B, V>, members: string[], message: string): IValidator<B> {
		const v = value(this.body)

		if (v !== null && v !== undefined)
			if (typeof v !== 'string' || members.indexOf(v) < 0) this.errors.push(message)

		return this
	}

	public isInt<V>(value: IValue<B, V>, message: string): IValidator<B> {
		const v = value(this.body)

		if (v !== null && v !== undefined)
			if (typeof v !== 'number' || !Number.isInteger(v)) this.errors.push(message)

		return this
	}

	public isFloat<V>(value: IValue<B, V>, message: string): IValidator<B> {
		const v = value(this.body)

		if (v !== null && v !== undefined) if (typeof v !== 'number') this.errors.push(message)

		return this
	}

	public mustRange<V>(value: IValue<B, V>, min: number, max: number, message: string): IValidator<B> {
		const v = value(this.body)

		if (v !== null && v !== undefined && typeof v === 'number')
			if (v < min || v > max) this.errors.push(message)

		return this
	}

	public isBoolean<V>(value: IValue<B, V>, message: string): IValidator<B> {
		const v = value(this.body)

		if (v !== null && v !== undefined) if (typeof v !== 'boolean') this.errors.push(message)

		return this
	}

	public isArray<V>(value: IValue<B, V>, message: string): boolean {
		const v = value(this.body)

		const check = Array.isArray(v)

		if (v !== null && v !== undefined && !check) this.errors.push(message)

		return check
	}

	public getErrors(): string[] {
		return this.errors.filter((error, index) => this.errors.indexOf(error) === index)
	}
}
