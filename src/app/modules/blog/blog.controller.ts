import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BlogService } from './blog.service';

const createBlog = catchAsync(async (req: Request, res: Response) => {
    const result = await BlogService.createBlogToDB(req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Blog Created Successfully',
        data: result
    });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
    const result = await BlogService.updateBlogToDB(req.params.id, req.body);
  
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Blog Updated Successfully',
        data: result
    });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
    const result = await BlogService.deleteBlogToDB(req.params.id);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blog Deleted Successfully',
      data: result,
    });
});
  
const getBlogs = catchAsync(async (req: Request, res: Response) => {
    const result = await BlogService.faqsFromDB(req.query);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blog retrieved Successfully',
      data: result,
    });
});

const blogDetails = catchAsync(async (req: Request, res: Response) => {
    const result = await BlogService.blogDetailsFromDB(req.params.id);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blog Details retrieved Successfully',
      data: result,
    });
});

export const BlogController = {
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogs,
    blogDetails
};  