import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading  } from 'ionic-angular';
import * as SpotifyWebApi from 'spotify-web-api-node';
import { Media, MediaObject } from '@ionic-native/media/ngx';

/**
 * Generated class for the PlaylistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-playlist',
  templateUrl: 'playlist.html',
})
export class PlaylistPage {

  tracks = [];
  playlistInfo = null;
  playing = false;
  spotifyApi: any;
  currentTrack: MediaObject = null;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private media: Media, private loadingCtrl: LoadingController) {
    let playlist = this.navParams.get('playlist');
    this.spotifyApi = new SpotifyWebApi();
 
    this.loadPlaylistData(playlist);
  }

  loadPlaylistData(playlist) {
    this.loading = this.loadingCtrl.create({
      content: "Loading Tracks...",
    });
    this.loading.present();
 
    this.spotifyApi.getPlaylist(playlist.owner.id, playlist.id).then(data => {
      this.playlistInfo = data;
      this.tracks = data.tracks.items;
      if (this.loading) {
        this.loading.dismiss();
      }
    });
  }

  play(item) {
    this.playing = true;
 
    this.currentTrack = this.media.create(item);
 
    this.currentTrack.onSuccess.subscribe(() => {
      this.playing = false;
    });
    this.currentTrack.onError.subscribe(error => {
      this.playing = false;
    });
 
    this.currentTrack.play();
  }

  playActiveDevice(item) {
    this.spotifyApi.play({ uris: [item.track.uri] });
  }

  stop() {
    if (this.currentTrack) {
      this.currentTrack.stop();
      this.playing = false;
    }
  }
 
  open(item) {
    window.open(item.track.external_urls.spotify, '_system', 'location=yes');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaylistPage');
  }

}
