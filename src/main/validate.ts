import { IValidator } from '../crud/validator'

export interface IValidate<M extends object> {
	(model: M): IValidator<M>
}
