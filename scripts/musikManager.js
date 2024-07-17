import { soundIsloadet } from "./assets.js";

export class MusikManager{
    constructor(defaultMusic, defaultAmbient){
        this.globalVolume = 0;
        this.currentPlayingList = [];
        this.currentMusik = defaultMusic || null;
        this.currentAmbient = defaultAmbient || null;
        this.currentTimer = 0;
        this.fadeBufferVolume = 1;
        this.backfadeIn = false;
        this.switchToNewTrack = false;
        this.newTrack = null;
        this.isAlreadyInSwitch = false;
        }

    setGlobalVolume(Volume){
        this.globalVolume = Volume;
    }

    pause(){
             if(this.currentMusik.volume >= 0){
                this.currentMusik.volume = 0;
                this.currentMusik.pause();
             }
    }

    stop(){
        if(this.currentMusik.volume >= 0){
            this.pause()
            this.currentMusik.currentTime = 0;
         }
    }

    resume(){
        if(this.currentMusik.paused){
            this.currentMusik.play();
        }
    }

    play(track){
            track.volume = 0.75 * this.globalVolume;
            this.currentMusik = track;
            this.currentMusik.loop = true;
            this.currentMusik.play();
    }

    setNewMusik(newTrack){
        this.switchToNewTrack = true;
        this.newTrack = newTrack;
    }

    switchMusik(){
        if(!this.switchToNewTrack && !this.backfadeIn && !this.isAlreadyInSwitch) return;
        this.isAlreadyInSwitch = true;
        this.fadeOut();
        this.fadeIn();
    }

    fadeOut(){
        if(this.fadeBufferVolume > 0 && !this.backfadeIn){
            this.fadeBufferVolume -= 0.01
        } else if(this.fadeBufferVolume <= 0){
            this.fadeBufferVolume = 0;
            this.currentMusik.pause();
            this.backfadeIn = true;
        }
    }

    fadeIn(){
        if(this.backfadeIn){
            this.currentMusik.pause();
            this.currentMusik = this.newTrack;
            this.currentMusik.play();
            this.currentMusik.loop = true;
            if(this.fadeBufferVolume < 1){
                this.fadeBufferVolume += 0.01
            } else {
                this.switchToNewTrack = false;
                this.backfadeIn = false;
                this.isAlreadyInSwitch = false;
            }
        }
    }

    update(Volume, deltaTime){
        this.setGlobalVolume(Volume)
        this.currentMusik.volume = Math.abs(0.65 * Volume * this.fadeBufferVolume);
        this.switchMusik(this.newTrack, deltaTime / 1000);
    }
}