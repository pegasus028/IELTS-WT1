/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY (Chart Control) — roster.js
   The class lists behind the "Fast Access" tabs on the sign-in screen.

   A student picks their nickname instead of typing an ID, which is where most
   sign-in trouble comes from: a mistyped ID makes a second, empty account and
   the work done under it never reaches the class sheet.

   The cohort decides the story: "Tutoring" students are returning Quillmoor
   students (they met the castle in the Task 2 app) and see the "second term"
   chapter 1; everyone else (M4.1) meets the castle for the first time.

   ---------------------------------------------------------------------------
   TO CHANGE THE CLASS
   Edit the lists below: each row is { id: '<student id>', name: '<nickname>' }.
   The tutees use the same ids as in the Task 2 app (tut-<name>). The M4.1
   list (30 names) follows the class register M4-1-Roster.xlsx (Oct 2026), in
   register order. Donut is both in M4.1 (m41-donut) and a private tutee
   (tut-donut): the two accounts are separate on purpose. Soda is a boy, so
   story text stays gender-neutral. The ids m41-ai (Airin) and m41-lillil
   (Lilil) keep their old spelling so existing accounts still match.
   Anyone not on a list can still use the "Create account" tab. The roster is a
   convenience, never a gate. Nothing here is secret: passwords are not in it;
   each student sets their own the first time they sign in.
   =========================================================================== */

var ROSTER_GROUPS = [
  { key: 'm41', label: '4.1 Fast Access', cohort: 'M4.1', students: [
    { id: 'm41-donut', name: 'Donut' },
    { id: 'm41-lookchin', name: 'Lookchin' },
    { id: 'm41-baiplu', name: 'Baiplu' },
    { id: 'm41-sun', name: 'Sun' },
    { id: 'm41-mint', name: 'Mint' },
    { id: 'm41-proud', name: 'Proud' },
    { id: 'm41-ai', name: 'Airin' },
    { id: 'm41-oly', name: 'Oly' },
    { id: 'm41-noyny', name: 'Noyny' },
    { id: 'm41-oboon', name: 'Ob-oon' },
    { id: 'm41-pasta', name: 'Pasta' },
    { id: 'm41-premier', name: 'Premier' },
    { id: 'm41-nicha', name: 'Nicha' },
    { id: 'm41-nene', name: 'Nene' },
    { id: 'm41-punnee', name: 'Punnee' },
    { id: 'm41-vernier', name: 'Vernier' },
    { id: 'm41-rak', name: 'Rak' },
    { id: 'm41-min', name: 'Min' },
    { id: 'm41-panghom', name: 'Panghom' },
    { id: 'm41-carrot', name: 'Carrot' },
    { id: 'm41-chicha', name: 'Chicha' },
    { id: 'm41-wongree', name: 'Wongree' },
    { id: 'm41-moquette', name: 'Moquette' },
    { id: 'm41-pin', name: 'Pin' },
    { id: 'm41-lillil', name: 'Lilil' },
    { id: 'm41-thinn', name: 'Thinn' },
    { id: 'm41-ren', name: 'Ren' },
    { id: 'm41-khaofang', name: 'Khaofang' },
    { id: 'm41-gam', name: 'Gam' },
    { id: 'm41-mon', name: 'Mon' }
  ] },
  { key: 'tut', label: 'Quillmoor tutees', cohort: 'Tutoring', students: [
    { id: 'tut-aeh', name: 'Aeh' },
    { id: 'tut-jingjing', name: 'JingJing' },
    { id: 'tut-pear', name: 'Pear' },
    { id: 'tut-mikii', name: 'Mikii' },
    { id: 'tut-donut', name: 'Donut' },
    { id: 'tut-soda', name: 'Soda' }
  ] }
];

/* Flat list for code that only wants ids and names. */
var ROSTER = [];
ROSTER_GROUPS.forEach(function (g) { g.students.forEach(function (s) { ROSTER.push({ id: s.id, name: s.name, cohort: g.cohort }); }); });
