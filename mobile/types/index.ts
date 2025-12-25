// Type definitions for KavreNews mobile app

export interface News {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: {
    url: string;
    publicId?: string;
    caption?: string;
  };
  gallery?: {
    url: string;
    publicId?: string;
    caption?: string;
  }[];
  category: Category;
  tags?: string[];
  author: User;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isBreaking: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
  avatar?: string;
}

export interface Comment {
  _id: string;
  news: string;
  name: string;
  email: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
