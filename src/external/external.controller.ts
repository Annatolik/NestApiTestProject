import { Controller, Get, Param, Post, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ExternalService } from './external.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExternalPost } from './dto/post.dto';

@ApiTags('External API')
@Controller('external')
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {}

  @Get('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch posts from external API' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return posts from external API',
    type: [ExternalPost]
  })
  fetchPosts() {
    return this.externalService.fetchPosts();
  }

  @Get('posts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch post by ID from external API' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return post from external API',
    type: ExternalPost
  })
  fetchPostById(@Param('id', ParseIntPipe) id: number) {
    return this.externalService.fetchPostById(id);
  }

  @Post('import-posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Import posts from external API to local database' })
  @ApiResponse({ 
    status: 201, 
    description: 'Number of posts successfully imported',
    schema: {
      type: 'object',
      properties: {
        imported: { type: 'number' },
        message: { type: 'string' }
      }
    }
  })
  async importPosts() {
    const importedCount = await this.externalService.importPosts();
    return { 
      imported: importedCount,
      message: `Successfully imported ${importedCount} posts from external API`
    };
  }
}