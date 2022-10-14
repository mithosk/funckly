export interface IValue<B extends object, V> {
	(body: B): V
}
