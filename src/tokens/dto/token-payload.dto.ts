import { TokenType } from '../token-type.enum';

export interface TokenPayloadBase {
  email: string;
  type: TokenType;
}

export interface TokenPayload extends TokenPayloadBase {
  iat: number;
  exp: number;
}
