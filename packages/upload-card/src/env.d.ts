declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_REGION: string;
      S3_BUCKET: string;
      SSM_NAME: string;
    }
  }
}

export {};
