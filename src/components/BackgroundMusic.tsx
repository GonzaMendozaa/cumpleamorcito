'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

const VIDEO_ID = '6Xp7W6BLlS8'

export default function BackgroundMusic() {
  const playerRef = useRef<any>(null)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    function initPlayer() {
      playerRef.current = new window.YT.Player('yt-bg-player', {
        height: '1',
        width: '1',
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: VIDEO_ID,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (e: any) => {
            e.target.setVolume(50)
            e.target.playVideo()
          },
          onStateChange: (e: any) => {
            setPlaying(e.data === 1)
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
    }
  }, [])

  function handleClick() {
    const p = playerRef.current
    if (!p) return
    if (!playing) {
      p.playVideo()
      p.unMute()
      setMuted(false)
      return
    }
    if (muted) {
      p.unMute()
      setMuted(false)
    } else {
      p.mute()
      setMuted(true)
    }
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: -300,
          left: -300,
          width: 1,
          height: 1,
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <div id="yt-bg-player" />
      </div>

      <button
        className="music-btn"
        onClick={handleClick}
        title={muted ? 'Activar música' : 'Silenciar música'}
      >
        <span className="music-btn-icon">{muted ? '🔇' : '🎵'}</span>
        <span className="music-btn-label">{!playing ? 'PLAY' : muted ? 'MUTED' : 'MUSIC'}</span>
      </button>
    </>
  )
}
