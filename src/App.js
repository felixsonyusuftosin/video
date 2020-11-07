import './App.css'
import React, { useRef, useEffect, useState } from 'react'

const videoFormats = [
  'mp4',
  'avi',
  'mov',
  'mpg',
  'wmv',
  'flv',
  'webm',
  'mkv',
  'ogv',
  '3gp',
  '3g2'
]
const audioFormats = ['mp3', 'wav', 'flac', 'ogg']

function App() {
  const fileInput = useRef()
  const [tmpPath, setTmpPath] = useState('')
  const [isVideo, setIsVideo] = useState(true)
  const [notSupported, setNotSuported] = useState(false)
  const [extension, setExt] = useState('')
  const [linkVisible, setLinkVisible] = useState(null)
  const [streamingLink, setStreamingLink] = useState('')

  const selectImage = () => {
    if (fileInput.current) {
      document.getElementById('filepicker').click()
    }
  }
  useEffect(() => {
    if (streamingLink) {
      const extArray = streamingLink.split('.')
      const ext = extArray[extArray.length - 1]
      setExtension(ext)
      setTmpPath(streamingLink)
    }
  }, [streamingLink])
  const setExtension = ext => {
    setExt(ext)
    const isVideoFile = videoFormats.includes(ext)
    const isAudioFile = audioFormats.includes(ext)
    if (isVideoFile) {
      setIsVideo(true)
    } else if (isAudioFile) {
      setIsVideo(false)
    } else {
      setNotSuported(true)
    }
  }
  const handleImageSelected = e => {
    try {
      const { files } = e.target
      const firstFile = files[0]
      const { name } = firstFile
      const extArray = name.split('.')
      const ext = extArray[extArray.length - 1]
      setExtension(ext)
      const temp = URL.createObjectURL(firstFile)
      setTmpPath(() => temp)
    } catch (err) {
      console.error(err.message)
    }
  }

  useEffect(() => {
    if (tmpPath && isVideo) {
      const src = document.getElementById('videoSource')
      src.setAttribute('src', tmpPath)
    } else if (tmpPath && !isVideo && !notSupported) {
      const src = document.getElementById('audioSource')
      src.setAttribute('src', tmpPath)
    }
  }, [tmpPath, isVideo, notSupported])

  return (
    <div className='container'>
      <div className='video-container'>
        {tmpPath && isVideo && (
          <video className='video' controls>
            <source
              id='videoSource'
              src={tmpPath}
              type={`video/${extension}`}
            />
            Your browser does not support the video tag.
          </video>
        )}
        {tmpPath && !isVideo && !notSupported && (
          <audio className='audio' controls>
            <source
              id='audioSource'
              src={tmpPath}
              type={`audio/${extension}`}
            />
            Your browser does not support the video tag.
          </audio>
        )}
        {tmpPath && !isVideo && notSupported && (
          <h1> Sorry this video format is not supported ...</h1>
        )}
      </div>
      <div className='button-row'>
        <button onClick={selectImage}>Upload </button>
        <button onClick={() => setLinkVisible(true)}>Paste link</button>
        {linkVisible && (
          <input
            className='input'
            value={streamingLink}
            onChange={e => setStreamingLink(e.target.value)}
            type='text'
            placeholder='Link to stream'
          />
        )}
        <input
          type='file'
          accept='video/mp4,video/x-m4v,video/*,audio/*'
          ref={fileInput}
          onChange={handleImageSelected}
          id='filepicker'
          name='select'
          className='hidden'
        />
      </div>
    </div>
  )
}

export default App
