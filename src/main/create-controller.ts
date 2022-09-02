import { IController } from '../crud/controller'

export interface ICreateController<M extends object, F extends object> {
	(): IController<M, F>
}
