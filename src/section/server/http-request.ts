export class HttpRequest {
	constructor(
		private readonly identifiers: { [name: string]: string },
		private readonly filter: string,
		private readonly headers: { [name: string]: string },
		private readonly body: string
	) {}

	public getIdentifiers(): { [name: string]: string } {
		return this.identifiers
	}

	public getFilter(): string {
		return this.filter
	}

	public getHeader(name: string): string {
		return this.headers[name]
	}

	public getBody(): string {
		return this.body
	}
}
