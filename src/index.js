const jetpack = require('fs-jetpack');
const readline = require('readline');
const axios = require('axios');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path')

dotenv.config();

const OAuth2 = google.auth.OAuth2;
const pathToCredentials = path.resolve(__dirname, '..', 'credentials');
const videoCategories = require('./categories.json');
const credential = require('../credentials/credentials.json');
const fs = require('fs');
const { start } = require('repl');
const tokenFile = path.resolve(pathToCredentials, 'token.json');
const credentialFile = path.resolve(pathToCredentials, 'credentials.json');
const pathToTemp = path.resolve(__dirname, '..', 'temp');
const videoFilePath = path.resolve(pathToTemp, 'video.mp4');
const thumbnailFilePath = path.resolve(pathToTemp, 'thumb.png');



const CategoriesToUse = ['gaming'];
const tags = ['games', 'twitch', 'SFV', 'Street Figher V'];

let categoriesIds = null;

videoCategories.items.forEach(item => {
    if (CategoriesToUse.includes(item.snippet.title.toLowerCase())) {
        categoriesIds = item.id
    }
});

const scopes = ['https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.upload',
    // 'https://www.googleapis.com/auth/youtubepartner'
];

//load userInfo


const startTask = async ({
    title,
    description,
    tags,
    category
}) => {
    try {
        const contentCredentials = await jetpack.readAsync(credentialFile);
        authorize(contentCredentials, (auth) => {
            const objContainer = {
                auth,
                title,
                description,
                tags,
                category: categoriesIds
            }
            uploadVideo(objContainer)
        })
    } catch (e) {
        console.log(e);
    }
}

const authorize = async (credentials, callback) => {
    try {
        const { client_id, client_secret } = credential.installed;
        const redirectURL = credential.installed.redirect_uris[0];
        const OAuth2Client = new OAuth2(client_id, client_secret, redirectURL);

        if (jetpack.exists(tokenFile)) {
            OAuth2Client.credentials = jetpack.readAsync(tokenFile);
            callback(OAuth2Client);
        } else {
            getNewToken(OAuth2Client, callback);
        }
    } catch (e) {
        console.log(e)
    }
};

const getNewToken = (oAuth2Client, callback) => {
    const authURL = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    })

    console.log('Authorize this app by visiting this url: ', authURL);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oAuth2Client.getToken(code, function(err, token) {
        if (err) {
            console.log('Error while trying to retrieve access token', err);
            return;
        }
        oAuth2Client.credentials = token;
        storeToken(token);
        callback(oAuth2Client);
        });
    });
}

const storeToken = async (token) => {
    try {
        await jetpack.writeAsync(tokenFile, token);
        console.log('Token stored to ' + TOKEN_PATH);
    } catch (e) {
        console.log(e)
    }
}

const uploadVideo = ({ auth, title, description, tags, categories }) => {
    const services = google.youtube('v3');
    services.videos.insert({
        auth,
        part: 'snippet,status',
        requestBody: {
            snippet: {
                title,
                description,
                tags,
                categoryId:categories,
                defaultLanguage: 'en',
                defaultAudioLanguage: 'en'
            },
            status: {
                privacyStatus: "private"
            },
        },
        media: {
            body: jetpack.createReadStream(videoFilePath)
        },
    }, (err, res) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(res.data.id) // video id
        console.log(res.data);
        console.log('Video Uploaded, uploading Thumbnail now');
        services.thumbnails.set({
            auth,
            videoId: res.data.id,
            media: {
                body: jetpack.createReadStream(thumbnailFilePath)
            }
        }, (err, res) => {
            if (err) {
                console.log(err)
                return;
            }
            console.log(res)
        })
    })
    console.log({ auth, title, description, tags, categories })
}

startTask({
    title: 'Test Video',
    description: 'Test of uploaded video',
    tags,
    category: categoriesIds
})

