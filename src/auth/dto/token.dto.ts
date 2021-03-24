export class TokenDto {
  accessToken: string;
  refreshToken: string;

  private constructor(partialTokenDto: Partial<TokenDto>) {
    Object.assign(this, partialTokenDto);
  }

  static from(partialTokenDto: Partial<TokenDto>) {
    return new TokenDto(partialTokenDto);
  }
}
