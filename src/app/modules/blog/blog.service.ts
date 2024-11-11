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

const faqsFromDB = async (): Promise<IBlog[]> => {
  const faqs = await Blog.find().select("details url category image subject");
  return faqs;
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
};  