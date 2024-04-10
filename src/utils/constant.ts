export enum AuthenticationType {
  Email = 'Email',
  Social = 'Social',
}

export const DEFAULT_SIGN_TOKEN_TTL: number = 86400; // in seconds = 24 hours
export const ACCESS_TOKEN_NAME: string = '_access_token';
