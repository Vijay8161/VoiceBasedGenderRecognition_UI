"use client"

import { useState, useRef } from "react"
import axios from "axios"
import "./AudioUpload.css"

function AudioUpload() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioURL, setAudioURL] = useState(null)
  const chunksRef = useRef([])

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setResult(null)
    setAudioURL(null)
  }

  const handleRecord = async () => {
    setResult(null)
    setAudioURL(null)

    if (!recording) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mimeType = MediaRecorder.isTypeSupported("audio/wav") ? "audio/wav" : "audio/webm"
        const recorder = new MediaRecorder(stream, { mimeType })
        chunksRef.current = []

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data)
        }

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: mimeType })
          const extension = mimeType === "audio/wav" ? "wav" : "webm"
          const recordedFile = new File([blob], `recorded.${extension}`, { type: mimeType })

          setFile(recordedFile)
          setAudioURL(URL.createObjectURL(blob))
          setRecording(false)
        }

        recorder.start()
        setMediaRecorder(recorder)
        setRecording(true)

        setTimeout(() => recorder.stop(), 5000)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axios.post("https://voicebasedgenderrecognition-models.onrender.com", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setResult(res.data)
    } catch (err) {
      setResult({ error: "Prediction failed." })
    }
    setLoading(false)
  }

  return (
    <div className="audio-upload-container">
      <div className="upload-section">
        <h2 className="section-title">Upload or Record Audio</h2>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="input-group">
            <label htmlFor="audio-file" className="file-label">
              Choose Audio File
            </label>
            <input
              id="audio-file"
              type="file"
              accept=".mp3,.wav,.m4a,.flac,.ogg"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          <div className="record-section">
            <button
              type="button"
              onClick={handleRecord}
              className={`record-btn ${recording ? "recording" : ""}`}
              disabled={recording}
            >
              {recording ? "🔴 Recording..." : "🎤 Record Audio"}
            </button>
          </div>

          {audioURL && (
            <div className="audio-preview">
              <audio controls src={audioURL} className="audio-player" />
            </div>
          )}

          <button type="submit" disabled={loading || !file} className="predict-btn">
            {loading ? "🔄 Predicting..." : "🎯 Predict Gender"}
          </button>
        </form>

        <div className="file-note">
          <p>
            📝 <strong>Note:</strong> Only .mp3, .wav, .m4a, .flac, and .ogg files are accepted
          </p>
        </div>
      </div>

      {result && (
        <div className="results-section">
          <h3 className="results-title">🎉 Results</h3>
          {result.error ? (
            <div className="error-message">
              <p>❌ {result.error}</p>
            </div>
          ) : (
            <div className="success-results">
              <div className="prediction-details">
                <p>
                  <strong>Model Predictions:</strong> {result.predictions.join(", ")}
                </p>
                <p className="final-prediction">
                  <strong>Final Prediction:</strong>
                  <span className="prediction-value">{result.final}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AudioUpload
