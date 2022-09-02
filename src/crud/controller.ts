import { IPage } from './page'

export interface IController<M extends object, F extends object> {
	create(model: M, identifiers: { [name: string]: string }): Promise<M>
	read(identifiers: { [name: string]: string }): Promise<M>
	update(identifiers: { [name: string]: string }, model: M): Promise<M>
	delete(identifiers: { [name: string]: string }): Promise<void>
	list(
		identifiers: { [name: string]: string },
		filter: F,
		sortType: string,
		pageIndex: number,
		pageSize: number
	): Promise<IPage<M>>
}
