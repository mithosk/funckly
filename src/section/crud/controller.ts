import { IPage } from './page'
import { IReadInput } from './read-input'
import { IListInput } from './list-input'
import { IUpdateInput } from './update-input'
import { ICreateInput } from './create-input'
import { IDeleteInput } from './delete-input'

export interface IController<M extends object, F extends object> {
	create(input: ICreateInput<M>): Promise<M>
	read(input: IReadInput): Promise<M>
	update(input: IUpdateInput<M>): Promise<M>
	delete(input: IDeleteInput): Promise<void>
	list(input: IListInput<F>): Promise<IPage<M>>
}
