import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IBlog } from './blog.interface';
import { Blog } from './blog.model';
import mongoose from 'mongoose';
import unlinkFile from '../../../shared/unlinkFile';


const createBlogToDB = async (payload: IBlog): Promise<IBlog> => {
  const faq = await Blog.create(payload);
  if (!faq) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to created Blog');
  }

  return faq;
};

const blogDetailsFromDB = async (id: string): Promise<IBlog | null> => {
  if(!mongoose.Types.ObjectId.isValid(id)){
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }

  const faq = await Blog.findById(id);
  return faq;
};

const faqsFromDB = async (query: Record<string, unknown>): Promise<IBlog[]> => {

  const { category, page, limit } = query;

  const queries: any = {};
  if (category) {
    queries.category = category;
  }

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const blogs = await Blog.find(queries)
    .select("details url category image subject createdAt")
    .skip(skip)
    .limit(size);

    const count = await Blog.countDocuments(queries);

    const data: any = {
      blogs,
      meta: {
        page: pages,
        total: count
      }
    }
  return data;
};

const deleteBlogToDB = async (id: string): Promise<IBlog | undefined> => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid ID');
  }
  const isExistBlog: any = await Blog.findById(id);

  const result = await Blog.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to Delete Blog');
  }

  //unlink file here
  if (isExistBlog.image) {
    unlinkFile(isExistBlog?.image);
  }
  return;
};

const updateBlogToDB = async (id: string, payload: IBlog): Promise<IBlog> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid ID');
  }

  const isExistBlog: any = await Blog.findById(id);

  const updatedBlog = await Blog.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });


  //unlink file here
  if (payload.image) {
    unlinkFile(isExistBlog?.image);
  }

  if (!updatedBlog) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to updated Blog');
  }

  return updatedBlog;
};

export const BlogService = {
  createBlogToDB,
  updateBlogToDB,
  faqsFromDB,
  deleteBlogToDB,
  blogDetailsFromDB
};  