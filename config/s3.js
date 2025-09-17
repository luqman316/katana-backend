import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const required = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "AWS_BUCKET_NAME",
];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.warn(
    `[S3 CONFIG] Missing env vars: ${missing.join(", ")}. Set them in .env.`
  );
}

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const S3_BUCKET = process.env.AWS_BUCKET_NAME;
