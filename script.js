console.log("Let's write the javascript code!!!")

let currSong = new Audio();
let songs;
let curFolder;
let temp;

//async function returns a promise
async function getSongs(folder){
    curFolder = folder;
    let a = await fetch(`/songs/${folder}/`)
    let response = await a.text()
    //console.log(response)
    let div  = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a')
    
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        //console.log(element)
        if(element.href.endsWith(".mp3")){
            //console.log(element.href.split(`/${folder}/`)[1])
            //songs.push(element.href.split(`/${folder}/`)[1])
            const filePathParts = element.href.split('/');
            const songName = filePathParts[filePathParts.length - 1];
            songs.push(songName);
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="./images/music.svg" alt="">
        <div class="info">
            <div class="">${song}</div>
            <div class="artist">Unknown</div>
        </div>
        <div class="playNow">
            <!-- <span>Play Now</span> -->
            <img class="invert" src="./images/play.svg" alt="Play now">
        </div></li>`;
    }

    // var audio = new Audio(songs[2]);
    // let playButton = document.querySelector(".playButton");
    // playButton.addEventListener('click', ()=>{
    //     audio.play()
    // })

    //attach event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

    return songs;
}


let playMusic = (track, pause = false) =>{
    currSong.src = `/${curFolder}/` + track;
    if(!pause){
        currSong.play();
        let play = document.querySelector("#playbtn")
        play.src = "./images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00 : 00"
}


function secondsToTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Using padStart to add leading zeros
    var minutesString = String(minutes).padStart(2, '0');
    var secondsString = String(remainingSeconds).padStart(2, '0');

    return minutesString + ":" + secondsString;
}


async function displayAlbums(){
    let a = await fetch(`/songs/`);
    let response = await a.text()
    //console.log(response)
    let div  = document.createElement('div')
    div.innerHTML = response
    let allA = div.getElementsByTagName("a");
    //console.log(allA)
    
    let album;
    let array = Array.from(allA);
        //console.log(e)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("songs/")){
            //console.log(e.href.split("songs/")[1]);
            album = e.href.split("songs/")[1];
            let a = await fetch(`/songs/${album}/info.json`);
            let response = await a.json()
            //console.log(response)
            cardContainer = document.querySelector(".cardContainer");
            cardContainer.innerHTML = cardContainer.innerHTML +
            `<div data-folder="${album}" class="card">
                <div class="play">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round">
                        <path fill="#000"
                            d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" />
                    </svg>
                </div>

                <img src="/songs/${album}/cover.jpg" alt="" />
                <h2>${response.title}</h2>
                <p>${response.description}</p>


            </div>`
        }
    }

    //load playlist when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            //console.log(item.currentTarget.dataset.folder)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`) 
            //console.log(songs) 
            //album = item.currentTarget.dataset.folder
            //console.log(album)
            playMusic(songs[0])  
        })
    })

    //eventlistener for previous
    document.querySelector("#previous").addEventListener("click", ()=>{
        console.log(songs)
        //console.log("Clicked previous")
        console.log(currSong.src.split(`/songs/${album}/`)[1])
        
        let index = songs.indexOf(currSong.src.split(`/songs/${album}/`)[1])
        console.log(index)
        if(index-1 >= 0){
            playMusic(songs[index-1]);
        }
    })

    //eventlistener for next
    document.querySelector("#next").addEventListener("click", ()=>{
        //console.log("Clicked next")
        //console.log(currSong.src)
        //console.log(`${album}`)
        //console.log(currSong.src.split(`/songs/${album}/`)[1])
        let index = songs.indexOf(currSong.src.split(`/songs/${album}/`)[1])
        //console.log(index)
        if(index+1 < songs.length){
            playMusic(songs[index+1]);
        }
    })
    
}

async function main(){

    await getSongs("songs/no_copyright")
    //console.log(songs)
    playMusic(songs[0], true);

    //attach event listener to prev, next and play
    let play = document.querySelector("#playbtn")
    play.addEventListener("click", ()=>{
        if(currSong.paused){
            currSong.play()
            play.src = "./images/pause.svg"
        }
        else{
            currSong.pause()
            play.src = "./images/play.svg"
        }
    })

    //time update
    currSong.addEventListener("timeupdate", ()=>{
        //console.log(currSong.currentTime, currSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToTime(currSong.currentTime)} /
        ${secondsToTime(currSong.duration)}`
        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration)*100 + "%";
    })

    //add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        //console.log(e)
        //console.log(e.target.getBoundingClientRect().width, e.offsetX)
        let percent  = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currSong.currentTime = (currSong.duration * percent)/100;
    })

    //add eventlistener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        let close = document.querySelector(".left")
        close.style.left = "-2vw"
        close.style.transition = "all 1s"
        close.style.height = "100vh"
    })

    //add eventlistener to close
    document.querySelector(".cross").addEventListener("click", ()=>{
        let close = document.querySelector(".left")
        close.style.left = "-115vw"
        close.style.transition = "all 2s"

    })

    

    //mute option
    let img = document.querySelector(".volbtn")
    img.addEventListener("click", e=>{
        if(img.src.includes("./images/volume.svg")){
            img.src = img.src.replace("./images/volume.svg", "./images/mute.svg")
            temp = currSong.volume;
            currSong.volume = 0;
            document.querySelector(".volumebar").getElementsByTagName("input")[0].value = 0;
        }
        else{
            currSong.volume = temp;
            img.src = img.src.replace("./images/mute.svg", "./images/volume.svg");
            document.querySelector(".volumebar").getElementsByTagName("input")[0].value = temp*100;
        }
    })

    //volume bar
    document.querySelector(".volumebar").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        //console.log(e.target);
        currSong.volume = parseInt(e.target.value)/100;
    })

    //display all the albums
    displayAlbums();


}

main()