import {Storage} from '@google-cloud/storage';
import {config} from 'dotenv';

config();

const storage = new Storage({
    projectId: 'layer-backend',
    credentials:
        process.env.CODEWL_ENVIRONMENT === 'development'
            ? undefined
            : {
                type: "service_account",
                project_id: "layer-backend",
                private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
                private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
                client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url:
                    "https://www.googleapis.com/robot/v1/metadata/x509/cloudstorage%40layer-backend.iam.gserviceaccount.com",
                universe_domain: "googleapis.com",
            },
    apiEndpoint:
        process.env.CODEWL_ENVIRONMENT === 'development'
            ? 'http://localhost:4443'
            : undefined,
});

const bucket = await storage.bucket(process.env.GCP_ZIP_BUCKET).exists()
    .then((exists) => {
        console.log(`exists: ${exists}`);
        if (exists[0]) {
            console.log(`Bucket ${process.env.GCP_ZIP_BUCKET} exists.`);
            return storage.bucket(process.env.GCP_ZIP_BUCKET);
        }
        return storage.createBucket(process.env.GCP_ZIP_BUCKET)
            .catch(err => {
                console.error(`Failed to create bucket:`, err);
            }).then(() => {
                return storage.bucket(process.env.GCP_ZIP_BUCKET);
            });
    }).catch(err => {
        console.error(`Failed to check if bucket exists:`, err);
    });

bucket.upload("./vscode-activity-bar-template.zip", {
    destination: "vscode-activity-bar-template.zip",
    metadata: {
        contentType: "application/zip",
    },
    resumable: false,
}).then(() => {
    console.log("Uploaded vscode-activity-bar-template.zip to GCS bucket.");
}).catch(err => {
    console.error('Failed to upload vscode-activity-bar-template.zip to GCS bucket:', err);
});