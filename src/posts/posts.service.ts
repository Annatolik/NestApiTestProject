import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
  ) {}

  async create(createPostDto: CreatePostDto, userId?: number): Promise<Post> {
    const postData = {
      ...createPostDto,
      userId: userId || createPostDto.userId,
    };

    return this.postModel.create(postData);
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.findAll({
      include: [User],
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postModel.findByPk(id, {
      include: [User],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async findByUserId(userId: number): Promise<Post[]> {
    return this.postModel.findAll({
      where: { userId },
      include: [User],
    });
  }

  async update(id: number, updateData: Partial<Post>): Promise<Post> {
    const post = await this.findOne(id);
    
    await post.update(updateData);
    
    return post;
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await post.destroy();
  }
}