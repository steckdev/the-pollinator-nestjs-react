export class UserDto {
  id: string;
  name: string;
  email?: string;
  zip: string;
  createdAt: Date;
  updatedAt: Date;
  archived?: Date;
}
