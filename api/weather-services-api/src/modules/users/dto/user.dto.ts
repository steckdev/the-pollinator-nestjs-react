import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '12345678-1234-1234-1234-123456789012' })
  id: string;

  @ApiProperty({ example: 'Martha Stuart' })
  name: string;

  @ApiProperty({ example: 'martha.stuart@art.com', required: false })
  email?: string;

  @ApiProperty({ example: '12345' })
  zip: string;

  @ApiProperty({ example: '2023-10-30T12:34:56Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-10-30T12:34:56Z' })
  updatedAt: Date;

  @ApiProperty({ example: '2023-11-01T12:34:56Z', required: false })
  archived?: Date;
}
