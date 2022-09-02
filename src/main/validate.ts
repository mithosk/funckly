import { Validator } from '../crud/validator'

export interface IValidate<M extends object> {
	(model: M): Validator<M>
}
