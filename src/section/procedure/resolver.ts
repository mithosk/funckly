import { IExecuteInput } from './execute-input'

export interface IResolver<D extends object, R extends object> {
	execute(input: IExecuteInput<D>): Promise<R>
}
