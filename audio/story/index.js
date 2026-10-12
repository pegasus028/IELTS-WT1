/* Narration manifest: FNV-1a hash of each story text -> audio/story/<hash>.mp3.
   Empty for now: the Observatory term has no recordings yet, so story.js reads each text
   with the browser's British voice. To record (same voice as Quillmoor Task 2):
   pip install edge-tts, then python3 tools/build-narration.py --prune  (rebuilds this file). */
window.QM_AUDIO = { voice: 'en-GB-SoniaNeural', base: 'audio/story/', files: {} };
