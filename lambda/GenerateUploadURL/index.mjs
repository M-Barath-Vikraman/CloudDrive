import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
});

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body);

        const { userId, fileName, contentType } = body;

        if (!userId || !fileName || !contentType) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,Authorization",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
                body: JSON.stringify({
                    message: "Missing required parameters"
                })
            };
        }

        let folder = "documents";

        if (contentType.startsWith("image/")) {
            folder = "images";
        } else if (contentType.startsWith("video/")) {
            folder = "videos";
        }

        const key = `users/${userId}/${folder}/${Date.now()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            ContentType: contentType
        });

        const uploadUrl = await getSignedUrl(s3, command, {
            expiresIn: 300
        });

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({
                uploadUrl,
                key
            })
        };

    } catch (error) {

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({
                message: error.message
            })
        };

    }
};