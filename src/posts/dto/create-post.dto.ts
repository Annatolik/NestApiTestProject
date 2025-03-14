import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ 
    example: 1, 
    description: 'User ID (optional, will be set from authenticated user if not provided)', 
    required: false 
  })
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty({ example: 'Post title', description: 'Title of the post' })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({ example: 'Post content', description: 'Content of the post' })
  @IsString()
  @IsNotEmpty({ message: 'Body content is required' })
  body: string;
}