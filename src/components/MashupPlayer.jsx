// src/components/MashupPlayer.js
import React, { useState } from "react";
import axios from "axios";  // Import axios

const MashupPlayer = ({ analysis }) => {
    const [mashupUrl, setMashupUrl] = useState(null);

    const createMashup = async () => {
        if (!analysis) return;
        
        // Placeholder: Implement backend logic for mashup creation
        try {
            const response = await axios.post("http://localhost:8000/create-mashup", analysis);
            setMashupUrl(response.data.mashupUrl);
        } catch (err) {
            console.error("Error creating mashup:", err);
            alert("Failed to create mashup.");
        }
    };

    return (
        <div className="mashup-player">
            <button onClick={createMashup} disabled={!analysis}>
                Generate Mashup
            </button>
            {mashupUrl && (
                <div>
                    <h3>Your Mashup</h3>
                    <audio controls src={mashupUrl} />
                </div>
            )}
        </div>
    );
};

export default MashupPlayer;
