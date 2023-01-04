'use client';

import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

type AudioRecorderProps = {
  setResponseText: React.Dispatch<React.SetStateAction<string>>;
  selectedLanguage: string;
  selectedModelSize: string;
};

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  setResponseText,
  selectedLanguage,
  selectedModelSize,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (audioRef.current && audioBlob) {
      audioRef.current.src = URL.createObjectURL(audioBlob);
      const source = audioRef.current.src
      return () => URL.revokeObjectURL(source);
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

  const handleSubmit = async (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
    setIsLoading(true);
    setResponseText('');
    const formData = new FormData();
    formData.append('audio', audioBlob as Blob, 'recording.webm');
    const url = `https://ec2-13-56-241-48.us-west-1.compute.amazonaws.com:8000/test/${selectedLanguage}/${selectedModelSize}`;
    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponseText(response.data.results[0].transcript.segments);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
    event.preventDefault();
  };

  return (
    <div>
      {!recording && !isLoading && (
        <Button
          onClick={startRecording}
          variant='contained'
          component='label'
          size='large'
          color='error'
        >
          Start Recording
        </Button>
      )}
      {recording && (
        <Button
          onClick={stopRecording}
          variant='contained'
          component='label'
          size='large'
          color='secondary'
        >
          Stop Recording
        </Button>
      )}
      {isLoading ? (
        <LoadingButton
          loading
          loadingPosition='start'
          variant='outlined'
          size='large'
        >
          Decoding Recording
        </LoadingButton>
      ) : (
        audioBlob &&
        !recording && (
          <span style={{ padding: '0.5rem' }}>
            <Button
              onClick={(e) => handleSubmit(e)}
              variant='contained'
              component='label'
              size='large'
              color='success'
            >
              Upload
            </Button>
          </span>
        )
      )}
      {audioBlob && !recording && (
        <>
          <span
            style={{
              display: recording ? 'none' : 'block',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
            }}
          >
            <audio ref={audioRef} controls />
          </span>
        </>
      )}
    </div>
  );
};

export default AudioRecorder;
