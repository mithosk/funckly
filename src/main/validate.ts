import { Validator } from '../crud/validator'

export interface IValidate<M> {
	(model: M): Validator<M>
}
