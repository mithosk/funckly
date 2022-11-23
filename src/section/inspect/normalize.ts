import { Normalizer } from './normalizer'

export interface INormalize<F extends object> {
	(normalizer: Normalizer<F>): void
}
