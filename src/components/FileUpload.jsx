import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import AnalysisResult from "./AnalysisResult";

const FileUpload = ({ setAnalysisResult }) => {
    const [files, setFiles] = useState([]); // State to hold uploaded files
    const [loading, setLoading] = useState(false);
    const [analysisData, setAnalysisData] = useState([]); // State to hold analysis results

    // Handle file drop
    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length + files.length > 2) {
            alert("Please upload only two files.");
            return;
        }
        setFiles([...files, ...acceptedFiles]);
    };

    // Handle file analysis
    const analyzeFiles = async () => {
        if (files.length !== 2) {
            alert("Please upload exactly two files to create a mashup.");
            return;
        }

        setLoading(true);

        try {
            let tempAnalysisData = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await axios.post("http://localhost:8000/analyze", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                // Check if the response contains expected fields
                if (response.data.bpm && response.data.key && response.data.genre) {
                    tempAnalysisData.push(response.data);
                } else {
                    alert("Unexpected response format.");
                }
            }

            // Update analysis result state
            setAnalysisData(tempAnalysisData);
            setAnalysisResult(tempAnalysisData);
        } catch (err) {
            console.error("Error analyzing files:", err);
            alert("Failed to analyze the files.");
        } finally {
            setLoading(false);
        }
    };

    const createMashup = async () => {
        if (files.length !== 2) {
            alert("Please upload exactly two files to create a mashup.");
            return;
        }
    
        setLoading(true);
    
        const formData = new FormData();
        formData.append("file1", files[0]);
        formData.append("file2", files[1]);
        formData.append("bpm1", String(analysisData[0].bpm));
        formData.append("bpm2", String(analysisData[1].bpm));
        formData.append("key1", analysisData[0].key);
        formData.append("key2", analysisData[1].key);
    
        try {
            const response = await axios.post("http://localhost:8000/mashup", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            const { mashup_path } = response.data;
    
            // Initiate download of the mashup
            const link = document.createElement("a");
            link.href = `http://localhost:8000/${mashup_path}`;
            link.download = "mashup.wav";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            alert("Mashup created and downloaded successfully!");
        } catch (error) {
            console.error("Error creating mashup:", error);
            alert("Failed to create the mashup.");
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
        accept: ".mp3"
    });

    return (
        <div className="upload-container">
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                {loading ? (
                    <p>Processing...</p>
                ) : (
                    <p>Drag and drop up to 2 files here, or click to select files</p>
                )}
            </div>
            <div className="file-list">
                {files.map((file, index) => (
                    <p key={index}>{file.name}</p>
                ))}
            </div>
            <button onClick={analyzeFiles} disabled={loading || files.length !== 2}>
                Analyze Files
            </button>
            <AnalysisResult analysis={analysisData} createMashup={createMashup} />
        </div>
    );
};

export default FileUpload;
