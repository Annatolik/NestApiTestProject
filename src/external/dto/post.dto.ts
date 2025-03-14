import { ApiProperty } from '@nestjs/swagger';

export class ExternalPost {
  @ApiProperty({ example: 1, description: 'User ID from external API' })
  userId: number;

  @ApiProperty({ example: 1, description: 'Post ID from external API' })
  id: number;

  @ApiProperty({ example: 'Post title', description: 'Title of the post' })
  title: string;

  @ApiProperty({ example: 'Post content', description: 'Content of the post' })
  body: string;
}