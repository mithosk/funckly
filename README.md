### ... how to create a funckly APPLICATION ...
```ts
const application = new Application(5000)
```



### ... how to create a funckly CONTROLLER ...
```ts
export class MyModel {
    cat: string | undefined
    dog: number | undefined
    tiger: string | undefined
}

export class MyFilter {
    lion: string | undefined
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
application.createRestUnit<MyModel, MyFilter>('crocodiles')
    .setController(() => new MyController())
    .setValidation(model =>
        new Validator(model)
            .notEmpty(model => model.cat, 'empty cat')
            .isInt(model => model.dog, 'dog is not integer')
            .isUuid(model => model.tiger, 'tiger is not UUID')
    )
    .setNormalization(filter =>
        filter.lion = filter.lion?.toLowerCase()
    )
```



### ... available http calls ...
```
HTTP POST   /crocodiles          (create)
HTTP GET    /crocodiles/12345    (read)
HTTP PUT    /crocodiles/12345    (update)
HTTP PATCH  /crocodiles/12345    (read & update)
HTTP DELETE /crocodiles/12345    (delete)
HTTP GET    /crocodiles?lion=xxx (list)
```
