import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3_BUCKET, s3Client } from "../config/s3.js";

export const presignKey = async (key, expiresIn = 300) => {
  if (!key) return null;
  const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
  return getSignedUrl(s3Client, command, { expiresIn });
};

export const presignMany = async (keys = [], expiresIn = 300) => {
  return Promise.all(
    keys.map(async (k) => ({ key: k, url: await presignKey(k, expiresIn) }))
  );
};
