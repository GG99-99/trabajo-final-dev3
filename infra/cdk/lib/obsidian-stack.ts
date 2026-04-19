import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export class ObsidianStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // ── S3 Bucket ────────────────────────────────────────────────────────────
    const bucket = new s3.Bucket(this, 'TattooImages', {
      bucketName: `obsidian-archive-images-${this.account}`,
      // Public read — images are served directly from S3
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      publicReadAccess: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
            s3.HttpMethods.HEAD,
          ],
          allowedOrigins: [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:3030',
          ],
          maxAge: 3600,
        },
      ],
      lifecycleRules: [
        {
          id: 'CleanIncompleteUploads',
          enabled: true,
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(1),
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    // ── IAM User for backend ─────────────────────────────────────────────────
    const backendUser = new iam.User(this, 'BackendUser', {
      userName: 'obsidian-archive-backend',
    })

    // S3 permissions — only on this bucket
    bucket.grantReadWrite(backendUser)
    bucket.grantDelete(backendUser)

    const accessKey = new iam.CfnAccessKey(this, 'BackendAccessKey', {
      userName: backendUser.userName,
    })

    // ── Outputs ──────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'S3 bucket name',
      exportName: 'ObsidianBucketName',
    })

    new cdk.CfnOutput(this, 'BucketUrl', {
      value: `https://${bucket.bucketName}.s3.${this.region}.amazonaws.com`,
      description: 'Public base URL for images',
      exportName: 'ObsidianBucketUrl',
    })

    new cdk.CfnOutput(this, 'AccessKeyId', {
      value: accessKey.ref,
      description: 'IAM Access Key ID',
    })

    new cdk.CfnOutput(this, 'SecretAccessKey', {
      value: accessKey.attrSecretAccessKey,
      description: 'IAM Secret Access Key',
    })
  }
}
