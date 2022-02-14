import axios from "axios";
import {
  FacebookPost,
  GetPostAttachmentsResponse,
  GetPostInsightsResponse,
  GetPostsResponse,
  PostImageResponse,
} from "./types";

type GetPostProps = {
  token: string;
};

type GetPostInsightsProps = {
  token: string;
  id: string;
};

type GetPostImageProps = {
  token: string;
  id: string;
};

type PostImageProps = {
  token: string;
  url: string;
  message: string;
};

const FACEBOOK_BASE_URL = "https://graph.facebook.com";
const DAYS_AGO = 7;

export const getPosts = async ({ token }: GetPostProps) => {
  let { data } = await axios.get<GetPostsResponse>(
    `${FACEBOOK_BASE_URL}/me/posts`,
    {
      params: { access_token: token },
    }
  );

  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - DAYS_AGO);

  const posts: FacebookPost[] = [];

  while (data.paging.next) {
    const validPosts = data.data.filter(({ created_time }) => {
      const createdDate = new Date(created_time);

      return createdDate > thresholdDate;
    });

    if (!validPosts.length) break;

    posts.push(...validPosts);

    ({ data } = await axios.get<GetPostsResponse>(data.paging.next));
  }

  return posts;
};

export const getPostInsights = async ({ token, id }: GetPostInsightsProps) => {
  const { data } = await axios.get<GetPostInsightsResponse>(
    `${FACEBOOK_BASE_URL}/${id}`,
    {
      params: { access_token: token, fields: "reactions.summary(total_count)" },
    }
  );

  return data.reactions.summary.total_count;
};

export const getPostImage = async ({ token, id }: GetPostImageProps) => {
  const { data } = await axios.get<GetPostAttachmentsResponse>(
    `${FACEBOOK_BASE_URL}/${id}/attachments`,
    {
      params: { access_token: token },
    }
  );

  return data.data[0].media.image.src;
};

export const postImage = async ({ token, url, message }: PostImageProps) => {
  const { data } = await axios.post<PostImageResponse>(
    `${FACEBOOK_BASE_URL}/${process.env.FACEBOOK_ALBUM_ID}/photos`,
    { url },
    {
      params: { access_token: token, message },
    }
  );

  return data;
};
