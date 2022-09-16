export interface IServerResponse {
	statusCode: number
	setHeader(name: string, value: string): void
	write(body: string): void
}
