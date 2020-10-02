import { Injectable } from '@nestjs/common';
import { JWE, JWK, JWT } from 'jose';
import { TokenPayload, TokenPayloadBase } from './dto/token-payload.dto';

@Injectable()
export class TokensService {
  private readonly bitLength = +process.env.TOKENS_BIT_LENGTH;
  private readonly algorithm = process.env.TOKENS_ALGORITHM;
  private readonly expires = process.env.TOKENS_EXPIRES;
  private readonly jwtKey = JWK.generateSync('oct', this.bitLength, {
    use: 'sig',
  });
  private readonly jweKey = JWK.generateSync('RSA', this.bitLength, {
    use: 'enc',
  });

  async getEncryptedToken(payloadBase: TokenPayloadBase): Promise<string> {
    return JWE.encrypt(
      JWT.sign(payloadBase, this.jwtKey, {
        algorithm: this.algorithm,
        expiresIn: this.expires,
      }),
      this.jweKey,
    );
  }

  async verifyEncryptedToken(token: string): Promise<TokenPayload> {
    const tokenPayload = JWT.verify(JWE.decrypt(token, this.jweKey).toString(), this.jwtKey, {
      algorithms: [this.algorithm],
      maxTokenAge: this.expires,
    }) as TokenPayload;
    if (this.tokenIsActive(tokenPayload.exp)) {
      return tokenPayload;
    }
    throw new Error('El token ha expirado');
  }

  tokenIsActive(expireAt: number): boolean {
    return new Date(expireAt * 1000) > new Date(Date.now());
  }
}
