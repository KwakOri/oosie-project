export interface CommunityPostData {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  views: number;
  likes: number;
  commentCount: number;
  isLiked: boolean;
  user: UserData;
}

export interface CommunityVotePostData {
  id: string;
  title: string;
  category: string;
  tags: string[];
  createdAt: string;
  views: number;
  likes: number;
  commentCount: number;
  isLiked: boolean;
  user?: UserData;
}

export interface CommunityPostCreateData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface CommunityPostUpdateData {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

interface UserData {
  id: string;
  nickname: string;
  profileURL?: string;
}

export interface CommentData {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  user: UserData;
}

export interface ReplyData {
  id: string;
  commentId: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  user: UserData;
}

export interface CommentCreateData {
  postId: string;
  content: string;
}

export interface ReplyCreateData {
  postId: string;
  commentId: string;
  content: string;
}

export interface CommentUpdateData {
  id: string;
  content: string;
}

export interface ReplyUpdateData {
  id: string;
  commentId: string;
  content: string;
}

export interface VoteItem {
  text: string;
  votes: number;
}
export interface VoteUpdateData {
  postId: string;
  items: VoteItem[];
  selectedOption: string;
}
export interface VoteData {
  title: string;
  items: VoteItem[];
}
