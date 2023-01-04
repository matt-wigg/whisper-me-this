'use client';

import { Button, FormControl, Select } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState, useRef, SetStateAction } from 'react';
import axios from 'axios';
import DataTable from './dataTable';
import AudioRecorder from './audioRecorder';

type LanguageCodes = 'en' | 'zh' | 'de' | 'es' | 'ru' | 'ko' | 'fr' | 'ja' | 'pt' | 'tr' | 'pl' | 'ca' | 'nl' | 'ar' | 'sv' | 'it' | 'id' | 'hi' | 'fi' | 'vi' | 'he' | 'uk' | 'el' | 'ms' | 'cs' | 'ro' | 'da' | 'hu' | 'ta' | 'no' | 'th' | 'ur' | 'hr' | 'bg' | 'lt' | 'la' | 'mi' | 'ml' | 'cy' | 'sk' | 'te' | 'fa' | 'lv' | 'bn' | 'sr' | 'az' | 'sl' | 'kn' | 'et' | 'mk' | 'br' | 'eu' | 'is' | 'hy' | 'ne' | 'mn' | 'bs' | 'kk' | 'sq' | 'sw' | 'gl' | 'mr' | 'pa' | 'si' | 'km' | 'sn' | 'yo' | 'so' | 'af' | 'oc' | 'ka' | 'be' | 'tg' | 'sd' | 'gu' | 'am' | 'yi' | 'lo' | 'uz' | 'fo' | 'ht' | 'ps' | 'tk' | 'nn' | 'mt' | 'sa' | 'lb' | 'bo' | 'tl' | 'mg' | 'as' | 'tt' | 'haw' | 'ln' | 'ha' | 'ba' | 'jw' | 'su';

const Languages: Record<LanguageCodes, string>  = {
  en: 'English',
  zh: 'Chinese',
  de: 'German',
  es: 'Spanish',
  ru: 'Russian',
  ko: 'Korean',
  fr: 'French',
  ja: 'Japanese',
  pt: 'Portuguese',
  tr: 'Turkish',
  pl: 'Polish',
  ca: 'Catalan',
  nl: 'Dutch',
  ar: 'Arabic',
  sv: 'Swedish',
  it: 'Italian',
  id: 'Indonesian',
  hi: 'Hindi',
  fi: 'Finnish',
  vi: 'Vietnamese',
  he: 'Hebrew',
  uk: 'Ukrainian',
  el: 'Greek',
  ms: 'Malay',
  cs: 'Czech',
  ro: 'Romanian',
  da: 'Danish',
  hu: 'Hungarian',
  ta: 'Tamil',
  no: 'Norwegian',
  th: 'Thai',
  ur: 'Urdu',
  hr: 'Croatian',
  bg: 'Bulgarian',
  lt: 'Lithuanian',
  la: 'Latin',
  mi: 'Maori',
  ml: 'Malayalam',
  cy: 'Welsh',
  sk: 'Slovak',
  te: 'Telugu',
  fa: 'Persian',
  lv: 'Latvian',
  bn: 'Bengali',
  sr: 'Serbian',
  az: 'Azerbaijani',
  sl: 'Slovenian',
  kn: 'Kannada',
  et: 'Estonian',
  mk: 'Macedonian',
  br: 'Breton',
  eu: 'Basque',
  is: 'Icelandic',
  hy: 'Armenian',
  ne: 'Nepali',
  mn: 'Mongolian',
  bs: 'Bosnian',
  kk: 'Kazakh',
  sq: 'Albanian',
  sw: 'Swahili',
  gl: 'Galician',
  mr: 'Marathi',
  pa: 'Punjabi',
  si: 'Sinhala',
  km: 'Khmer',
  sn: 'Shona',
  yo: 'Yoruba',
  so: 'Somali',
  af: 'Afrikaans',
  oc: 'Occitan',
  ka: 'Georgian',
  be: 'Belarusian',
  tg: 'Tajik',
  sd: 'Sindhi',
  gu: 'Gujarati',
  am: 'Amharic',
  yi: 'Yiddish',
  lo: 'Lao',
  uz: 'Uzbek',
  fo: 'Faroese',
  ht: 'Haitian Creole',
  ps: 'Pashto',
  tk: 'Turkmen',
  nn: 'Nynorsk',
  mt: 'Maltese',
  sa: 'Sanskrit',
  lb: 'Luxembourgish',
  bo: 'Tibetan',
  tl: 'Tagalog',
  mg: 'Malagasy',
  as: 'Assamese',
  tt: 'Tatar',
  haw: 'Hawaiian',
  ln: 'Lingala',
  ha: 'Hausa',
  ba: 'Bashkir',
  jw: 'Javanese',
  su: 'Sundanese',
};

const FileUploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | any>(null);
  const [responseText, setResponseText] = useState<Array<[]> | any>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedModelSize, setSelectedModelSize] = useState('base');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle changes to the language and model size select inputs
  const handleLanguageChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedLanguage(event.target.value);
  };
  const handleModelSizeChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedModelSize(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSelectedFile(null);
    setResponseText('');
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const url = `https://ec2-13-56-241-48.us-west-1.compute.amazonaws.com:8000/test/${selectedLanguage}/${selectedModelSize}`;
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
      <div style={{ paddingBottom: '0.5rem' }}>
        <FormControl>
          <label
            htmlFor='model-size-select'
            style={{ paddingBottom: '0.5rem' }}
          >
            Model Size
          </label>
          <Select
            native
            id='model-size-select'
            size='small'
            name='model-size'
            value={selectedModelSize}
            onChange={handleModelSizeChange}
          >
            <option value='tiny'>Tiny</option>
            <option value='base'>Base</option>
            <option value='small'>Small</option>
            <option value='medium'>Medium</option>
            <option value='large'>Large</option>
          </Select>
        </FormControl>
        <FormControl style={{ paddingLeft: '0.5rem' }}>
          <label htmlFor='language-select' style={{ paddingBottom: '0.5rem' }}>
            Language Output:
          </label>
          <Select
            native
            id='language-select'
            name='language'
            size='small'
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(Languages).map((key) => (
              <option key={key} value={key}>
                {Languages[key as LanguageCodes]}
              </option>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <FormControl>
            {isLoading ? (
              <LoadingButton
                loading
                loadingPosition='start'
                variant='outlined'
                size='large'
              >
                Decoding File
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
      </div>
      <div style={{ paddingTop: '0.5em' }}>
        <AudioRecorder
          setResponseText={setResponseText}
          selectedLanguage={selectedLanguage}
          selectedModelSize={selectedModelSize}
        />
      </div>
      {responseText && <DataTable data={responseText} />}
    </>
  );
};

export default FileUploadPage;
