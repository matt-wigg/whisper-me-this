'use client';

import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const AudioRecorder: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (audioRef.current && audioBlob) {
      audioRef.current.src = URL.createObjectURL(audioBlob);
      return () => URL.revokeObjectURL(audioRef.current.src);
    }
  }, [audioBlob]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((s) => {
      setStream(s);
      const mediaRecorder = new MediaRecorder(s);
      setMediaRecorder(mediaRecorder);
      mediaRecorder.start();

      const audioChunks: BlobPart[] = [];
      mediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
        audioChunks.push(event.data);
        setAudioBlob(new Blob(audioChunks, { type: 'audio/webm' }));
      });

      setRecording(true);
    });
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData();
    formData.append('audio', audioBlob as Blob, 'recording.webm');

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/test/en/small',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data.results[0].transcript.segments);
    } catch (error) {
      console.log('error');
      console.log(error);
    }
    event.preventDefault();
  };

  return (
    <div>
      {!recording && (
        <button type='button' onClick={startRecording}>
          Start Recording
        </button>
      )}
      {recording && (
        <button type='button' onClick={stopRecording}>
          Stop Recording
        </button>
      )}
      {audioBlob && (
        <>

            <audio ref={audioRef} controls />

          <button onClick={(e) => handleSubmit(e)} type='submit'>
            Submit
          </button>
        </>
      )}
    </div>
  );
};

export default AudioRecorder;
