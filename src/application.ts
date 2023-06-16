import { RpcUnit } from './rpc-unit'
import { RestUnit } from './rest-unit'
import { IVanillaServer } from './section/server/vanilla-server'

export class Application {
	constructor(private readonly server: IVanillaServer) {}

	public createRestUnit<M extends object, F extends object>(route: string): RestUnit<M, F> {
		return new RestUnit<M, F>(this.server, route)
	}

	public createRpcUnit<D extends object, R extends object>(route: string): RpcUnit<D, R> {
		return new RpcUnit<D, R>(this.server, route)
	}
}
