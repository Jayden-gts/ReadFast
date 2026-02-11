import { useState } from 'react'
import './App.css'
import FileUploader from './utils/fileUploader'

import WordDisplay from './components/WordDisplay';

function App() {

  const [fileText, setFileText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');


  const handleFileProcessed = (text: string, fileName: string) => {
    console.log(`File processed: ${fileName}`);
    console.log('Extracted text:', text);
    setFileText(text);
    setFileName(fileName);
  }

  const handleFileRemoved = () => {
    setFileText('');
    setFileName('');
  }

  return (
    <div className="app">
      <div className='container'>
        <h1>Train Your Reading Speed</h1>
        <FileUploader onFileProcessed={handleFileProcessed} onFileRemoved={handleFileRemoved} />
        {fileText && (
                    <>
                        <div className="file-info-banner">
                            <span>📄 Reading: <strong>{fileName}</strong></span>
                        </div>
                        
                        <WordDisplay text={fileText} />
                    </>
                )}
      </div>
      
    </div>
  )
}

export default App
