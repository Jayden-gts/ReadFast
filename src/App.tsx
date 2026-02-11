import { useState } from 'react'
import './App.css'
import FileUploader from './utils/fileUploader'

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
    <>
      <FileUploader onFileProcessed={handleFileProcessed} onFileRemoved={handleFileRemoved} />
      <div className="file-content">
        <div >{fileName}</div>
        <pre>{fileText}</pre>
      </div>
    </>
  )
}

export default App
