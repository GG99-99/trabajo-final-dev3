-- Add S3 key and URL columns to img table
-- source column kept for backward compatibility (existing blobs)
ALTER TABLE "img" ADD COLUMN IF NOT EXISTS "s3_key" TEXT;
ALTER TABLE "img" ADD COLUMN IF NOT EXISTS "s3_url" TEXT;
