'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onComplete?: () => void;
  autoplay?: boolean;
  className?: string;
}

export function VideoPlayer({
  videoUrl,
  title,
  onComplete,
  autoplay = false,
  className,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedSettings, setShowSpeedSettings] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  // Handle progress change (seeking)
  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    if (videoRef.current && duration) {
      const newTime = (newProgress / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(newProgress);
    }
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        duration,
        videoRef.current.currentTime + 10
      );
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen?.()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
      document.exitFullscreen?.()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
    }
  };

  // Change playback speed
  const changePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedSettings(false);
    }
  };

  // Auto-hide controls after inactivity
  const showControlsTemporarily = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime;
      const newProgress = (newTime / duration) * 100;
      setCurrentTime(newTime);
      setProgress(newProgress);
      
      // Check if video is completed (consider it complete when within 1 second of the end)
      if (newTime >= duration - 1 && !isCompleted) {
        setIsCompleted(true);
        onComplete?.();
      }
    }
  };

  // Handle metadata loaded
  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (autoplay) {
        videoRef.current.play()
          .catch((error) => {
            console.error('Autoplay failed:', error);
            setIsPlaying(false);
          });
      }
    }
  };

  // Handle waiting/buffering
  const handleWaiting = () => {
    setIsBuffering(true);
  };

  // Handle playing after buffering
  const handlePlaying = () => {
    setIsBuffering(false);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle events if the video player is focused or in fullscreen
      if (!playerRef.current?.contains(document.activeElement) && !isFullscreen) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowright':
          e.preventDefault();
          skipForward();
          break;
        case 'arrowleft':
          e.preventDefault();
          skipBackward();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          e.preventDefault();
          if (videoRef.current) {
            const percent = parseInt(e.key) * 10;
            videoRef.current.currentTime = (duration * percent) / 100;
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, isFullscreen, duration]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Detect fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={playerRef}
      className={cn(
        "relative rounded-lg overflow-hidden bg-black aspect-video group",
        className
      )}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      tabIndex={0} // Make the player focusable for keyboard shortcuts
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleMetadataLoaded}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        playsInline
      />
      
      {/* Video title */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 text-white transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      
      {/* Completed overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
          <CheckCircle2 className="h-16 w-16 text-green-400 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Workout Completed!</h3>
          <p className="text-white/80 mb-6">Great job on finishing this session</p>
          <div className="flex space-x-4">
            <Button onClick={() => {
              setIsCompleted(false);
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play();
                setIsPlaying(true);
              }
            }}>
              Watch Again
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
              Next Session
            </Button>
          </div>
        </div>
      )}
      
      {/* Buffering indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
      )}
      
      {/* Play/Pause button (big center button) */}
      {!isCompleted && !isPlaying && (
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full bg-primary/90 flex items-center justify-center text-white hover:bg-primary transition-colors"
          onClick={togglePlay}
        >
          <Play className="h-10 w-10" />
        </button>
      )}
      
      {/* Controls bar */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent px-4 py-6 transition-opacity duration-300 flex flex-col",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress bar */}
        <div className="flex items-center mb-2">
          <Slider
            min={0}
            max={100}
            step={0.1}
            value={[progress]}
            onValueChange={handleProgressChange}
            className="flex-grow h-1 mx-2"
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Play/Pause button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            {/* Skip back button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={skipBackward}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            {/* Skip forward button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={skipForward}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            
            {/* Time display */}
            <div className="text-white text-sm ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Volume control */}
            <div 
              className="flex items-center group relative"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              {showVolumeSlider && (
                <div className="absolute bottom-full left-0 bg-black/80 p-2 rounded-md mb-1 w-32">
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    className="w-28 h-1"
                  />
                </div>
              )}
            </div>
            
            {/* Playback speed */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-white hover:bg-white/20 text-xs"
                onClick={() => setShowSpeedSettings(!showSpeedSettings)}
              >
                {playbackSpeed}x
              </Button>
              
              {showSpeedSettings && (
                <div className="absolute bottom-full right-0 bg-black/80 p-2 rounded-md mb-1 w-32">
                  <div className="flex flex-col space-y-1">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                      <button
                        key={speed}
                        className={`text-xs py-1 px-2 text-left rounded hover:bg-white/20 ${
                          speed === playbackSpeed ? 'bg-white/20' : ''
                        }`}
                        onClick={() => changePlaybackSpeed(speed)}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Settings button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            {/* Fullscreen button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}