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
        const value = parseInt(e.target.value);
        if (value > 0) {
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
    const progress = words.length > 0 ? (currentWordIndex / words.length) * 100 : 0;
    const currentWpm = currentDelay > 0 ? Math.round(60000 / currentDelay) : wordsPerMinute;

    return (
        <div className="word-display-container">
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

            <div className="word-viewport">
                <div className="current-word">{currentWord}</div>
            </div>

            <div className="stats">
                <div className="stat">
                    <span className="stat-label">Progress:</span>
                    <span className="stat-value">{currentWordIndex} / {words.length} words ({progress.toFixed(1)}%)</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Current Speed:</span>
                    <span className="stat-value">{currentWpm} WPM</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Target Speed:</span>
                    <span className="stat-value">{wordsPerMinute} WPM</span>
                </div>
            </div>

            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default WordDisplay;