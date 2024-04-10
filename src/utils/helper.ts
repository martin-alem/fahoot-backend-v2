import { HttpException } from '@nestjs/common';
import Result from './result';
import {Response} from "express"

export function handleResult<T>(result: Result<T | null>): T {
  if (!result.isSuccess() || result.getData() === null) {
    const errorMsg = result.getError() ?? 'An unknown error occurred';
    const errorCode = result.getErrorCode() ?? 500;
    throw new HttpException(errorMsg, errorCode);
  }
  // At this point, TypeScript cannot deduce that result.getData() is not null,
  // so we use a type assertion to tell it that result.getData() is of type T.
  return result.getData() as T;
}

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);


export function setCookie(response: Response, name: string, value: string, ttl: number, options: { [key: string]: string } = {}): void {
  const defaultOptions = {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production',
    maxAge: ttl,
  };

  response.cookie(name, value, { ...defaultOptions, ...options });
}

export function clearCookie(response: Response, options: { [key: string]: string } = {}, ...names: string[]): void {
  const defaultOptions = {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production',
    maxAge: 0,
  };

  for (const name of names) {
    response.cookie(name, '', { ...defaultOptions, ...options });
  }
}