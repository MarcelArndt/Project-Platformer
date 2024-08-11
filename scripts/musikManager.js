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

    /**
     * @param {object} track - give a musicObject some extra information to controll it better.
     * @param {boolean} isAmbient - importent for the changing the music later -> Ambient-Tracks won't stop by switching between songs
     * add the new Song to the current Playlist.
     */    
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

    /**
     * @param {object} track - give a musicObject a name. It will take the filename for it.
     */ 
    generateNameOfSong(track){
        let name = track.src.split("/");
        name = name[6].slice(name[6].lenght, -4);
        return name;
    }    

    /**
     * @param {number} volume - update the received volume to this Music-Manager.
     */ 
    setGlobalVolume(volume){
        this.globalVolume = volume;
    }

    /**
    * it will pause all songs in the current list.
    */ 
    pause(){
        this.currentPlaylist.forEach(songObj => {
            songObj.song.pause();
        });
    }

    /**
    * it will stop and reset all songs in the current list.
    */   
    stop(){
        this.currentPlaylist.forEach((songObj) => {
            if(!songObj.isAmbient){
                songObj.song.pause();
                songObj.song.currentTime = 0;
            }
        });
    }

    /**
    * it will stop and reset all songs in the current list.
    * Ambient Sounds will take the same effect and will stop.
    */   
    stopAll(){
        this.currentPlaylist.forEach((songObj) => {
                songObj.song.pause();
                songObj.song.currentTime = 0;
        });  
    }

    /**
    * it will stop and reset all songs in the current list.
    */ 
    resume(){
        this.currentPlaylist.forEach(songObj => {
            songObj.song.play();
        });
    }


    /**
    * Core Function to play a new song from system and build some new necessary information around the original Object.
    */ 
    play(track, isAmbient = false){
        this.addNewSongToList(track, isAmbient); 
        this.currentPlaylist[0].song.volume = Math.abs(0.65 * this.globalVolume);
        this.currentPlaylist[0].song.play();
    }

    /**
    * switch all current playing music to fading off and pause them. After this the newest Music will start.
    */ 
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


    /**
    * constantly updating the current Object/Song Volume
    */ 
    updateSong(songObj, Volume){
        if(!songObj.fadingIn && !songObj.fadingOut && !songObj.isPause){
            songObj.song.volume = Math.abs(0.65 * Volume * songObj.fadingValue);
        }
    }


    /**
     * @param {object} songObj - a current playing track in the current Playlist
     * @param {number} index - the current place/index in the current Playlist
     * if a music fading off and is to quiet it will pause the song and put it off the Playlist.
     */
    fadingOut(songObj, index){
        if( songObj.song.volume > 0.003){
            songObj.song.volume -= 0.003
        } else if( songObj.song.volume <= 0.003){
            songObj.song.pause();
            songObj.isPause = true;
            this.currentPlaylist.splice(index, 1)
        }
    }


    /**
     * @param {object} songObj - set to play the current Object if and will fading in.
     * @param {number} index - the current place/index in the current Playlist
     */
    fadingIn(songObj, Volume, index){
        if(songObj.song.paused){
            songObj.song.play();
        }
        if(songObj.song.volume <= Math.abs(0.65 * Volume) && songObj.song.volume < 1){
            songObj.song.volume += 0.003;
        } else if( songObj.song.volume >= 1 || songObj.song.volume >= Math.abs(0.65 * Volume)) {
            songObj.song.volume = Math.abs(0.65 * Volume);
            songObj.fadingIn = false;
        }
        if(songObj.fadingOut == true){
            songObj.fadingIn = false;
            this.fadingOut(songObj, index);
        }
    }


    /**
    * @param {number} volume - received from current level-update-loop and keeping update all tracks inside the Playlist
    */
    update(volume){
        this.setGlobalVolume(volume)
        this.currentPlaylist.forEach((songObj, index) => {
            this.updateSong(songObj, volume, index);
            if(songObj.fadingOut){
                this.fadingOut(songObj, index);
            }
            if(songObj.fadingIn){
                this.fadingIn(songObj, volume, index);
            }
        });
    }
}