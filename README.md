# expest

A NestJS-like controller framework for Express.

## Installation

To install the dependencies, run:

```bash
yarn install
```

## Usage

Here is an example of how to use the framework:

```typescript
import express from 'express'
import { Controller, Get, Post, Body, Param, Query, registerControllers } from 'expest'
import 'reflect-metadata'
import { IsString, IsOptional } from 'class-validator'

class PostBody {
  @IsString()
  foo: string
}

class QueryParams {
  @IsString()
  foo: string

  @IsOptional()
  @IsString()
  bar?: string
}

@Controller('test')
class TestController {
  @Get('get-test')
  getTest(): object {
    return { foo: 'bar' }
  }

  @Post('post-body-echo')
  postTest(@Body() body: PostBody): object {
    return body
  }

  @Get('test-params/:id')
  getParams(@Param('id') id: string): object {
    return { id }
  }

  @Get('test-query')
  getQuery(@Query() params: QueryParams): object {
    return params
  }
}

const app = express()
registerControllers(app, [TestController])
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
```

## Testing

To run the tests, use:

```bash
yarn test
```

## License

This project is licensed under the MIT License.
