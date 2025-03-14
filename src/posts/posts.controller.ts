import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseGuards,
    ParseIntPipe,
    Request
  } from '@nestjs/common';
  import { PostsService } from './posts.service';
  import { CreatePostDto } from './dto/create-post.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
  import { Post as PostEntity } from './entities/post.entity';
  
  @ApiTags('Posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Controller('posts')
  export class PostsController {
    constructor(private readonly postsService: PostsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new post' })
    create(@Body() createPostDto: CreatePostDto, @Request() req) {
      const userId = req.user.userId;
      return this.postsService.create(createPostDto, userId);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all posts' })
    findAll() {
      return this.postsService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a post by id' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.postsService.findOne(id);
    }
  
    @Get('user/:userId')
    @ApiOperation({ summary: 'Get all posts by a specific user' })
    findByUserId(@Param('userId', ParseIntPipe) userId: number) {
      return this.postsService.findByUserId(userId);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a post' })
    update(
      @Param('id', ParseIntPipe) id: number, 
      @Body() updateData: Partial<PostEntity>,
    ) {
      return this.postsService.update(id, updateData);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a post' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.postsService.remove(id);
    }
  }