import { IsNotEmpty, IsString } from 'class-validator';

export class AuthorizationDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  private constructor(partialAuthDto: Partial<AuthorizationDto>) {
    Object.assign(this, partialAuthDto);
  }

  static from(partialAuthDto: Partial<AuthorizationDto>) {
    return new AuthorizationDto(partialAuthDto);
  }
}
