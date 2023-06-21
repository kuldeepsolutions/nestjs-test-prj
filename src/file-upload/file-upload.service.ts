import { Injectable } from '@nestjs/common';
import {S3} from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
    constructor(){}
    async uploadFile(file,path){
        const s3 = new S3({
            accessKeyId: process.env.AWS_KEY,
            secretAccessKey: process.env.AWS_SECRET
        })
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: `${path}/${uuidv4()}-${Date.now()}.${file.mimetype.split('/')[1]}`,
            Region: process.env.AWS_REGION,
            Body: file.buffer,
            ACL: 'public-read'
        }
        const response = await s3.upload(params).promise();
        return response;
    }
}
