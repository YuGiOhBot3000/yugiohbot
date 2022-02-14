export type FacebookPost = {
  created_time: string;
  message: string;
  id: string;
};

enum Reaction {
  NONE = "NONE",
  LIKE = "LIKE",
  LOVE = "LOVE",
  WOW = "WOW",
  HAHA = "HAHA",
  SORRY = "SORRY",
  ANGRY = "ANGRY",
}

type FacebookReaction = {
  id: string;
  name: string;
  type: Reaction;
};

type FacebookAttachment = {
  description: string;
  media: { image: { height: number; src: string; width: number } };
  target: { id: string; url: string };
  title: string;
  type: string;
  url: string;
};

type FacebookResponse<T> = {
  data: T[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
};

export type GetPostsResponse = FacebookResponse<FacebookPost>;

export type GetPostInsightsResponse = {
  reactions: FacebookResponse<FacebookReaction> & {
    summary: { total_count: number };
  };
  id: string;
};

export type GetPostAttachmentsResponse = FacebookResponse<FacebookAttachment>;

export type PostImageResponse = {
  id: string;
  post_id: string;
};
