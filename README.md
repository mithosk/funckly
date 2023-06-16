### ... how to create a funckly APPLICATION ...
```ts
const server = new VanillaServer(5001)
const application = new Application(server)
```



### ... how to create a funckly CONTROLLER ...
```ts
interface MyModel {
    cat: string
    dog?: number | null
    tiger: string
}

interface MyFilter {
    lion?: boolean
    crocodile?: number
}

class MyController implements IController<MyModel, MyFilter> {

    public async create(input: ICreateInput<MyModel>): Promise<MyModel> { 
        // my code
    }

    public async read(input: IReadInput): Promise<MyModel> { 
        // my code
    }

    public async update(input: IUpdateInput<MyModel>): Promise<MyModel> { 
        // my code
    }

    public async delete(input: IDeleteInput): Promise<void> { 
        // my code
    }

    public async list(input: IListInput<MyFilter>): Promise<IPage<MyModel>> { 
        // my code    
    }
    
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
            .isString(model => model.cat, 'cat is not string')
            .isFloat(model => model.dog, 'dog is not float')
            .notEmpty(model => model.tiger, 'empty tiger')
            .isUuid(model => model.tiger, 'tiger is not UUID')
    )
    .setNormalization(normalizer =>
        normalizer
            .asBoolean('lion')
            .asInt('crocodile')
    )
```



### ... how to create a funckly RPC UNIT ...
```ts
interface MyData {
    cat: string
    dog?: number | null
    tiger: string
}

interface MyResult {
    lion?: boolean
    crocodile?: number
}

class MyResolver implements IResolver<MyData, MyResult> {

    public async execute(input: IExecuteInput<MyData>): Promise<MyResult> {
        // my code
    }
    
}

application.createRpcUnit<MyData, MyResult>('snake')
    .setResolver(() => new MyResolver())
    .setValidation(data =>
        new Validator(data)
            .notEmpty(data => data.cat, 'empty cat')
            .isString(data => data.cat, 'cat is not string')
            .isFloat(data => data.dog, 'dog is not float')
            .notEmpty(data => data.tiger, 'empty tiger')
            .isUuid(data => data.tiger, 'tiger is not UUID')
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

HTTP POST   /snake            (execute)
```