import { beforeAll, describe, test } from 'vitest'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  registerControllers,
} from '../lib'
import express, { Express } from 'express'
import request from 'supertest'
import 'reflect-metadata'
import { IsOptional, IsString } from 'class-validator'

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
    return {
      foo: 'bar',
    }
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

describe('Controller test', () => {
  let app: Express

  beforeAll(() => {
    app = express()
    registerControllers(app, [TestController])
  })

  test('Get test', () => {
    return request(app).get('/test/get-test').expect(200).expect({ foo: 'bar' })
  })

  test('Post test', () => {
    return request(app)
      .post('/test/post-body-echo')
      .send({ foo: 'bar' })
      .expect(200)
      .expect({ foo: 'bar' })
  })

  test('Post test without required param', () => {
    return request(app).post('/test/post-body-echo').expect(400)
  })

  test('Params test', () => {
    return request(app).get('/test/test-params/123').expect(200).expect({
      id: '123',
    })
  })

  test('Query test', () => {
    return request(app).get('/test/test-query?foo=bar').expect(200).expect({
      foo: 'bar',
    })
  })

  test('Query test without required param', () => {
    return request(app).get('/test/test-query').expect(400)
  })
})
