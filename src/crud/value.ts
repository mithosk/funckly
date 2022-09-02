export interface IValue<M extends object, V> {
	(model: M): V
}
