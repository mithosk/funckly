import { IValue } from './value'

export interface IValidator<M extends object> {
	notEmpty<V>(value: IValue<M, V>, message: string): IValidator<M>
	isString<V>(value: IValue<M, V>, message: string): IValidator<M>
	isUuid<V>(value: IValue<M, V>, message: string): IValidator<M>
	isInt<V>(value: IValue<M, V>, message: string): IValidator<M>
	isFloat<V>(value: IValue<M, V>, message: string): IValidator<M>
	getErrors(): string[]
}

export class Validator<M extends object> implements IValidator<M> {
	private readonly errors: string[] = []

	constructor(private readonly model: M) {}

	public notEmpty<V>(value: IValue<M, V>, message: string): IValidator<M> {
		const v = value(this.model)

		if (v === null || v === undefined) this.errors.push(message)

		return this
	}

	public isString<V>(value: IValue<M, V>, message: string): IValidator<M> {
		const v = value(this.model)

		if (v !== null && v !== undefined) if (typeof v !== 'string') this.errors.push(message)

		return this
	}

	public isUuid<V>(value: IValue<M, V>, message: string): IValidator<M> {
		const v = value(this.model)

		if (v !== null && v !== undefined) {
			const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
			if (typeof v !== 'string' || !regex.test(v)) this.errors.push(message)
		}

		return this
	}

	public isInt<V>(value: IValue<M, V>, message: string): IValidator<M> {
		const v = value(this.model)

		if (v !== null && v !== undefined) if (typeof v !== 'number' || !Number.isInteger(v)) this.errors.push(message)

		return this
	}

	public isFloat<V>(value: IValue<M, V>, message: string): IValidator<M> {
		const v = value(this.model)

		if (v !== null && v !== undefined) if (typeof v !== 'number') this.errors.push(message)

		return this
	}

	public getErrors(): string[] {
		return this.errors
	}
}
