import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostsService } from '../posts/posts.service';
import { ExternalPost } from './dto/post.dto';
import axios from 'axios';

@Injectable()
export class ExternalService {
  private readonly logger = new Logger(ExternalService.name);
  private readonly apiUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly postsService: PostsService,
  ) {
    const apiUrl = this.configService.get<string>('EXTERNAL_API_URL');
    if (!apiUrl) {
      throw new Error('EXTERNAL_API_URL environment variable is not set');
    }
    this.apiUrl = apiUrl;
  }

  async fetchPosts(): Promise<ExternalPost[]> {
    try {
      const response = await axios.get<ExternalPost[]>(`${this.apiUrl}/posts`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch posts from external API: ${error.message}`);
      throw new HttpException(
        'Failed to fetch posts from external API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchPostById(id: number): Promise<ExternalPost> {
    try {
      const response = await axios.get<ExternalPost>(`${this.apiUrl}/posts/${id}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch post by ID from external API: ${error.message}`);
      throw new HttpException(
        'Failed to fetch post from external API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async importPosts(): Promise<number> {
    try {
      const externalPosts = await this.fetchPosts();
      
      // Save all posts to the database
      let importedCount = 0;
      
      for (const post of externalPosts) {
        await this.postsService.create({
          userId: post.userId,
          title: post.title,
          body: post.body,
        });
        importedCount++;
      }
      
      this.logger.log(`Successfully imported ${importedCount} posts from external API`);
      return importedCount;
    } catch (error) {
      this.logger.error(`Failed to import posts: ${error.message}`);
      throw new HttpException(
        'Failed to import posts from external API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}