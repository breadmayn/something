// src/components/AnalysisResult.js
import React from "react";

const AnalysisResult = ({ analysis, createMashup }) => {
    if (!analysis || analysis.length === 0) return null;

    return (
        <div className="analysis-result">
            <h3>Analysis Results</h3>
            {analysis.map((result, index) => (
                <div key={index} className="analysis-item">
                    <h4>Song {index + 1}</h4>
                    <p><strong>BPM:</strong> {result.bpm}</p>
                    <p><strong>Key:</strong> {result.key}</p>
                    <p><strong>Genre:</strong> {result.genre}</p>
                </div>
            ))}
            {analysis.length === 2 && (
                <button onClick={createMashup}>
                    Create Mashup
                </button>
            )}
        </div>
    );
};

export default AnalysisResult;
