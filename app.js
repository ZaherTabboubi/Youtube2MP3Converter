// required packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();


// create express server
const app = express();


// port
const PORT = process.env.PORT || 3000;


// view engine
app.set("view engine", "ejs");


// static files
app.use(express.static("public"));


// parse data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




// function to wait
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}





// check API until finished
async function checkConversion(videoId) {


    // maximum 10 checks
    for(let i = 0; i < 10; i++) {


        const response = await fetch(

            `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,

            {
                method:"GET",

                headers:{

                    "x-rapidapi-key": process.env.API_KEY,

                    "x-rapidapi-host": process.env.API_HOST

                }
            }

        );



        const data = await response.json();



        console.log("API RESPONSE:", data);




        // finished
        if(data.status === "ok") {

            return data;

        }




        // still converting
        if(data.status === "processing") {


            console.log(
                `Processing... attempt ${i + 1}/10`
            );


            await wait(3000);


        }




        // unknown error
        else {

            return data;

        }



    }



    return {

        status:"error",

        message:"Conversion is taking too long. Please try again."

    };


}








// home page
app.get("/", (req,res)=>{


    res.render("index",{

        success:false,

        message:"",

        song_title:"",

        song_link:""

    });


});









// convert route
app.post("/convert-mp3", async(req,res)=>{


    let videoId = req.body.videoID;



    if(!videoId){


        return res.render("index",{

            success:false,

            message:"Please enter a YouTube URL or ID",

            song_title:"",

            song_link:""

        });


    }






    // extract ID from URL
    if(
        videoId.includes("youtube.com") ||
        videoId.includes("youtu.be")
    ){


        try{


            const url = new URL(videoId);



            if(url.hostname.includes("youtube.com")){


                videoId = url.searchParams.get("v");


            }


            else if(url.hostname.includes("youtu.be")){


                videoId = url.pathname.substring(1);


            }



        }

        catch(error){


            return res.render("index",{

                success:false,

                message:"Invalid YouTube URL",

                song_title:"",

                song_link:""

            });


        }


    }







    try{


        const fetchResponse = await checkConversion(videoId);




        if(fetchResponse.status === "ok"){


            return res.render("index",{


                success:true,


                song_title:fetchResponse.title,


                song_link:fetchResponse.link,


                message:""


            });



        }



        else{


            return res.render("index",{


                success:false,


                message:
                fetchResponse.message ||
                "Conversion failed",


                song_title:"",


                song_link:""


            });



        }



    }


    catch(error){


        console.log(error);



        return res.render("index",{


            success:false,


            message:"Server error. Please try again.",


            song_title:"",


            song_link:""


        });



    }




});









// start server
app.listen(PORT,()=>{


    console.log(
        `server started on port ${PORT}`
    );


});