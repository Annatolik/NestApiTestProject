import { 
    Table, 
    Column, 
    Model, 
    ForeignKey, 
    BelongsTo 
  } from 'sequelize-typescript';
  import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
  import { User } from '../../user/entities/user.entity';
  
  @Table
  export class Post extends Model {
    @ApiProperty({ example: 1, description: 'Unique identifier' })
    @Column({ primaryKey: true, autoIncrement: true })
    declare id: number;
  
    @ApiProperty({ example: 1, description: 'User identifier' })
    @ForeignKey(() => User)
    @Column
    declare userId: number;
  
    @ApiProperty({ example: 'Post title', description: 'Title of the post' })
    @Column
    declare title: string;
  
    @ApiProperty({ example: 'Post content', description: 'Content of the post' })
    @Column
    declare body: string;
  
    @ApiHideProperty()
    @BelongsTo(() => User)
    declare user: User;
  }