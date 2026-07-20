const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();


const app = express();


const PORT = process.env.PORT || 3000;



app.set("view engine","ejs");


app.use(express.static("public"));


app.use(express.urlencoded({
    extended:true
}));

app.use(express.json());





function wait(ms){

    return new Promise(resolve=>setTimeout(resolve,ms));

}







async function convertVideo(videoId){



    const MAX_TIME = 10 * 60 * 1000; // 10 minutes


    const startTime = Date.now();


    let attempts = 0;



    while(Date.now() - startTime < MAX_TIME){



        attempts++;


        const elapsed = Math.floor(
            (Date.now()-startTime)/1000
        );



        console.log(
            `Attempt ${attempts} | ${elapsed}s elapsed`
        );




        const controller = new AbortController();



        const timeout = setTimeout(()=>{

            controller.abort();

        },30000);







        try{


            const response = await fetch(


                `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,

                {


                    method:"GET",


                    headers:{


                        "x-rapidapi-key":
                        process.env.API_KEY,


                        "x-rapidapi-host":
                        process.env.API_HOST


                    },


                    signal:controller.signal


                }


            );



            clearTimeout(timeout);




            const data = await response.json();




            console.log(
                "API:",
                data.status,
                "|",
                data.msg || "",
                "|",
                data.progress || 0,
                "%"
            );








            // DONE

            if(
                data.status==="ok" &&
                data.link
            ){


                return data;


            }









            // API says processing

            if(
                data.status==="processing"
            ){


                console.log(
                    "Still converting..."
                );


                await wait(5000);


                continue;


            }








            // FAILED

            if(
                data.status==="fail"
            ){



                console.log(
                    "Temporary failure:",
                    data.msg
                );



                // permanent errors

                if(
                    data.msg &&
                    (
                        data.msg.includes("Long audio") ||
                        data.msg.includes("Invalid") ||
                        data.msg.includes("not available")
                    )
                ){


                    return {

                        status:"error",

                        message:data.msg

                    };


                }




                await wait(5000);


                continue;


            }









            await wait(5000);



        }



        catch(error){



            clearTimeout(timeout);



            console.log(
                "REQUEST ERROR:",
                error.message
            );



            await wait(5000);


        }





    }





    return {


        status:"error",

        message:
        "Conversion timed out after 10 minutes"


    };



}









function extractVideoId(input){



    try{


        if(
            input.includes("youtube.com")
        ){


            const url = new URL(input);


            return url.searchParams.get("v");


        }





        if(
            input.includes("youtu.be")
        ){


            const url = new URL(input);


            return url.pathname.substring(1);


        }





        return input.trim();



    }



    catch{


        return null;


    }



}









app.get("/",(req,res)=>{


    res.render("index",{

        success:false,

        message:"",

        song_title:"",

        song_link:""

    });


});









app.post("/convert-mp3",async(req,res)=>{



    let videoId=req.body.videoID;





    if(!videoId){


        return res.render("index",{

            success:false,

            message:
            "Please enter a YouTube URL or ID",

            song_title:"",

            song_link:""

        });


    }





    videoId=extractVideoId(videoId);





    if(
        !videoId ||
        !/^[a-zA-Z0-9_-]{11}$/.test(videoId)
    ){


        return res.render("index",{


            success:false,


            message:
            "Invalid YouTube video ID",


            song_title:"",


            song_link:""


        });


    }









    try{


        const result =
        await convertVideo(videoId);




        console.log(
            "FINAL RESULT:",
            result
        );








        if(
            result.status==="ok" &&
            result.link
        ){



            return res.render("index",{

                success:true,

                message:"",

                song_title:
                result.title,

                song_link:
                result.link


            });


        }







        return res.render("index",{



            success:false,


            message:
            result.message ||
            "Conversion failed",


            song_title:"",


            song_link:""



        });





    }




    catch(error){



        console.log(
            "SERVER ERROR:",
            error
        );



        return res.render("index",{


            success:false,


            message:
            "Server error",


            song_title:"",


            song_link:""



        });



    }




});








app.listen(PORT,()=>{


    console.log(
        `Server running on port ${PORT}`
    );


});