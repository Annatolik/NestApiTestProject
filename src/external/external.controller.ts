import { Controller, Get, Param, Post, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ExternalService } from './external.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('External API')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('external')
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {}

  @Get('posts')
  @ApiOperation({ summary: 'Fetch posts from external API' })
  fetchPosts() {
    return this.externalService.fetchPosts();
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Fetch post by ID from external API' })
  fetchPostById(@Param('id', ParseIntPipe) id: number) {
    return this.externalService.fetchPostById(id);
  }

  @Post('import-posts')
  @ApiOperation({ summary: 'Import posts from external API to local database' })
  async importPosts() {
    const importedCount = await this.externalService.importPosts();
    return { 
      imported: importedCount,
      message: `Successfully imported ${importedCount} posts from external API`
    };
  }
}