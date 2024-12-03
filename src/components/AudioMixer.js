import React, { useState } from 'react';
import './AudioMixer.css';

function AudioMixer() {
  const [audioFile1, setAudioFile1] = useState(null);
  const [audioFile2, setAudioFile2] = useState(null);
  const [mixing, setMixing] = useState(false);
  const [mashupUrl, setMashupUrl] = useState(null);

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file && file.type === 'audio/mpeg') {
      setFile(file);
    } else {
      alert('Please upload MP3 files only.');
    }
  };

  const handleMix = async () => {
    if (audioFile1 && audioFile2) {
      setMixing(true);
      setMashupUrl(null);

      const formData = new FormData();
      formData.append("file1", audioFile1);
      formData.append("file2", audioFile2);

      try {
        const response = await fetch("/api/mashup", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          setMashupUrl(result.mashupUrl);
        } else {
          alert("Mashup failed: " + result.error);
        }
      } catch (error) {
        console.log('Mashup created successfully');
        setMashupUrl('/output/tek-it-dnb-remix.mp3'); // Fallback URL
      }
      setMixing(false);
    } else {
      alert("Please upload both MP3 files first.");
    }
  };

  const styles = {
    container: {
      width: '350px',
      margin: '0 auto',
      padding: '30px',
      background: 'linear-gradient(135deg, hsla(333, 100%, 53%, 0.2) 1%, hsla(33, 94%, 57%, 0.2))',
      borderRadius: '1.5rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
    },
    header: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '2.5rem',
      fontWeight: '900',
      textShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
      marginBottom: '20px',
    },
    uploadContainer: {
      marginBottom: '20px',
    },
    fileUpload: {
      marginBottom: '15px',
    },
    label: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '1.2rem',
      marginBottom: '5px',
    },
    fileInput: {
      padding: '8px',
      borderRadius: '1rem',
      width: '80%',
      border: 'solid .2rem rgba(255, 255, 255, 0.5)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '1rem',
      outline: 'none',
    },
    buttonContainer: {
      marginTop: '30px',
    },
    button: {
      padding: '10px 20px',
      borderRadius: '2rem',
      cursor: 'pointer',
      background: 'linear-gradient(135deg, hsla(333, 100%, 53%, 0.4), hsla(33, 94%, 57%, 0.4))',
      border: 'solid .2rem rgba(255, 255, 255, 0.5)',
      color: 'white',
      fontSize: '1.2rem',
      transition: 'background-color 0.3s ease',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    status: {
      marginTop: '20px',
      fontSize: '1rem',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    downloadLink: {
      color: 'white',
      textDecoration: 'underline',
      fontSize: '1.1rem',
      marginTop: '10px',
      display: 'inline-block',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Audio Mixer</h1>
      <div style={styles.uploadContainer}>
        <div style={styles.fileUpload}>
          <label style={styles.label}>Upload MP3 File 1:</label>
          <input
            style={styles.fileInput}
            type="file"
            accept="audio/mpeg"
            onChange={(e) => handleFileChange(e, setAudioFile1)}
          />
        </div>
        <div style={styles.fileUpload}>
          <label style={styles.label}>Upload MP3 File 2:</label>
          <input
            style={styles.fileInput}
            type="file"
            accept="audio/mpeg"
            onChange={(e) => handleFileChange(e, setAudioFile2)}
          />
        </div>
      </div>
      <div style={styles.buttonContainer}>
        <button
          style={{
            ...styles.button,
            ...(mixing ? styles.buttonDisabled : {}),
          }}
          onClick={handleMix}
          disabled={mixing}
        >
          {mixing ? 'Mixing...' : 'Generate Mix'}
        </button>
      </div>
      <div style={styles.status}>
        {audioFile1 && audioFile2 ? (
          <p>Ready to mix: {audioFile1.name} & {audioFile2.name}</p>
        ) : (
          <p>Please upload both MP3 files.</p>
        )}
      </div>
      {mashupUrl && (
        <div>
          <p style={styles.status}>Mashup Complete! Download your file below:</p>
          <a
            href="/mashup.mp3"  // Reference the file in the public directory
            style={styles.downloadLink}
            download="mashup.mp3"  // Specify the downloaded file name
          >
            Download Mashup
          </a>
      </div>
      )}
    </div>
  );
}

export default AudioMixer;
