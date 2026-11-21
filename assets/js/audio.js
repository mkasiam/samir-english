/**
 * CLASS 7 AUDIO SYSTEM
 * --------------------
 * Uses browser Web Speech API (speechSynthesis) for English & Bangla playback.
 * Supports individual sentence playback, sequential full-lesson playback,
 * speed adjustment, stop control, and graceful Bangla voice fallback notices.
 */

window.Class7Audio = (function () {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  let voices = [];
  let rate = 1.0;
  let isPlayingLesson = false;
  let queueCancelled = false;

  function loadVoices() {
    if (!supported) return [];
    voices = window.speechSynthesis.getVoices() || [];
    return voices;
  }

  if (supported) {
    loadVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  function findVoice(langPrefix) {
    if (!voices.length) loadVoices();
    const prefix = langPrefix.toLowerCase();
    return (
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(prefix)) ||
      null
    );
  }

  function hasBanglaVoice() {
    return Boolean(findVoice("bn"));
  }

  function setRate(newRate) {
    const parsed = parseFloat(newRate);
    if (!Number.isNaN(parsed) && parsed >= 0.5 && parsed <= 2.0) {
      rate = parsed;
    }
  }

  function stop(onStop) {
    queueCancelled = true;
    isPlayingLesson = false;
    if (supported) {
      window.speechSynthesis.cancel();
    }
    if (typeof onStop === "function") onStop();
  }

  function speakText(text, lang, callbacks = {}) {
    if (!supported) {
      if (callbacks.onNotice) {
        callbacks.onNotice("Speech synthesis is not supported in this browser.");
      }
      return;
    }

    if (!text || !text.trim()) return;

    stop();
    queueCancelled = false;

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = lang === "bn" ? "bn-BD" : "en-US";
    utterance.lang = targetLang;
    utterance.rate = rate;

    const matchedVoice = findVoice(lang === "bn" ? "bn" : "en");
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    } else if (lang === "bn" && callbacks.onNotice) {
      callbacks.onNotice(
        "Bangla voice is not installed on this browser/device. Audio may fall back to default system speech or remain silent for Bangla text."
      );
    }

    utterance.onstart = () => {
      if (callbacks.onStart) callbacks.onStart();
    };
    utterance.onend = () => {
      if (callbacks.onEnd) callbacks.onEnd();
    };
    utterance.onerror = () => {
      if (callbacks.onEnd) callbacks.onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  function playSequence(items, callbacks = {}) {
    if (!supported) {
      if (callbacks.onNotice) {
        callbacks.onNotice("Speech synthesis is not supported in this browser.");
      }
      return;
    }
    if (!Array.isArray(items) || !items.length) return;

    stop();
    queueCancelled = false;
    isPlayingLesson = true;

    let index = 0;

    function next() {
      if (queueCancelled || index >= items.length) {
        isPlayingLesson = false;
        if (callbacks.onFinish) callbacks.onFinish();
        return;
      }

      const item = items[index];
      const utterance = new SpeechSynthesisUtterance(item.text);
      const isBn = item.lang === "bn";
      utterance.lang = isBn ? "bn-BD" : "en-US";
      utterance.rate = rate;

      const matchedVoice = findVoice(isBn ? "bn" : "en");
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      } else if (isBn && callbacks.onNotice) {
        callbacks.onNotice(
          "Bangla voice is unavailable on this device. Playing available English audio or system fallback."
        );
      }

      utterance.onstart = () => {
        if (callbacks.onItemStart) callbacks.onItemStart(index, item);
      };

      utterance.onend = () => {
        if (queueCancelled) return;
        index += 1;
        next();
      };

      utterance.onerror = () => {
        if (queueCancelled) return;
        index += 1;
        next();
      };

      window.speechSynthesis.speak(utterance);
    }

    next();
  }

  return {
    isSupported: supported,
    hasBanglaVoice,
    setRate,
    speakText,
    playSequence,
    stop,
    isPlaying: () => isPlayingLesson
  };
})();
