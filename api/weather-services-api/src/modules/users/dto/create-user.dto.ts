import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'martha.stuart@art.com' })
  readonly email?: string;

  @ApiProperty({ example: 'Martha Stuart' })
  readonly name: string;

  @ApiProperty({ example: '12345' })
  readonly zip: string;
}
