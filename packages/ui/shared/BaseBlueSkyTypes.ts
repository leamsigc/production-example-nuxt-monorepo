export type Thread = {
  thread: ThreadViewPost;
};

export type ThreadViewPost = {
  $type: string;
  post: Post;
  replies: ThreadViewPost[];
};
export type DisplayThread = {
  isReply: boolean;
  post: Post;
  replies: DisplayThread[];
}

export type Post = {
  uri: string;
  cid: string;
  author: Author;
  record: Record;
  embed?: EmbedView;
  replyCount: number;
  repostCount: number;
  likeCount: number;
  quoteCount: number;
  indexedAt: string;
  labels: Label[];
};

export type Author = {
  did: string;
  handle: string;
  displayName: string;
  avatar?: string;
  labels: Label[];
  createdAt: string;
};

export type Record = {
  $type: string;
  createdAt: string;
  embed?: EmbedImages;
  facets?: Facet[];
  text: string;
  langs?: string[];
  reply?: Reply;
};

export type EmbedImages = {
  $type: string;
  images: Image[];
};

export type EmbedView = {
  $type: string;
  images: ImageView[];
};

export type Image = {
  alt: string;
  image: Blob;
};

export type ImageView = {
  thumb: string;
  fullsize: string;
  alt: string;
};

export type Blob = {
  $type: string;
  ref: Link;
  mimeType: string;
  size: number;
};

export type Link = {
  $link: string;
};

export type Facet = {
  $type?: string;
  features: Feature[];
  index: Index;
};

export type Feature = {
  $type: string;
  uri?: string;
  did?: string;
};

export type Index = {
  byteStart: number;
  byteEnd: number;
};

export type Reply = {
  parent: ReplyReference;
  root: ReplyReference;
};

export type ReplyReference = {
  cid: string;
  uri: string;
};

export type Label = {};
