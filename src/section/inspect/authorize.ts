import { OperationType } from './operation-type'

export interface IAuthorize {
	(authorization: string | undefined, operationType: OperationType): string | undefined
}
