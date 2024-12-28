import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const BUCKET = "promptograph";

// R2 client
export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function getObject(key) {
  return r2.send(new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  }));
}

export async function uploadImage(id, image) {
  const imageUpload = new Upload({
    client: r2,
    params: {
      Bucket: BUCKET,
      Key: `headlines/${id}/image.png`,
      Body: image,
    },
  });
  return imageUpload.done();
}
