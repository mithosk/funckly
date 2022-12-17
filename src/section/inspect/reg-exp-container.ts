export class RegExpContainer {
	public uuid(text: string): boolean {
		return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)
	}

	public date(text: string): boolean {
		return /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i.test(text)
	}

	public email(text: string): boolean {
		return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i.test(text)
	}

	public ncode(text: string): boolean {
		return /^[0-9]*$/i.test(text)
	}
}
