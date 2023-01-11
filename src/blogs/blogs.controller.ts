import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlogsService } from './blogs.service';
import { BlogDto } from './dto/blog.dto';
import { Blog } from './schemas/blog.schema';

@Controller('blogs')
export class BlogsController {
  constructor(private blogService: BlogsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createBlog(@Body() dto: BlogDto, @Request() req: any): Promise<Blog> {
    return this.blogService.createBlog(dto, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateBlog(@Body() dto: BlogDto, @Param('id') id: any): Promise<Blog> {
    return this.blogService.updateBlog(dto, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteBlog(@Body() dto: BlogDto, @Param('id') id: any): Promise<Blog> {
    return this.blogService.deleteBlog(dto, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-blogs')
  getMyBlogs(@Request() req: any): Promise<Blog[]> {
    return this.blogService.getMyBlogs(req);
  }

  @Get(':id')
  getOneBlog(@Param('id') id: any): Promise<Blog> {
    return this.blogService.getOneBlog(id);
  }

  @Get()
  getAllBlogs(): Promise<Blog[]> {
    return this.blogService.getAllBlogs();
  }
}
