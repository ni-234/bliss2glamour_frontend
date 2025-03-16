import {
  useEffect,
  useState,
  MouseEventHandler,
  useRef,
  useCallback,
} from "react";

type AudioHookReturn = [
  boolean,
  boolean,
  MouseEventHandler<HTMLElement>,
  (newUrl: string) => void
];

const AUDIO_STATE_KEY = "audioPlayerState";

export const useAudio = (initialUrl?: string): AudioHookReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioSet, setIsAudioSet] = useState<boolean>(false);

  const [playing, setPlaying] = useState<boolean>(() => {
    const storedState = localStorage.getItem(AUDIO_STATE_KEY);
    return storedState ? JSON.parse(storedState).playing : false;
  });

  const handleEnded = useCallback(() => {
    if (audioRef.current && playing) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, [playing]);

  useEffect(() => {
    const storedState = localStorage.getItem(AUDIO_STATE_KEY);
    const url = storedState ? JSON.parse(storedState).url : initialUrl;

    if (url) {
      audioRef.current = new Audio(url);
      audioRef.current.addEventListener("ended", handleEnded);
      setIsAudioSet(true);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [handleEnded, initialUrl]);

  const updateAudioSource = (newUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener("ended", handleEnded);
    }

    audioRef.current = new Audio(newUrl);
    audioRef.current.addEventListener("ended", handleEnded);
    setIsAudioSet(true);

    const newState = { url: newUrl, playing };
    localStorage.setItem(AUDIO_STATE_KEY, JSON.stringify(newState));

    if (playing) {
      audioRef.current.play();
    }
  };

  const toggle: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);

    const newState = {
      url: audioRef.current.src,
      playing: !playing,
    };
    localStorage.setItem(AUDIO_STATE_KEY, JSON.stringify(newState));
  };

  useEffect(() => {
    if (!audioRef.current) return;

    if (playing) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Audio playback error:", error);
          setPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [handleEnded]);

  return [playing, isAudioSet, toggle, updateAudioSource];
};
