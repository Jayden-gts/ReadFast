import React, { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { parseFile, isValidFileType } from './fileParser';
import './FileUploader.css';

interface FileUploaderProps {
    onFileProcessed?: (text: string, fileName: string) => void;
    onFileRemoved?: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileProcessed, onFileRemoved }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragCounter, setDragCounter] = useState(0);

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
        setDragCounter(prev => prev + 1);
    };
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCounter(prev => {
        const newCount = prev - 1;
        if (newCount === 0) {
            setIsDragging(false);
        }
        return newCount;
    });
};
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setDragCounter(0);  
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFile(files[0]);
};
    const handleBrowseClick = () => fileInputRef.current?.click();
    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) handleFile(files[0]);
    };
    const handleFile = async (file: File) => {
        setError(null);
        if (!isValidFileType(file)) {
            setError('Invalid file type. Please upload PDF or TXT files.');
            return;
        }
        setUploadedFile(file);
        setIsProcessing(true);
        try {
            const text = await parseFile(file);
            onFileProcessed?.(text, file.name);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsProcessing(false);
        }
    };
    const handleRemoveFile = () => {
        setUploadedFile(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onFileRemoved?.();
    };

    return (
        <div className="file-uploader-container">
            <div
                className={`upload-area ${isDragging ? 'dragging' : ''} ${uploadedFile ? 'has-file' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                />
                {!uploadedFile ? (
                    <div className="upload-prompt">
                        <h3>Drag & Drop your file here</h3>
                        <p>or</p>
                        <button className="browse-button" onClick={handleBrowseClick}>Browse Files</button>
                        <p className="file-types">Supported formats: PDF, TXT</p>
                    </div>
                ) : (
                    <div className="file-info">
                        <div className="file-details">
                            <h4>{uploadedFile.name}</h4>
                            <p>{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <button className="remove-button" onClick={handleRemoveFile}>X</button>
                    </div>
                )}
                {isProcessing && (
                    <div className="processing-overlay">
                        <div className="spinner"></div>
                        <p>Processing file...</p>
                    </div>
                )}
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default FileUploader;
