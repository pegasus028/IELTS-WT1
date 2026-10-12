/* Lesson read-aloud manifest: FNV-1a hash of each lesson's spoken text -> audio/lessons/<hash>.mp3.
   Empty for now: lessons are read with the browser's British voice. To record:
   pip install edge-tts, then python3 tools/build-lesson-audio.py --prune  (rebuilds this file). */
window.QM_LESSON_AUDIO = { voice: 'en-GB-SoniaNeural', base: 'audio/lessons/', files: {} };
