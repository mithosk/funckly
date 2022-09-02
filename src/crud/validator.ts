import { IValue } from './value'

export class Validator<M extends object> {
	private readonly errors: string[] = []

	constructor(private readonly model: M) {}

	public notEmpty<V>(value: IValue<M, V>, message: string): Validator<M> {
		const v = value(this.model)

		if (v === null || v === undefined) this.errors.push(message)

		return this
	}

	public getErrors(): string[] {
		return this.errors
	}
}
