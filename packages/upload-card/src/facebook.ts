import axios from "axios";
import FormData from "form-data";
import { Readable } from "stream";

const FACEBOOK_BASE_URL = "https://graph.facebook.com";

type UploadProps = {
  fileStream: Readable;
  message: string;
  token: string;
};

type CommentProps = {
  post_id: string;
  message: string;
  token: string;
};

type UploadResponse = {
  id: string;
  post_id: string;
};

type CommentResponse = {
  id: string;
};

export const uploadToFacebook = async ({
  fileStream,
  message,
  token,
}: UploadProps) => {
  const bodyFormData = new FormData();
  bodyFormData.append("source", fileStream);

  const { data } = await axios.post<UploadResponse>(
    `${FACEBOOK_BASE_URL}/me/photos`,
    bodyFormData,
    {
      params: {
        access_token: token,
        message,
      },
      headers: bodyFormData.getHeaders(),
    }
  );

  return data;
};

export const commentOnPost = async ({
  post_id,
  message,
  token,
}: CommentProps) => {
  const { data } = await axios.post<CommentResponse>(
    `${FACEBOOK_BASE_URL}/${post_id}/comments`,
    { message },
    {
      params: {
        access_token: token,
      },
    }
  );

  return data;
};
