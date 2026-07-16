// required packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

// create the express server
const app = express();

// server port number
const PORT = process.env.PORT || 3000;

// set template engine
app.set("view engine", "ejs");

app.use(express.static("public"));

// needed to parse html data for POST request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// home page
app.get("/", (req, res) => {
    res.render("index.ejs");
});


// convert route
app.post("/convert-mp3", async (req, res) => {

    let videoId = req.body.videoID;

    // check empty input
    if (
        videoId === undefined ||
        videoId === "" ||
        videoId === null
    ) {
        return res.render("index", {
            success: false,
            message: "Please enter a YouTube ID or URL"
        });
    }


    // extract ID if user entered a YouTube link
    if (videoId.includes("youtube.com") || videoId.includes("youtu.be")) {

        try {

            const url = new URL(videoId);

            // youtube.com/watch?v=ID
            if (url.hostname.includes("youtube.com")) {

                videoId = url.searchParams.get("v");

            }

            // youtu.be/ID
            else if (url.hostname.includes("youtu.be")) {

                videoId = url.pathname.substring(1);

            }

        } catch(error) {

            return res.render("index", {
                success:false,
                message:"Invalid YouTube URL"
            });

        }
    }


    // call RapidAPI
    const fetchAPI = await fetch(
        `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
        {
            method:"GET",
            headers:{
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST
            }
        }
    );


    const fetchResponse = await fetchAPI.json();

    console.log(fetchResponse);


    if(fetchResponse.status === "ok") {

        return res.render("index", {
            success:true,
            song_title:fetchResponse.title,
            song_link:fetchResponse.link
        });

    }

    else {

        return res.render("index", {
            success:false,
            message:fetchResponse.message
        });

    }

});


// start the server
app.listen(PORT, () => {

    console.log(`server started on port ${PORT}`);

});
