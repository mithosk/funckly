export interface IListInput<F extends object> {
	identifiers: { [name: string]: string }
	filter: F
	sortBy: string[]
	pageIndex: number | undefined
	pageSize: number | undefined
	userId: string | undefined
	language: string | undefined
}
