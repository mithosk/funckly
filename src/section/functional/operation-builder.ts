import { IOperate } from './operate'

export class OperationBuilder<A, B> {
	constructor(private readonly operate: IOperate<A, B>) {}

	public combine<C>(primitiveOperate: IOperate<B, C>): OperationBuilder<A, C> {
		const complexOperate = (a: A) => primitiveOperate(this.operate(a))

		return new OperationBuilder(complexOperate)
	}

	public getOperation(): IOperate<A, B> {
		return this.operate
	}
}
