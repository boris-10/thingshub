export enum Environment {
  Development = 'development',
  Production = 'production',
}

export const APP_CONFIG = 'APP_CONFIG';
export const DATABASE_CONFIG = 'DATABASE_CONFIG';
export const JWT_CONFIG = 'JWT_CONFIG';
export const EMAIL_CONFIG = 'EMAIl_CONFIG';

export enum PostgresErrorCode {
  UniqueViolation = '23505',
}
