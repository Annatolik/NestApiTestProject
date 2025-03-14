import { Column, Model, Table, HasMany, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Post } from '../../posts/entities/post.entity';

@Table
export class User extends Model {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  @Column({ unique: true, allowNull: false })
  email: string;

  @ApiHideProperty()
  @Column({ allowNull: false })
  password: string;

  @ApiHideProperty()
  @Column({ allowNull: true })
  refreshToken: string;

  @ApiHideProperty()
  @HasMany(() => Post)
  posts: Post[];

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt();
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}