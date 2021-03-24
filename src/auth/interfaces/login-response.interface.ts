import { User } from '../../users/entities/user.entity';

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
