export interface IUpdateInput<M extends object> {
	identifiers: { [name: string]: string }
	userId: string | undefined
	model: M
}
