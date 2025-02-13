document.addEventListener("DOMContentLoaded", function () {

    
    document.getElementById("hamburger").addEventListener("click" , ()=>{
        document.getElementById("left").style.left = "0";
        document.getElementById("hamburger").style.display = "none";
       
        document.getElementById("cross").display = "block"
        
    })

    document.getElementById("cross").addEventListener("click" , ()=>{
        document.getElementById("left").style.left = "-100%"
        document.getElementById("cross").display = "none"
        document.getElementById("hamburger").style.display = "block";
    })


    document.getElementById("play").src = "play.svg"
    let currentSong = new Audio()
    let mt = 0;
    let ms = 0;
    let dt = 0;
    let ds = 0;

    document.getElementById("duration").innerHTML = "00:00/00:00"



    async function getSongs() {

        let a = await fetch("http://127.0.0.1:3000/Songs/")
        let response = await a.text()

        let div = document.createElement("div")
        div.innerHTML = response;
        let as = div.getElementsByTagName("a")
        let songs = []
        for (let i = 0; i < as.length; i++) {
            const element = as[i];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split("/Songs/")[1])
                // songs.push(element.href.slice(28, 56))
                //  it is not working find out the issue

            }


        }

        return songs;

    }



    const mintim = ((time, duration) => {

        if (time < 60) {
            mt = "00"
            if (Math.round(time) < 10) {
                ms = `0${Math.round(time)}`
            }
            else {
                ms = `${Math.round(time)}`
            }


        }

        else {
            mt = Math.floor(time / 60);

            if (Math.round(time % 60) < 10) {
                ms = `0${Math.round(time % 60)}`

            }
            else {
                ms = Math.round(time % 60)
            }
        }


        if (duration < 60) {
            dt = "00"
            ds = Math.round(duration)
        }

        else {
            dt = Math.floor(duration / 60);
            if (isNaN(dt)) {
                dt = "00"
            }
            else {
                dt = Math.floor(duration / 60);
            }



            if (duration % 60 < 10) {
                if (isNaN(duration % 60)) {
                    ds = "00"
                }
                else {

                    ds = `0${Math.round(duration % 60)}`
                }
            }

            else {
                if (isNaN(duration % 60)) {
                    ds = "00"
                }
                else {

                    ds = Math.round(duration % 60)
                }

            }
        }




    })


    async function main() {
        let songs = await getSongs()

        var audio = new Audio(songs[0])
        audio.play();

        let songUL = document.querySelector(".playList").getElementsByTagName("ol")[0]
        for (const song of songs) {
            songUL.innerHTML = songUL.innerHTML +
                // `<li>${song.replaceAll("_", " ")}</li>`;
                `<li>${song}</li>`;
        }

        const playMusic = (track) => {
            currentSong.src = "/Songs/" + track
            currentSong.play()
            document.getElementById("songName").innerHTML = decodeURI(track).slice(0, 28).replaceAll("_", " ")



        }

        playMusic(songs[0])
        // console.log(Math.floor((songs[0].duration)/60));
        // console.log(Math.round((songs[0].duration)%60));
        // why it is not working and showing the logs as NaN 


        currentSong.addEventListener("timeupdate", () => {

            mintim(currentSong.currentTime, currentSong.duration)


            document.getElementById("duration").innerText = `${mt} : ${ms} / ${dt} : ${ds}`
            document.getElementById("circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

        })
        // audio.addEventListener("loadeddata", () => {
        //     console.log(audio.duration, audio.currentSrc, audio.currentTime);

        // })

        Array.from(document.querySelector(".playList").getElementsByTagName("li")).forEach(e => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)   ;

            e.addEventListener("click", element => {
                // console.log(e.innerHTML.trim());





                playMusic(e.innerHTML)

                document.getElementById("play").src = "pause.svg"
                currentSong.addEventListener("timeupdate", () => {

                    mintim(currentSong.currentTime, currentSong.duration)


                    document.getElementById("duration").innerText = `${mt} : ${ms} / ${dt} : ${ds}`
                })


                // document.getElementById("circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%";
                //  or we can write it as "playMusic(e.queryselctor(".info").firstElementChild.innerHTML)"


                //   but for that use we have to difene the info  class in our javascript like 
                // songUL.innerHTML = songUL.innerHTML + `<li>
                // <div class="info" > <div> ${song.replaceAll("_", " ")} </div> </div>
                // </li>`;

            })


        });

        document.getElementById("play").addEventListener("click", () => {

            if (currentSong.paused) {
                currentSong.play()
                document.getElementById("play").src = "pause.svg"

            }
            else {
                currentSong.pause()
                document.getElementById("play").src = "play.svg"


            }

        })
        document.getElementById("seekbar").addEventListener("click", function (e) {

            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.getElementById("circle").style.left = percent + "%"
            currentSong.currentTime = ((currentSong.duration) * percent) / 100;
        })

        // Add eventlistene to next button
        let nex = document.getElementById("nex");

        nex.addEventListener("click", function () {
    
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if(index+1 < songs.length){
                playMusic(songs[index+1])
            }
            
        })
        let prei = document.getElementById("prei")
        prei.addEventListener("click", function () {
    
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if(index-1 >= 0){
                playMusic(songs[index-1])
            }
            
        })
    }
    main()




















})