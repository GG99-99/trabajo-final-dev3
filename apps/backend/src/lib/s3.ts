import 'dotenv/config'
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

// Lazy getters — read env at call time, not at module load time
const getClient = () => new S3Client({
    region: process.env.AWS_REGION ?? 'us-east-1',
    credentials: {
        accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

const getBucket = () => {
    const b = process.env.AWS_S3_BUCKET
    if (!b) throw new Error('AWS_S3_BUCKET is not set in environment variables')
    return b
}

export const s3Service = {
    upload: async (buffer: Buffer, mimeType: string, folder = 'tattoos'): Promise<{ key: string; url: string }> => {
        const s3     = getClient()
        const BUCKET = getBucket()
        const ext    = mimeType.split('/')[1] ?? 'jpg'
        const key    = `${folder}/${randomUUID()}.${ext}`

        await s3.send(new PutObjectCommand({
            Bucket:      BUCKET,
            Key:         key,
            Body:        buffer,
            ContentType: mimeType,
        }))

        const url = process.env.AWS_S3_PUBLIC_URL
            ? `${process.env.AWS_S3_PUBLIC_URL}/${key}`
            : `https://${BUCKET}.s3.${process.env.AWS_REGION ?? 'us-east-1'}.amazonaws.com/${key}`

        return { key, url }
    },

    delete: async (key: string): Promise<void> => {
        await getClient().send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }))
    },

    presign: async (key: string, expiresIn = 3600): Promise<string> => {
        return getSignedUrl(
            getClient(),
            new GetObjectCommand({ Bucket: getBucket(), Key: key }),
            { expiresIn }
        )
    },
}
