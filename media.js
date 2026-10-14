/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY — media.js  (IELTS Writing Task 1)
   The introduction for each module: a podcast episode (the Castle Wireless)
   and a YouTube video (the Memory Basin).
   Loaded after the topic files and before engine.js. podcasts.html (the
   standalone listening page) loads this file and nothing else.

   ---------------------------------------------------------------------------
   PODCASTS — how to add one
   1. Save the episode as audio/module-NN.mp3 (NN = 00 … 14) and push it.
   2. Put that path between the quotes after  podcast:  on the module's line,
      e.g.  podcast: 'audio/module-03.mp3'.
   The Castle Wireless tab appears as soon as one module has a podcast.

   VIDEOS — how to link one
   1. Upload the video to YouTube as "Unlisted" or "Public" (a "Private"
      video will NOT play inside the app), with "Allow embedding" ticked.
   2. Copy the Share link (youtu.be/…, youtube.com/watch?v=…, shorts, embed).
   3. Paste it between the quotes after  video:  on the module's line.
   The Memory Basin tab appears as soon as one module has a video.
   After any change, bump the ?v= number on the media.js <script> line in
   index.html, teacher.html and podcasts.html.
   =========================================================================== */

var MEDIA = {
  m00: { title: 'Module 00 · The Test',               podcast: 'audio/module-00.mp3', video: 'https://youtu.be/WF1iQN6ycQY' },
  m01: { title: 'Module 01 · Triage',                 podcast: 'audio/module-01.mp3', video: 'https://youtu.be/jndPB537InY' },
  m02: { title: 'Module 02 · Flight Plan',            podcast: 'audio/module-02.mp3', video: 'https://youtu.be/rdq44WjOGmM' },
  m03: { title: 'Module 03 · The Overview',           podcast: 'audio/module-03.mp3', video: 'https://youtu.be/De2HuKjt9ds' },
  m04: { title: 'Module 04 · Claim + Number',         podcast: 'audio/module-04.mp3', video: 'https://youtu.be/GVpkSohgsXs' },
  m05: { title: 'Module 05 · Grouping',               podcast: 'audio/module-05.mp3', video: 'https://youtu.be/orfgjKiRlJU' },
  m06: { title: 'Module 06 · TREND mode',             podcast: 'audio/module-06.mp3', video: 'https://youtu.be/G1D8ZCoA4Os' },
  m07: { title: 'Module 07 · COMPARE mode',           podcast: '', video: 'https://youtu.be/IbdclbKVAdg' },
  m08: { title: 'Module 08 · SEQUENCE mode',          podcast: 'audio/module-08.mp3', video: 'https://youtu.be/BYTSDo-b7Mw' },
  m09: { title: 'Module 09 · SPACE mode',             podcast: 'audio/module-09.mp3', video: 'https://youtu.be/__EFKKOeh-Y' },
  m10: { title: 'Module 10 · Two Visuals',            podcast: 'audio/module-10.mp3', video: 'https://youtu.be/JbLu79BGocY' },
  m11: { title: 'Module 11 · Accuracy',               podcast: '', video: 'https://youtu.be/q1jwkidVk7o' },
  m12: { title: 'Module 12 · Cohesion',               podcast: 'audio/module-12.mp3', video: 'https://youtu.be/UKEwEmSiols' },
  m13: { title: 'Module 13 · Selection',              podcast: '', video: 'https://youtu.be/VNzTCmVQ7n0' },
  m14: { title: 'Module 14 · Exam Day',               podcast: 'audio/module-14.mp3', video: 'https://youtu.be/QEZVkKybmQk' }
};

/* Attach the media to each module, when the full app is loaded. */
(function () {
  if (typeof window === 'undefined' || !window.CONTENT || !window.CONTENT.TOPICS) return;
  window.CONTENT.TOPICS.forEach(function (t) {
    var m = MEDIA[t.id] || {};
    t.podcast = m.podcast || '';
    t.video = m.video || '';
  });
})();
