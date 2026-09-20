/* ===========================================================================
   CHART CONTROL — mocks.js
   Three timed mocks in exam mode: one plain text box, 20 minutes, no pattern
   cards. Each is one Task 1 prompt from the bank. Add more by pushing rows.
   =========================================================================== */
(function () {
  var M = window.CONTENT.MOCKS;
  M.push({ id: 'mock1', n: 1, name: 'Mock 1 · Line graph', promptId: 'p-line-internet', minutes: 20, level: 'B1',
    blurb: 'A four-line graph over twenty years. TREND mode: overview second, first and last figures, the crossover, one exception.' });
  M.push({ id: 'mock2', n: 2, name: 'Mock 2 · Table', promptId: 'p-table-rice', minutes: 20, level: 'B1',
    blurb: 'Four rows, three years. Decide whether the story is in the rows or the columns before you write a word.' });
  M.push({ id: 'mock3', n: 3, name: 'Mock 3 · Map', promptId: 'p-map-school', minutes: 20, level: 'B2',
    blurb: 'A school campus now and the plan. SPACE mode: compass points, change verbs, present for now and "will be" for the plan.' });
})();
