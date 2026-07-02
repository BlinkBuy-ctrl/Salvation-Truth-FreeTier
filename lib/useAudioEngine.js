import { useCallback, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { PlaybackPositionStore } from "./storage";

let audioModeConfigured = false;

async function ensureAudioMode() {
  if (audioModeConfigured) return;
  await Audio.setAudioModeAsync({
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    interruptionModeIOS: 1,
    interruptionModeAndroid: 1,
  });
  audioModeConfigured = true;
}

/**
 * Real playback engine backed by expo-av.
 * Owns exactly one Audio.Sound instance at a time so playback
 * survives navigation between tabs (the sound object lives here,
 * not inside a screen component).
 */
export function useAudioEngine() {
  const soundRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState(null);

  const onPlaybackStatusUpdate = useCallback((status) => {
    if (!status.isLoaded) {
      if (status.error) setError(status.error);
      return;
    }
    setIsBuffering(status.isBuffering);
    setPositionMillis(status.positionMillis ?? 0);
    setDurationMillis(status.durationMillis ?? 0);
    setIsPlaying(status.isPlaying);

    if (status.didJustFinish) {
      setIsPlaying(false);
      PlaybackPositionStore.clear();
    }
  }, []);

  const unloadCurrent = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch (err) {
        // sound was already unloaded/unmounted - safe to ignore
      }
      soundRef.current = null;
    }
  }, []);

  const play = useCallback(
    async (track, opts = {}) => {
      setError(null);
      try {
        await ensureAudioMode();

        if (currentTrack?.id === track.id && soundRef.current) {
          await soundRef.current.playAsync();
          return;
        }

        await unloadCurrent();
        setIsBuffering(true);
        setCurrentTrack(track);

        let startPositionMillis = 0;
        if (opts.resume) {
          const saved = await PlaybackPositionStore.get();
          if (saved?.audioId === track.id) {
            startPositionMillis = saved.positionMillis;
          }
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: track.audioUri },
          {
            shouldPlay: true,
            positionMillis: startPositionMillis,
            rate: playbackRate,
            shouldCorrectPitch: true,
          },
          onPlaybackStatusUpdate
        );

        soundRef.current = sound;
      } catch (err) {
        console.error("Audio playback failed", err);
        setError(err);
        setIsBuffering(false);
      }
    },
    [currentTrack, onPlaybackStatusUpdate, playbackRate, unloadCurrent]
  );

  const pause = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.pauseAsync();
      if (currentTrack) {
        await PlaybackPositionStore.set(currentTrack.id, positionMillis);
      }
    } catch (err) {
      console.warn("Pause failed", err);
    }
  }, [currentTrack, positionMillis]);

  const togglePlayback = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else if (soundRef.current) {
      await soundRef.current.playAsync();
    }
  }, [isPlaying, pause]);

  const seekTo = useCallback(async (millis) => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.setPositionAsync(millis);
    } catch (err) {
      console.warn("Seek failed", err);
    }
  }, []);

  const setRate = useCallback(async (rate) => {
    setPlaybackRate(rate);
    if (soundRef.current) {
      try {
        await soundRef.current.setRateAsync(rate, true);
      } catch (err) {
        console.warn("Rate change failed", err);
      }
    }
  }, []);

  const close = useCallback(async () => {
    if (currentTrack) {
      await PlaybackPositionStore.clear();
    }
    await unloadCurrent();
    setCurrentTrack(null);
    setIsPlaying(false);
    setPositionMillis(0);
    setDurationMillis(0);
  }, [currentTrack, unloadCurrent]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  return {
    currentTrack,
    isPlaying,
    isBuffering,
    positionMillis,
    durationMillis,
    playbackRate,
    error,
    play,
    pause,
    togglePlayback,
    seekTo,
    setRate,
    close,
  };
}
