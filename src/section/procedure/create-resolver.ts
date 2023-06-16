import { IResolver } from './resolver'

export interface ICreateResolver<D extends object, R extends object> {
	(): IResolver<D, R>
}
