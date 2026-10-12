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
  m00: { title: 'Module 00 · The Test',               podcast: '', video: '' },
  m01: { title: 'Module 01 · Triage',                 podcast: '', video: '' },
  m02: { title: 'Module 02 · Flight Plan',            podcast: '', video: '' },
  m03: { title: 'Module 03 · The Overview',           podcast: '', video: '' },
  m04: { title: 'Module 04 · Claim + Number',         podcast: '', video: '' },
  m05: { title: 'Module 05 · Grouping',               podcast: '', video: '' },
  m06: { title: 'Module 06 · TREND mode',             podcast: '', video: '' },
  m07: { title: 'Module 07 · COMPARE mode',           podcast: '', video: '' },
  m08: { title: 'Module 08 · SEQUENCE mode',          podcast: '', video: '' },
  m09: { title: 'Module 09 · SPACE mode',             podcast: '', video: '' },
  m10: { title: 'Module 10 · Two Visuals',            podcast: '', video: '' },
  m11: { title: 'Module 11 · Accuracy',               podcast: '', video: '' },
  m12: { title: 'Module 12 · Cohesion',               podcast: '', video: '' },
  m13: { title: 'Module 13 · Selection',              podcast: '', video: '' },
  m14: { title: 'Module 14 · Exam Day',               podcast: '', video: '' }
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
