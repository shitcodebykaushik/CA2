import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Zoom Clone';
  micOn = true;
  stream: MediaStream | null = null;
  mediaRecorder!: MediaRecorder;
  recordedChunks: Blob[] = [];

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    this.startCamera();
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.stream = stream;
        this.videoElement.nativeElement.srcObject = stream;
        this.startRecording(stream);
      })
      .catch(err => {
        console.error('Error accessing webcam:', err);
      });
  }

  startRecording(stream: MediaStream) {
    this.recordedChunks = [];

    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zoom-clone-recording.webm';
      a.click();
      URL.revokeObjectURL(url);
    };

    this.mediaRecorder.start();
  }

  toggleMic() {
    if (!this.stream) return;

    this.micOn = !this.micOn;
    this.stream.getAudioTracks().forEach(track => {
      track.enabled = this.micOn;
    });

    alert(`Mic ${this.micOn ? 'unmuted 🎤' : 'muted 🔇'}`);
  }

  endCall() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop(); // Triggers onstop and saves the file
    }

    alert('Call ended and recording saved! 📞💾');
  }

  sendEmoji() {
    alert('😊 Emoji sent to all participants!');
  }
}
