import express from "express";
import dotenv from "dotenv";
import OAuthSimple from "oauthsimple";
import axios from "axios";

const app = express();

dotenv.config();

// OAuth1a / oauthsimple

const oauth = new OAuthSimple(
    process.env.CONSUMER_KEY,
    process.env.CONSUMER_SECRET
);

const request = oauth.sign({
    action: "GET",
    path: process.env.API_URL,
    signatures: {
        api_key: process.env.CONSUMER_KEY,
        shared_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.OAUTH_TOKEN,
        access_secret: process.env.OAUTH_TOKEN_SECRET,
    },
});

// Route

app.get("/", async (req, res) => {
    try {
        const { data } = await axios.get(request.signed_url, {
            headers: { Accept: "application/json" },
        });

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// Startup

const PORT = process.env.PORT || 3002;

app.listen(PORT, () =>
    console.log(`Server started, listening on Port ${PORT}...`)
);
