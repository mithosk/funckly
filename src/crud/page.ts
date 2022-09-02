export interface IPage<M extends object> {
	models: M[]
	sortType: string
	pageCount: number
	itemCount: number
}
