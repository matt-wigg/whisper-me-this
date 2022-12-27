'use client';

import { Button, FormControl, Input, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState, useRef } from 'react';
import axios from 'axios';
import DataTable from './dataTable';
import AudioRecorder from './audioRecorder';

const FileUploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile || isLoading) {
      console.log('No file selected or form is read-only');
      return;
    }

    setSelectedFile(null);
    setResponseText('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
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
      setResponseText(response.data.results[0].transcript.segments);
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl>
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
            <Button
              variant='contained'
              component='label'
              disabled={isLoading}
              size='large'
            >
              {isLoading ? 'Please wait' : 'Choose File'}
              <input
                hidden
                accept='audio/*'
                multiple
                type='file'
                inputref={fileInputRef}
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </Button>
          )}
        </FormControl>
        {isLoading ? null : (
          <>
            <span
              style={{
                padding: '0.5rem',
              }}
            >
              {selectedFile?.name || ' Select file'}
            </span>
            <Button
              variant='contained'
              color='success'
              type='submit'
              size='large'
              disabled={isLoading || !selectedFile}
            >
              {!selectedFile ? 'No File' : 'Upload'}
            </Button>
          </>
        )}
      </form>
      <div style={{ paddingTop: '1rem' }}>
        <AudioRecorder
          setResponseText={setResponseText}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
      {responseText && <DataTable data={responseText} />}
    </>
  );
};

export default FileUploadPage;
