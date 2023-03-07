/* eslint-disable lines-between-class-members */
/* eslint-disable camelcase */

export interface ISound {
  src: string;
  volume: number;
  loop: boolean;
}

interface ISoundConfig {
  [snd_id: string]: ISound;
}

export class Sound {
  sounds: {
    [snd_id: string]: HTMLAudioElement;
  };
  soundConfig: ISoundConfig;
  muted!: boolean;
  defaultSounds: string[];

  constructor(soundConfig: ISoundConfig, defaultSounds: string[]) {
    this.sounds = {};
    this.soundConfig = soundConfig;
    this.defaultSounds = defaultSounds;

    for (const snd_id in soundConfig) {
      if (soundConfig[snd_id]) {
        this.sounds[snd_id] = new Audio(soundConfig[snd_id].src);
        this.sounds[snd_id].volume = soundConfig[snd_id].volume;
        this.sounds[snd_id].loop = soundConfig[snd_id].loop;
      }
    }
  }

  mute() {
    for (const snd_id in this.sounds) {
      if (this.sounds[snd_id]) {
        this.sounds[snd_id].pause();
      }
    }
    this.muted = true;
  }

  unmute() {
    this.muted = false;

    for (const snd_id of this.defaultSounds) {
      this.play(snd_id);
    }
  }

  setVolume(snd_id: string, volume: number) {
    this.sounds[snd_id].volume = volume;
  }

  play(snd_id: string) {
    if (!this.muted) {
      this.sounds[snd_id].play();
    }
  }


  clean() {
    for (const snd_id in this.sounds) {
      if (this.sounds[snd_id]) {
        this.sounds[snd_id].remove();
      }
    }

    this.sounds = {};
  }

  playEmmediately(snd_id: string) {
    if (!this.muted) {
      const sound = new Audio(this.soundConfig[snd_id].src);
      sound.volume = this.soundConfig[snd_id].volume;
      sound.loop = false;

      sound.play();
    }
  }

  stop(snd_id: string) {
    this.sounds[snd_id].pause();
  }
}
