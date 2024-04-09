// user-response.dto.ts

import { AuthenticationType } from '../../../utils/constant';
import { User } from '../entity/user.entity';

export class UserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  picture: string;
  authenticationType: AuthenticationType;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.verified = user.verified;
    this.picture = user.picture;
    this.authenticationType = user.authenticationType;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
