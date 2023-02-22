export interface IListInput<F extends object> {
	identifiers: { [name: string]: string }
	filter: F
	sortType: string[]
	pageIndex: number | undefined
	pageSize: number | undefined
	userId: string | undefined
}
