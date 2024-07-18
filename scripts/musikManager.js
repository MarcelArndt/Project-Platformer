import { soundIsloadet } from "./assets.js";

export class MusikManager{
    constructor(defaultMusic, defaultAmbient){
        this.globalVolume = 0;
        this.currentPlayingList = [];
        this.currentMusik = defaultMusic || null;
        this.currentAmbient = defaultAmbient || null;
        this.currentTimer = 0;
        this.fadeBufferVolume = 1;
        this.currentPlaylist = [];
        }

    addNewSongToList(track , isAmbient = false){
        let newSongObject = {};
        newSongObject.name = this.generateNameOfSong(track);
        newSongObject.song = track;
        newSongObject.song.loop = true;
        newSongObject.isAmbient = isAmbient;
        newSongObject.fadingOut = false;
        newSongObject.fadingIn = false;
        newSongObject.fadingValue = 1;
        newSongObject.isPause = false;
        this.currentPlaylist.unshift(newSongObject);
    }         

    generateNameOfSong(track){
        let name = track.src.split("/");
        name = name[6].slice(name[6].lenght, -4);
        return name;
    }    

    setGlobalVolume(Volume){
        this.globalVolume = Volume;
    }

    pause(){
        this.currentPlaylist.forEach(songObj => {
            songObj.song.pause();
        });
    }

    stop(){
        this.currentPlaylist.forEach((songObj) => {
            if(!songObj.isAmbient){
                songObj.song.pause();
                songObj.song.currentTime = 0;
            }
        });
    }

    stopAll(){
        this.currentPlaylist.forEach((songObj) => {
                songObj.song.pause();
                songObj.song.currentTime = 0;
        });  
    }

    resume(){
        this.currentPlaylist.forEach(songObj => {
            songObj.song.play();
        });
    }

    play(track, isAmbient = false){
        this.addNewSongToList(track, isAmbient); 
        this.currentPlaylist[0].song.volume = Math.abs(0.65 * this.globalVolume);
        this.currentPlaylist[0].song.play();
    }

    setNewMusik(newTrack){
        this.currentPlaylist.forEach((songObj) => {
            if(!songObj.isAmbient){
                songObj.fadingOut = true;
            }
        });
        this.addNewSongToList(newTrack); 
        this.currentPlaylist[0].song.volume = 0;
        this.currentPlaylist[0].fadingIn = true;
    }

    updateSong(songObj, Volume, index){
        if(!songObj.fadingIn && !songObj.fadingOut && !songObj.isPause){
            songObj.song.volume = Math.abs(0.65 * Volume * songObj.fadingValue);
        }
    }

    fadingOut(songObj, index){
        if( songObj.song.volume > 0.003){
            songObj.song.volume -= 0.003
        } else if( songObj.song.volume <= 0.003){
            songObj.song.pause();
            songObj.isPause = true;
            this.currentPlaylist.splice(index, 1)
        }
    }

    fadingIn(songObj, Volume){
        if(songObj.song.paused){
            songObj.song.play();
        }
        if(songObj.song.volume <= Math.abs(0.65 * Volume) && songObj.song.volume < 1){
            songObj.song.volume += 0.003;
        } else if( songObj.song.volume >= 1 || songObj.song.volume >= Math.abs(0.65 * Volume)) {
            songObj.song.volume = Math.abs(0.65 * Volume);
            songObj.fadingIn = false;
        }
    }

    update(Volume){
        this.setGlobalVolume(Volume)
        this.currentPlaylist.forEach((songObj, index) => {
            this.updateSong(songObj, Volume, index);
            if(songObj.fadingOut){
                this.fadingOut(songObj, index);
            }
            if(songObj.fadingIn){
                this.fadingIn(songObj, Volume);
            }
        });
    }
}