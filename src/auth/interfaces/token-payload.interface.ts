export interface TokenPayload {
  readonly sub: number; // 👈 The principal that is the subject of the JWT
  readonly email: string;
}
