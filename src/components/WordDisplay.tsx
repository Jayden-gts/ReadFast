import React, { useState, useEffect, useRef } from 'react';
import './WordDisplay.css';

interface WordDisplayProps {
    text: string;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ text }) => {
    const [wordsPerMinute, setWordsPerMinute] = useState<number>(300);
    const [transitionSpeed, setTransitionSpeed] = useState<number>(5);
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentDelay, setCurrentDelay] = useState<number>(0);
    
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const intervalRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    const targetDelayMs = (60 / wordsPerMinute) * 1000; 
    const transitionMs = transitionSpeed * 1000; 

    useEffect(() => {
        if (isPlaying && currentWordIndex < words.length) {
            const elapsedTime = Date.now() - startTimeRef.current;
            
            
            let delay: number;
            if (elapsedTime < transitionMs) {
                const initialDelay = targetDelayMs * 3; 
                const progress = elapsedTime / transitionMs;
                delay = initialDelay - (initialDelay - targetDelayMs) * progress;
            } else {
                delay = targetDelayMs;
            }
            
            setCurrentDelay(delay);

            intervalRef.current = window.setTimeout(() => {
                setCurrentWordIndex(prev => prev + 1);
            }, delay);

            return () => {
                if (intervalRef.current) window.clearTimeout(intervalRef.current);
            };
        } else if (currentWordIndex >= words.length && isPlaying) {
            setIsPlaying(false);
        }
    }, [isPlaying, currentWordIndex, words.length, targetDelayMs, transitionMs]);

    const handleStart = () => {
        if (currentWordIndex >= words.length) {
            setCurrentWordIndex(0);
        }
        startTimeRef.current = Date.now();
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
        if (intervalRef.current) window.clearTimeout(intervalRef.current);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentWordIndex(0);
        if (intervalRef.current) window.clearTimeout(intervalRef.current);
    };

    const handleWpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (inputValue === '') {
            setWordsPerMinute(0); 
            return;
        }

        const value = parseInt(inputValue);
        if (!isNaN(value)) {
            setWordsPerMinute(value);
        }
    };

    const handleTransitionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (value >= 0) {
            setTransitionSpeed(value);
        }
    };

const currentWord = words[currentWordIndex] || '';

let middleIndex = 0;
if (currentWord.length > 0) {
    middleIndex = Math.max(0, Math.floor((currentWord.length - 1) / 2));
    
    if (currentWord.length > 3) {
        const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
        for (let i = Math.max(0, middleIndex - 1); i <= Math.min(currentWord.length - 1, middleIndex + 1); i++) {
            if (vowels.includes(currentWord[i])) {
                middleIndex = i;
                break;
            }
        }
    }
}

    const part1 = currentWord.substring(0, middleIndex);
    const middle = currentWord.substring(middleIndex, middleIndex + 1);
    const part2 = currentWord.substring(middleIndex + 1);
    
    return (
        <div className="word-display-container">

            <div className="word-viewport">
                <div className="center-marker"></div>
                <div className="word-container">
                    <div className="word-wrapper">
                        <span className="word-part left">{part1}</span>
                        <span className="word-part middle">{middle}</span>
                        <span className="word-part right">{part2}</span>
                    </div>
                </div>
            </div>

            <div className="controls">
                <div className="control-group">
                    <label htmlFor="wpm">Words Per Minute:</label>
                    <input
                        id="wpm"
                        type="number"
                        min="1"
                        max="1000"
                        value={wordsPerMinute}
                        onChange={handleWpmChange}
                        disabled={isPlaying}
                    />
                </div>

                <div className="control-group">
                    <label htmlFor="transition">Transition Time (seconds):</label>
                    <input
                        id="transition"
                        type="number"
                        min="0"
                        step="0.5"
                        value={transitionSpeed}
                        onChange={handleTransitionChange}
                        disabled={isPlaying}
                    />
                </div>

                <div className="button-group">
                    {!isPlaying ? (
                        <button className="control-button start" onClick={handleStart}>
                            {currentWordIndex === 0 ? 'Start' : 'Resume'}
                        </button>
                    ) : (
                        <button className="control-button pause" onClick={handlePause}>
                            Pause
                        </button>
                    )}
                    <button className="control-button reset" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </div>

            
        </div>
    );
};

export default WordDisplay;