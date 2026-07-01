import { Injectable } from '@nestjs/common';

import axios from 'axios';

import { HttpAdapter } from '../interfaces/http-adapter.interface';

/**
 * Adapter for making HTTP requests using axios.
 * This is just an example for learning purposes on how to create adapters.
 *
 * For real use cases, the implementations need to be more robust, and in any
 * case, it would be much more advisable to use NestJS's native HttpService. See: https://docs.nestjs.com/techniques/http-module
 */
@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private readonly axios = axios;

  async get<T>(url: string): Promise<T> {
    const { data } = await this.axios.get<T>(url);
    return data;
  }
}
