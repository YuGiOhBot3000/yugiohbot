import { Readable } from "stream";
import { TwitterApi } from "twitter-api-v2";

type UploadProps = {
  fileStream: Readable;
  message: string;
  comment: string;
};

const streamToBuffer = (stream: Readable) =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.once("end", () => resolve(Buffer.concat(chunks)));
    stream.once("error", reject);
  });

export const uploadToTwitter = async ({
  fileStream,
  message,
  comment,
}: UploadProps) => {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  const mediaId = await client.readWrite.v1.uploadMedia(
    await streamToBuffer(fileStream),
    { mimeType: "png" }
  );

  if (!mediaId) {
    console.warn("Media could not be uploaded");
    return;
  }

  const tweet = await client.readWrite.v2.tweet(message, {
    media: {
      media_ids: [mediaId],
    },
  });

  console.debug(`Successfully tweeted ${tweet.data.id}`);

  const commentTweet = await client.readWrite.v2.reply(comment, tweet.data.id);

  console.debug(`Successfully replied ${commentTweet.data.id}`);
};
