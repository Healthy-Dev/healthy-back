export interface JwtPayloadBase {
  username: string;
}

export interface JwtPayload extends JwtPayloadBase {
  iat: number;
  exp: number;
}