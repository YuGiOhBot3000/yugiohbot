declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_REGION: string;
      FACEBOOK_TOKEN: string;
      S3_BUCKET: string;
    }
  }
}

export {};
