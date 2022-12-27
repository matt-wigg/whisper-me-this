'use client';

import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

type AudioRecorderProps = {
  setResponseText: React.SetStateAction<string>;
};

const AudioRecorder: React.FC = ({
  setResponseText,
  isLoading,
  setIsLoading,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    console.log(isLoading);
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
    setIsLoading(true);
    setResponseText('');
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
      console.log(setResponseText);
      console.log(response.data.results[0].transcript.segments);
      setResponseText(response.data.results[0].transcript.segments);
      setIsLoading(false);
    } catch (error) {
      console.log('error');
      console.log(error);
      setIsLoading(false);
    }
    event.preventDefault();
  };

  return (
    <div>
      {isLoading ? (
        <LoadingButton
          loading
          loadingPosition='start'
          variant='outlined'
          size='large'
        >
          Loading
        </LoadingButton>
      ) : (
        !recording && (
          <Button
            onClick={startRecording}
            variant='contained'
            component='label'
            size='large'
            color='error'
          >
            Start Recording
          </Button>
        )
      )}
      {recording && (
        <Button
          onClick={stopRecording}
          variant='contained'
          component='label'
          size='large'
          color='error'
        >
          Stop Recording
        </Button>
      )}
      {audioBlob && !recording && !isLoading && (
        <>
          <span style={{ display: recording ? 'none' : 'block' }}>
            <audio ref={audioRef} controls />
          </span>
          <Button
            onClick={(e) => handleSubmit(e)}
            variant='contained'
            component='label'
            size='large'
            color='success'
          >
            Submit
          </Button>
        </>
      )}
    </div>
  );
};

export default AudioRecorder;
