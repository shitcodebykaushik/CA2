import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Zoom Clone';
  micOn = true;
  isLoggedIn = false;
  stream: MediaStream | null = null;
  user1Stream: MediaStream | null = null;
  user2Stream: MediaStream | null = null;
  mediaRecorder!: MediaRecorder;
  recordedChunks: Blob[] = [];
  currentUser = 1;
  isMaximized = false;

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('user1Video') user1Video!: ElementRef<HTMLVideoElement>;
  @ViewChild('user2Video') user2Video!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    if (this.isLoggedIn) {
      this.startCamera();
    }
  }

  login() {
    this.isLoggedIn = true;
    this.startCamera();
  }

  signup() {
    this.isLoggedIn = true;
    this.startCamera();
  }

  startCamera() {
    if (this.currentUser === 1) {
      this.startUserCamera('user1');
    } else if (this.currentUser === 2) {
      this.startUserCamera('user2');
    }
  }

  startUserCamera(user: string) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (user === 'user1') {
          this.user1Stream = stream;
          this.user1Video.nativeElement.srcObject = stream;
        } else if (user === 'user2') {
          this.user2Stream = stream;
          this.user2Video.nativeElement.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Error accessing webcam:', err);
      });
  }

  toggleMic() {
    let streamToToggle = this.currentUser === 1 ? this.user1Stream : this.user2Stream;
    if (!streamToToggle) return;

    this.micOn = !this.micOn;
    streamToToggle.getAudioTracks().forEach(track => {
      track.enabled = this.micOn;
    });

    alert(`Mic ${this.micOn ? 'unmuted 🎤' : 'muted 🔇'}`);
  }

  endCall() {
    if (this.user1Stream) {
      this.user1Stream.getTracks().forEach(track => track.stop());
    }

    if (this.user2Stream) {
      this.user2Stream.getTracks().forEach(track => track.stop());
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    alert('Call ended and recording saved! 📞💾');
  }

  sendEmoji() {
    alert('😊 Emoji sent to all participants!');
  }

  startScreenShare() {
    navigator.mediaDevices.getDisplayMedia({ video: true })
      .then(stream => {
        if (this.stream) {
          this.stream.getVideoTracks()[0].stop();
        }
        this.stream = stream;
        this.videoElement.nativeElement.srcObject = this.stream;
        alert('Screen sharing started!');
      })
      .catch(err => {
        console.error('Error sharing screen:', err);
        alert('Screen sharing failed. Please check permissions.');
      });
  }

  switchUser() {
    this.currentUser = this.currentUser === 1 ? 2 : 1;
    this.startCamera();
  }

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
  }
}
