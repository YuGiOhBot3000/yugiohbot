declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_REGION: string;
      S3_BUCKET: string;

      TWITTER_CONSUMER_KEY: string;
      TWITTER_CONSUMER_SECRET: string;
      TWITTER_ACCESS_TOKEN: string;
      TWITTER_ACCESS_SECRET: string;
    }
  }
}

export {};
