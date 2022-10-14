import { IValidator } from './validator'

export interface IValidate<B extends object> {
	(body: B): IValidator<B>
}
