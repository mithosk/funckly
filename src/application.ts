import { RestUnit } from './rest-unit'
import { VanillaServer } from './section/server/vanilla-server'

export class Application {
	private readonly server: VanillaServer

	constructor(port: number) {
		this.server = new VanillaServer(port)
	}

	public createRestUnit<M extends object, F extends object>(route: string): RestUnit<M, F> {
		return new RestUnit<M, F>(this.server, route)
	}
}
