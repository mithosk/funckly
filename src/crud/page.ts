export interface IPage<M extends object> {
	models: M[]
	pageCount: number
	itemCount: number
}
