export interface IPage<M> {
	models: M[]
	sortType: string
	pageCount: number
	itemCount: number
}
