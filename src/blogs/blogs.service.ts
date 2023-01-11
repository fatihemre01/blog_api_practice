import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocuemnt } from 'src/auth/schemas/user.schema';
import { BlogDto } from './dto/blog.dto';
import { Blog, BlogDocuemnt } from './schemas/blog.schema';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocuemnt>,
    @InjectModel(User.name) private userModel: Model<UserDocuemnt>,
  ) {}

  async createBlog(dto: BlogDto, req: any): Promise<Blog> {
    const currentUser = await this.userModel.findById(req.user.id);
    const newBlog = new this.blogModel({
      title: dto.title,
      content: dto.content,
      sharedBy: currentUser.email,
      userId: currentUser._id,
    });
    return await newBlog.save();
  }

  async updateBlog(dto: BlogDto, id: any): Promise<Blog> {
    const blog = await this.blogModel.findById(id);
    if (dto.userId !== blog.userId)
      throw new UnauthorizedException('You can update only your blogs!');
    return this.blogModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async deleteBlog(dto: BlogDto, id: any): Promise<Blog> {
    const blog = await this.blogModel.findById(id);
    if (dto.userId !== blog.userId)
      throw new UnauthorizedException('You can delete only your blogs!');
    return this.blogModel.findByIdAndDelete(id);
  }

  async getMyBlogs(req: any): Promise<Blog[]> {
    return await this.blogModel.find({ userId: req.user.id });
  }

  async getOneBlog(id: any): Promise<Blog> {
    return await this.blogModel.findById(id);
  }

  async getAllBlogs(): Promise<Blog[]> {
    return await this.blogModel.find();
  }
}
