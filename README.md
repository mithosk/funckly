### ... how to create a funckly APPLICATION ...
```ts
const application = new Application(5000)
```



### ... how to create a funckly CONTROLLER ...
```ts
export interface MyModel {
    cat: string
    dog: number
    tiger: string
}

export interface MyFilter {
    lion: boolean
    crocodile: number
}

export class MyController implements IController<MyModel, MyFilter> {
    public async create(
        model: MyModel,
        identifiers: { [name: string]: string }
    ): Promise<MyModel> { }

    public async read(
        identifiers: { [name: string]: string }
    ): Promise<MyModel> { }

    public async update(
        identifiers: { [name: string]: string },
        model: MyModel
    ): Promise<MyModel> { }

    public async delete(
        identifiers: { [name: string]: string }
    ): Promise<void> { }

    public async list(
        identifiers: { [name: string]: string },
        filter: MyFilter,
        sortType: string,
        pageIndex: number,
        pageSize: number
    ): Promise<IPage<MyModel>> { }
}
```



### ... how to create a funckly REST UNIT ...
```ts
application.createRestUnit<MyModel, MyFilter>('horses')
    .setController(() => new MyController())
    .setPrevalidation(PrevalidationFormat.Ncode)
    .setValidation(model =>
        new Validator(model)
            .notEmpty(model => model.cat, 'empty cat')
            .isFloat(model => model.dog, 'dog is not float')
            .isUuid(model => model.tiger, 'tiger is not UUID')
    )
    .setNormalization(normalizer =>
        normalizer
            .asBoolean('lion')
            .asInt('crocodile')
    )
```



### ... available http calls ...
```
HTTP POST   /horses           (create)
HTTP GET    /horses/12345     (read)
HTTP PUT    /horses/12345     (update)
HTTP PATCH  /horses/12345     (read & update)
HTTP DELETE /horses/12345     (delete)
HTTP GET    /horses?lion=true (list)
```
