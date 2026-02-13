import { ApiProperty } from '@nestjs/swagger';

export class UserListItemDto {
  @ApiProperty({ example: 'Gabriel' })
  nome: string;

  @ApiProperty({ example: 'Macedo', required: false })
  sobrenome?: string;

  @ApiProperty({ example: 'gabriel@email.com' })
  email: string;

  @ApiProperty({ example: '2026-02-12T12:00:00.000Z' })
  cadastrado_em: Date;
}

export class ReponseListUsers {
  @ApiProperty({ example: 'Users retrieved successfully' })
  message: string;

  @ApiProperty({ type: [UserListItemDto] })
  users: UserListItemDto[];
}
