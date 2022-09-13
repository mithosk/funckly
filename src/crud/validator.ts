import { IValue } from './value'

export interface IValidator<M extends object> {
	notEmpty<V>(value: IValue<M, V>, message: string): IValidator<M>
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

	public getErrors(): string[] {
		return this.errors
	}
}
