import { IController } from '../crud/controller'

export interface ICreateController<M, F> {
	(): IController<M, F>
}
