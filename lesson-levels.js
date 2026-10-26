/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY — lesson-levels.js
   Levelled explanations for every lesson: A1 · A2 · B1 · B2. The C1 version is
   the original key / body / examples in topic-NN.js. student.js shows the level
   the student picks with the buttons on each lesson page (and in Your Trunk),
   and the Listen button plays Sonia's recording of that level
   (tools/build-lesson-audio.py). Each level keeps every rule the lesson's
   questions test; only the English changes.
   Shape: { subId: { A1: { key, body:[paragraph…], examples:[gloss…] }, … } }
   examples[i] replaces the note (g) of theory.examples[i]; the example sentence stays.
   Built 2026-10-20 · 45 lessons (same feature as the Task 2 app).
   =========================================================================== */
window.QM_LESSON_LEVELS = {
 "m00s1": {
  "A1": {
   "key": "Task 1: about 20 minutes, 150 words or more, one third of your score.",
   "body": [
    "The <strong>Writing test</strong> is 60 minutes. It has two tasks. Give Task 1 about <strong>20 minutes</strong>. Write <strong>at least 150 words</strong>. Task 2 needs 40 minutes and 250 words. Task 2 counts <strong>twice as much</strong> as Task 1.",
    "Read the <strong>rubric</strong> (the task sentence). It has three verbs. They are <em>summarise</em>, <em>select</em> and <em>compare</em>. It never says explain, discuss or argue.",
    "Four <strong>criteria</strong> (marking areas) give your band, 25% each. They are: Task Achievement; Coherence and Cohesion; Lexical Resource; Grammatical Range and Accuracy.",
    "Plan the 20 minutes in five steps. First, <strong>triage</strong> (check type, mode, units, time): 30 seconds. Second, note two <strong>overview</strong> (summary) ideas: 2 minutes. Third, group and choose the figures: 1.5 minutes. Fourth, write four paragraphs: 13 minutes. Last, check with the 10-point list: 3 minutes.",
    "Write full sentences in paragraphs, not notes or bullet points. Aim for 160–190 words."
   ],
   "examples": [
    "This is the <strong>rubric</strong>. Find its three verbs: summarise, select, compare.",
    "The three Task 1 numbers. Learn them well.",
    "Notes lose marks. Write full, connected sentences."
   ]
  },
  "A2": {
   "key": "Task 1: about 20 minutes and at least 150 words. Task 2 counts twice as much.",
   "body": [
    "The Writing test lasts 60 minutes and has two tasks. The Task 1 instructions say <em>\"You should spend about 20 minutes on this task\"</em>. They also say <em>\"Write at least 150 words.\"</em> Task 2 needs about 40 minutes and at least 250 words. It counts <strong>twice as much</strong> as Task 1. So do not give Task 1 extra time.",
    "The <strong>rubric</strong> (the task sentence) has three key verbs: <em>summarise</em>, <em>select</em> and <em>compare</em>. It does not ask you to explain, discuss or argue.",
    "Your report is marked on four <strong>criteria</strong> (marking areas), each worth 25%. They are Task Achievement, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy.",
    "Use the 20 minutes in five steps. First, <strong>triage</strong> the chart (type, mode, units, time) in 30 seconds. Next, note two ideas for the <strong>overview</strong> (the summary paragraph) in 2 minutes. Then group and select the figures in 1.5 minutes. Write the four paragraphs in 13 minutes. Finally, check with the 10-point list in 3 minutes.",
    "Write full, connected sentences, not notes or bullet points. Under 150 words, the <strong>examiner</strong> (marker) sees too little to give a high band. Aim for <strong>160–190 words</strong> in four paragraphs."
   ],
   "examples": [
    "This is the rubric. Its three verbs are summarise, select and compare.",
    "These three numbers are the basic facts of Task 1.",
    "Notes are not accepted. Turn them into connected sentences."
   ]
  },
  "B1": {
   "key": "Spend about 20 minutes, write at least 150 words, and remember that Task 2 counts twice as much.",
   "body": [
    "The Writing paper lasts <strong>60 minutes</strong> and has two tasks. The Task 1 instructions say <em>\"You should spend about 20 minutes on this task\"</em> and <em>\"Write at least 150 words.\"</em> Task 2 takes about 40 minutes, needs at least 250 words and contributes <strong>twice as much</strong> to your Writing score. So a Task 1 report that takes 30 minutes steals time from the task that is worth more.",
    "The task sentence, called the <strong>rubric</strong>, always asks the same thing. It tells you to <em>summarise</em> the information, <em>select</em> the main features and <em>compare</em> where relevant. It never asks you to explain, discuss, argue or give your view.",
    "Your report is marked on four <strong>criteria</strong>, each worth 25% of the Task 1 band. They are Task Achievement, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy.",
    "Use the 20 minutes in five phases. First, <strong>triage</strong> the visual (type, mode, units, time span) in 30 seconds. Next, find the big picture and note two overview ideas in 2 minutes. Then group and select the figures in 1.5 minutes. Write the four paragraphs in 13 minutes, and check with the 10-point list in the last 3 minutes. Four minutes of planning gives a better report than twenty minutes of writing.",
    "The answer must be full, connected sentences in a neutral, academic style, with no notes or bullet points. Do not open it like a letter, either. Under 150 words, the examiner cannot see enough language to give the higher bands. A safe target is <strong>160–190 words</strong> in <strong>four paragraphs</strong>."
   ],
   "examples": [
    "This is the rubric. Its three verbs, summarise, select and compare, tell you the whole job.",
    "The three numbers to remember: the time, the minimum length and Task 1's share of the score.",
    "Bullet-point notes are not accepted. The same facts must be written as connected sentences."
   ]
  },
  "B2": {
   "key": "Task 1 takes about 20 minutes and at least 150 words, and Task 2 counts twice as much.",
   "body": [
    "The Writing paper lasts <strong>60 minutes</strong> and contains two tasks. The Task 1 instructions say <em>\"You should spend about 20 minutes on this task\"</em> and <em>\"Write at least 150 words.\"</em> Task 2, which needs about 40 minutes and at least 250 words, contributes <strong>twice as much</strong> as Task 1 to your Writing score. A report that takes 30 minutes therefore steals time from the task that is worth more.",
    "The task sentence (the <strong>rubric</strong>) always asks the same thing: <em>\"Summarise the information by selecting and reporting the main features, and make comparisons where relevant.\"</em> Three verbs matter: <em>summarise</em>, <em>select</em> and <em>compare</em>. Nowhere does it ask you to explain, discuss, argue or give your view; those are Task 2 habits.",
    "Your report is assessed on four <strong>criteria</strong> of equal weight, 25% each: Task Achievement, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy. No single criterion counts double.",
    "A well-used 20 minutes has five phases. <strong>Triage</strong> the visual (type, mode, units, time span) in the first 30 seconds, then spend 2 minutes on the big picture, noting two ideas for the overview. Group the data and select your figures in 1.5 minutes. Write the four paragraphs in 13 minutes, and use the last 3 minutes to check against the 10-point list. Four minutes of planning produces a better report than twenty minutes of writing, and the final check catches the cheap errors.",
    "You may see one or more graphs, charts or tables, or a diagram of a process or a map. Whatever the visual, the answer must be full, connected sentences in a neutral, academic style, with no notes, no bullet points and no letter-style opening. Under 150 words is a real problem, because the examiner cannot see enough language to award the higher bands. A safe target is <strong>160–190 words</strong> in <strong>four paragraphs</strong>."
   ],
   "examples": [
    "The rubric, word for word. Its three verbs, summarise, select and compare, define the task; nothing in it asks for explanation or opinion.",
    "The three numbers worth memorising: the time, the minimum length and Task 1's share of the Writing score.",
    "Notes and bullet points are not accepted, so the same two figures must be joined in one connected sentence."
   ]
  }
 },
 "m00s2": {
  "A1": {
   "key": "Four criteria mark your report. Each band is a gate.",
   "body": [
    "Four <strong>criteria</strong> (marking areas), 25% each. <strong>Task Achievement (TA)</strong>: <strong>overview</strong> (summary), numbers, comparisons. <strong>Coherence and Cohesion (CC)</strong>: paragraphs, links. <strong>Lexical Resource (LR)</strong>: words. <strong>Grammatical Range and Accuracy (GRA)</strong>: grammar.",
    "The <strong>examiner</strong> (marker) climbs from Band 5. Your report must <em>\"fully fit\"</em> a band. It stops at the first band missed.",
    "TA Band 5: maybe no data. Band 6: <em>\"a relevant overview is attempted\"</em>, with figures. Band 7: <em>\"a clear overview\"</em>, grouped data, main trends. Band 8: key features <em>\"skilfully selected\"</em>.",
    "No overview or no figures? TA stops at Band 5. Put a number in every detail sentence. Never explain why.",
    "CC Band 6 links can be <em>\"mechanical\"</em> (Firstly, Secondly). Band 7 uses <em>\"reference and substitution\"</em>: <em>this figure</em>. Two groups mixed in one paragraph is CC. LR Band 7 needs <em>\"precision\"</em> and word partners. Wrong rare words lose marks. GRA Band 7: <em>\"error-free sentences are frequent\"</em>. <em>Rises</em> for a past year is GRA. A wrong <em>in</em> or <em>at</em> before a number is GRA too."
   ],
   "examples": [
    "Band 6 TA needs two things: an overview and numbers.",
    "Band 7 TA: clear overview, grouped data, named trends.",
    "Correct sentences, not only long ones, give GRA Band 7."
   ]
  },
  "A2": {
   "key": "Four criteria, 25% each. Each band is a gate you must fully pass.",
   "body": [
    "Your report is marked on four <strong>criteria</strong> (marking areas), 25% each. <strong>Task Achievement (TA)</strong>: an <strong>overview</strong> (summary paragraph), data and comparisons. <strong>Coherence and Cohesion (CC)</strong>: paragraphs and links. <strong>Lexical Resource (LR)</strong>: precise words. <strong>Grammatical Range and Accuracy (GRA)</strong>: varied, correct sentences.",
    "The examiner reads the bands like a ladder, from Band 5 up. A report must <em>\"fully fit the positive features\"</em> of a band. The score stops at the first band it does not fully fit.",
    "For TA, Band 5 says <em>\"there may be no data to support the description\"</em>. Band 6 says <em>\"a relevant overview is attempted\"</em>, with figures. Band 7 needs <em>\"a clear overview\"</em>, grouped data and main trends. Band 8 needs key features <em>\"skilfully selected\"</em>. No overview or no figures keeps TA at Band 5. Put a figure in every detail sentence. Never explain why.",
    "For CC, Band 6 links may be <em>\"mechanical\"</em>, like Firstly, Secondly. Band 7 uses <em>\"reference and substitution\"</em> flexibly, such as <em>this figure</em>. Mixing two groups in one paragraph is a CC problem. LR Band 7 needs <em>\"precision\"</em> and collocation (word partners). Wrong rare words lose marks. GRA Band 7 says <em>\"error-free sentences are frequent\"</em>. A wrong tense, such as <em>rises</em> for a past year, is grammar. A wrong preposition with a figure, such as <em>in</em> for <em>at</em>, is grammar too."
   ],
   "examples": [
    "An overview and numbers lift TA from Band 5 to Band 6.",
    "The Band 7 gate: a clear overview, grouped data and named trends.",
    "Correct sentences, not only complex ones, move grammar to Band 7."
   ]
  },
  "B1": {
   "key": "Every piece of feedback belongs to one of four criteria, and each criterion is a ladder of gates.",
   "body": [
    "There are four <strong>criteria</strong>, each worth 25%. <strong>Task Achievement (TA)</strong> asks if you reported the main features, with an <strong>overview</strong>, data and comparisons. <strong>Coherence and Cohesion (CC)</strong> asks if the paragraphs progress logically, with links that are not mechanical. <strong>Lexical Resource (LR)</strong> asks if the words are precise, with good collocation. <strong>Grammatical Range and Accuracy (GRA)</strong> asks if the sentences are varied and mostly correct.",
    "The examiner reads the descriptors as a ladder from Band 5 upwards. A script <em>\"must fully fit the positive features\"</em> of a band. The score stops at the first band it does not fit. For TA, Band 5 says <em>\"there may be no data to support the description\"</em>. Band 6 says <em>\"a relevant overview is attempted\"</em>, with details <em>\"supported using figures\"</em>. Band 7 needs <em>\"a clear overview, the data are appropriately categorised, main trends or differences are identified\"</em>. Band 8 needs key features <em>\"skilfully selected\"</em> and illustrated.",
    "So one missing ingredient pins a criterion. With no overview, or no figures, TA cannot pass Band 5. The fix is a figure in every detail sentence. Do not give reasons for changes. Task 1 does not ask you to interpret data.",
    "For CC, Band 6 devices may be <em>\"mechanical\"</em>, while Band 7 uses <em>\"reference and substitution\"</em> flexibly (<em>this figure</em>, <em>the latter</em>). For LR, Band 7 needs <em>\"precision\"</em> and <em>\"an awareness of style and collocation\"</em>, not rare words used wrongly. For GRA, Band 7 says <em>\"error-free sentences are frequent\"</em>.",
    "The criterion tells you the fix. A missing overview is TA. A wrong tense, such as <em>rises</em> for a past year, is GRA, and so is a wrong preposition with a figure (<em>peaked in 85,000</em>). A wrong word or word partner is LR. Two groups mixed in one paragraph is CC."
   ],
   "examples": [
    "The two things that lift TA from Band 5 to Band 6: an overview and numbers.",
    "The 6 to 7 gate for TA: a clear overview, grouped data and named trends.",
    "Accuracy, not just complexity, moves grammar to Band 7."
   ]
  },
  "B2": {
   "key": "Every piece of feedback belongs to one of four equally weighted criteria, and each criterion is a ladder of gates.",
   "body": [
    "The four <strong>criteria</strong> carry equal weight, 25% each. <strong>Task Achievement (TA)</strong> asks whether you selected and reported the main features, with an <strong>overview</strong> and with data, and made comparisons. <strong>Coherence and Cohesion (CC)</strong> asks whether the report is organised in paragraphs that progress logically, with links that are not mechanical. <strong>Lexical Resource (LR)</strong> asks whether the vocabulary is precise, with good collocation and few spelling errors. <strong>Grammatical Range and Accuracy (GRA)</strong> asks whether the sentences are varied and mostly error-free.",
    "The official instruction is that a script <em>\"must fully fit the positive features\"</em> of a band. In practice the examiner climbs from Band 5 and stops at the first band the script does not fully fit. The band of your best sentence does not matter. For TA, Band 5 says <em>\"the recounting of detail is mainly mechanical … there may be no data\"</em>. Band 6 says <em>\"a relevant overview is attempted … supported using figures\"</em>. Band 7 needs <em>\"a clear overview, the data are appropriately categorised, main trends or differences are identified\"</em>. Band 8 needs <em>\"key features are skilfully selected … and illustrated\"</em>.",
    "So one missing ingredient pins a criterion. No overview means TA cannot pass Band 5, and no figures means the same; the cure for the second is a figure in every detail sentence. Explaining why the numbers changed does not help either, because candidates are <em>\"not being asked to interpret the data or give their opinion\"</em>.",
    "For CC, Band 6 devices are used <em>\"to some good effect\"</em> but may be <em>\"mechanical\"</em>. Band 7 needs <em>\"reference and substitution\"</em> used flexibly (<em>this figure</em>, <em>the latter</em>), not just Firstly, Secondly. For LR, Band 7 needs <em>\"precision\"</em> and <em>\"an awareness of style and collocation\"</em>; a risk-taker gains range but shows <em>\"higher degrees of inaccuracy\"</em>, so precise beats rare. For GRA, Band 7 needs <em>\"error-free sentences\"</em> to be <em>\"frequent\"</em>.",
    "Naming the criterion names the fix. A missing overview is TA. A wrong tense, such as <em>rises</em> about a past year, is GRA, and so is a wrong preposition with a figure (<em>peaked in 85,000</em>), even though it also distorts the fact. A wrong word or collocation is LR, and two groups mixed in one paragraph are a CC problem."
   ],
   "examples": [
    "The two ingredients that lift TA from Band 5 to Band 6: an overview and figures.",
    "The 6 to 7 gate for TA: a clear overview, grouped data and named trends or differences.",
    "Accuracy, not complexity alone, is what moves grammar to Band 7."
   ]
  }
 },
 "m00s3": {
  "A1": {
   "key": "Leave out opinions, reasons, conclusions and copied words. Always give numbers.",
   "body": [
    "Task 1 is a <strong>factual report</strong> (only facts). Do not give your opinion. No <em>I think</em>, no <em>surprisingly</em>. Do not use <em>I</em>, <em>we</em> or <em>you</em>.",
    "Do not give <strong>reasons</strong> (why it happened). No <em>because</em>, no <em>probably</em>. The chart does not show reasons. These are <em>\"irrelevant material\"</em> (things that do not belong). They lower Task Achievement.",
    "Do not write a <strong>conclusion</strong>. The <strong>overview</strong> (summary paragraph) already sums up. A conclusion repeats it. That costs Coherence and Cohesion. Delete it. End with your last detail and its number.",
    "Do not copy the <strong>rubric</strong> (the task sentence). The rule: <em>\"any copied rubric must be discounted\"</em>. Copied words are not counted. Use your own words.",
    "Always give numbers. With no data, Task Achievement stops at Band 5. Numbers are your <strong>evidence</strong>. Do summarise, select and compare. Mention every category."
   ],
   "examples": [
    "The reason is only a guess. Stop at the number.",
    "A conclusion adds nothing. Delete it.",
    "No <em>we</em>, no comment. The number is the evidence."
   ]
  },
  "A2": {
   "key": "Five things lose marks: opinion, reasons, a conclusion, copied rubric and no data.",
   "body": [
    "Task 1 is a factual report. Candidates are <em>\"not being asked to interpret the data or give their opinion\"</em>. So do not write <em>I think</em>, <em>surprisingly</em> or <em>this is good news</em>. Keep it impersonal, with no <em>I</em>, <em>we</em> or <em>you</em>.",
    "Do not give reasons with <em>because</em>, or guesses with <em>probably</em>. The chart does not show causes. Opinions and reasons are <em>\"irrelevant material\"</em>, and they lower Task Achievement.",
    "<strong>No conclusion.</strong> IDP, an owner of IELTS, says <em>\"A conclusion is not necessary for Academic Task 1.\"</em> The <strong>overview</strong> (summary paragraph) already summarises. A conclusion repeats it, which costs Coherence and Cohesion. If you have both, delete the conclusion. The report ends with its last detail and figure.",
    "<strong>Do not copy the rubric</strong> (the task sentence). The rule says <em>\"any copied rubric must be discounted\"</em>. Copied words leave your word count and show nothing about your English.",
    "<strong>No data, no band.</strong> Band 5 says <em>\"there may be no data to support the description\"</em>. Numbers are your evidence. Summarise, select, compare and cover every category."
   ],
   "examples": [
    "The reason is only a guess, so stop after the figure.",
    "This conclusion adds nothing. Delete it.",
    "No <em>we</em> and no comment. The figure is the evidence."
   ]
  },
  "B1": {
   "key": "Five things lose marks by being there: opinion, reasons, a conclusion, copied rubric, and a report with no data.",
   "body": [
    "Task 1 is a factual report. The official guidance says candidates are <em>\"not being asked to interpret the data or give their opinion\"</em>. So do not write <em>I think</em>, <em>surprisingly</em> or <em>this is a positive change</em>. The report is impersonal: no <em>I</em>, <em>we</em> or <em>you</em>. Also leave out reasons and guesses, such as <em>because</em> or <em>probably</em>. These are <em>\"irrelevant material\"</em> and they pull Task Achievement down.",
    "<strong>No conclusion.</strong> IDP, one of the owners of IELTS, says <em>\"A conclusion is not necessary for Academic Task 1.\"</em> The overview already summarises. A conclusion repeats it, which costs Coherence and Cohesion, and it often adds an opinion, which costs Task Achievement. If a report has both, delete the conclusion and keep the overview. The report simply ends with its last detail sentence, a claim with a figure.",
    "<strong>Do not copy the rubric.</strong> The descriptors say <em>\"any copied rubric must be discounted\"</em>. Copied words are removed from your word count and do not count as evidence of your English. You do not get an automatic low band, but you lose words. Paraphrase the task sentence instead.",
    "<strong>No data, no band.</strong> Band 5 says <em>\"there may be no data to support the description\"</em>. Numbers are not decoration; they are the evidence. What Task 1 does want is to summarise, select the main features, compare, and mention every category."
   ],
   "examples": [
    "The reason is a guess the chart cannot show. Stop at the figure.",
    "A conclusion like this adds nothing, so delete it.",
    "No <em>we</em> and no comment. The figure is the evidence."
   ]
  },
  "B2": {
   "key": "Five things lose marks by being there: opinion, reasons, a conclusion, copied rubric, and a report with no data.",
   "body": [
    "Task 1 is a factual report. The official guidance says candidates are <em>\"not being asked to interpret the data or give their opinion\"</em>. So there is no <em>I think</em>, no <em>surprisingly</em>, no <em>this is a welcome change</em>, and no reasons or guesses such as <em>because incomes rose</em> or <em>probably</em>. The voice stays impersonal throughout, with no <em>I</em>, <em>we</em> or <em>you</em>. Opinions and causes are <em>\"irrelevant material\"</em> in the Band 5 descriptor, and they pull Task Achievement down.",
    "<strong>No conclusion.</strong> IDP, one of the owners of IELTS, says plainly: <em>\"A conclusion is not necessary for Academic Task 1.\"</em> The overview already summarises. A conclusion repeats it, which costs Coherence and Cohesion; it often adds an opinion, which costs Task Achievement; and it wastes minutes you need for checking. When a report has both, the overview stays and the conclusion goes, because the overview is the paragraph that gates the band. The report simply ends with its last detail sentence.",
    "<strong>Do not copy the rubric.</strong> The descriptors say <em>\"any copied rubric must be discounted\"</em>: copied words are removed from your word count and do not count as evidence of your English. This is not an automatic Band 4 and not a plagiarism penalty, but a copied introduction leaves you with a shorter report. Paraphrase the task sentence instead.",
    "<strong>No data, no band.</strong> The Band 5 descriptor says <em>\"there may be no data to support the description\"</em>. One official Band 5 script <em>\"would have been greatly improved if the candidate had included some reference to the figures\"</em>. Numbers are not decoration; they are the evidence. Meanwhile, the things Task 1 does require are to summarise, select the main features, compare, and cover every category."
   ],
   "examples": [
    "The reason is a guess about causes that the chart cannot show. Stop at the figure.",
    "A conclusion that repeats a general impression adds nothing and costs coherence. Delete it.",
    "No <em>we</em> and no comment on the data: the figure itself is the evidence."
   ]
  }
 },
 "m01s1": {
  "A1": {
   "key": "Years or dates: TREND. No time: COMPARE. Stages: SEQUENCE. Map: SPACE.",
   "body": [
    "First, find the <strong>mode</strong> (the kind of report). Is there a time axis, or two dates? That is <strong>TREND</strong>. No time, only groups? That is <strong>COMPARE</strong>. Are there steps or stages? That is <strong>SEQUENCE</strong>. Is it a map or a plan? That is <strong>SPACE</strong>. Two charts need one paragraph each.",
    "The mode gives you your words. TREND: <em>rose</em>, <em>fell</em>, <em>peaked at</em>, past simple. COMPARE: <em>higher than</em>, <em>twice as many as</em>. SEQUENCE: present simple, <em>is heated</em>, <em>then</em>. SPACE: <em>to the north of</em>, <em>was demolished</em>.",
    "Time decides the mode, not the shape. A bar chart with years is TREND. A bar chart of groups is COMPARE. Pie charts for two years are TREND. A pie or table for one year is COMPARE. Natural and factory processes are both SEQUENCE.",
    "No time? Then do not write <em>increased</em>. Nothing changes there. It is a content error."
   ],
   "examples": [
    "Years on the axis. Use change verbs, past simple.",
    "One year only. Nothing rises or falls.",
    "Wrong mode. Classes are not time."
   ]
  },
  "A2": {
   "key": "Time axis or two dates means TREND. No time means COMPARE. Stages: SEQUENCE. Map: SPACE.",
   "body": [
    "Before you read any numbers, find the <strong>mode</strong> (the kind of report). Is there a time axis, or two or more dates? Then it is <strong>TREND</strong>. If not, it is <strong>COMPARE</strong>. Is it a diagram of stages? That is <strong>SEQUENCE</strong>. Is it a map or a plan? That is <strong>SPACE</strong>. Also count the visuals: two need one paragraph each.",
    "The mode decides your tense and verbs. TREND uses change verbs (<em>rose</em>, <em>fell</em>, <em>peaked at</em>) in the past simple. COMPARE uses <em>higher than</em>, <em>twice as many as</em> and <em>accounted for</em>. SEQUENCE uses the present simple and the passive. SPACE uses compass points and verbs like <em>was demolished</em> and <em>converted into</em>.",
    "Time decides the mode, not the shape. A bar chart with years along the bottom is TREND. A bar chart of age groups is COMPARE. Two pie charts with two dates are TREND. A table with years in the columns is TREND. One pie chart, or a table of countries in one year, is COMPARE. Stages are SEQUENCE, natural or man-made.",
    "Never write <em>increased</em> about a chart with no time. It shows you did not check the axes. It counts as inaccurate content."
   ],
   "examples": [
    "There is a time axis, so use change verbs in the past simple.",
    "There is only one year, so nothing rises or falls.",
    "This is the wrong mode. School classes are categories, not time."
   ]
  },
  "B1": {
   "key": "A time axis or two dates means TREND, no time means COMPARE, stages mean SEQUENCE and a map means SPACE.",
   "body": [
    "Before you read any numbers, ask four questions. Is there a time axis, or two or more dates? If yes, you are in <strong>TREND</strong> mode; if no, you are in <strong>COMPARE</strong> mode. Is it a diagram of stages? That is <strong>SEQUENCE</strong> mode. Is it a map or a plan? That is <strong>SPACE</strong> mode. Finally, how many visuals are there? One is standard; two need one paragraph each.",
    "The mode decides your tense, your verbs and your connectors. TREND uses change verbs (<em>rose</em>, <em>fell</em>, <em>peaked at</em>) and the past simple. COMPARE uses comparison language (<em>higher than</em>, <em>twice as many as</em>, <em>accounted for</em>). SEQUENCE uses the present simple and the passive with sequencers. SPACE uses compass points and change-of-use verbs (<em>was demolished</em>, <em>converted into</em>).",
    "The shape of the visual does not decide the mode; the time does. A bar chart with years along the bottom is TREND, but a bar chart of age groups is COMPARE. Two pie charts dated in different years are TREND. A table with years in the columns is TREND. A single pie chart, or a table of countries in one year, is COMPARE. A process is SEQUENCE whether it is natural or man-made.",
    "The classic error is writing <em>increased</em> about a chart where nothing changes over time. This is not a small slip. It shows the examiner you have not looked at the axes, and it counts as inaccurate content."
   ],
   "examples": [
    "The axis shows time, so the sentence uses a change verb in the past simple.",
    "There is only one year, so nothing rises or falls; groups are compared.",
    "Wrong mode: school classes are categories, not points in time."
   ]
  },
  "B2": {
   "key": "A time axis or two dates means TREND, no time means COMPARE, stages mean SEQUENCE and a map means SPACE.",
   "body": [
    "Before you read a single number, ask four questions. Is there a time axis, or two or more dates? If so, the report is in <strong>TREND</strong> mode; if not, it is in <strong>COMPARE</strong> mode. Is the visual a diagram of stages? Then it is <strong>SEQUENCE</strong>. Is it a map or a plan? Then it is <strong>SPACE</strong>. Lastly, how many visuals are there? One is standard, while two need one paragraph each.",
    "The mode decides your tense, your verbs and your connectors. TREND uses change verbs such as <em>rose</em>, <em>fell</em> and <em>peaked at</em>, normally in the past simple. COMPARE uses comparison language: <em>higher than</em>, <em>twice as many as</em>, <em>accounted for</em>. SEQUENCE uses the present simple and the passive with sequencers. SPACE uses compass points and change-of-use verbs such as <em>was demolished</em> and <em>converted into</em>; a map with two dates also takes past tenses for the changes.",
    "The shape of the visual does not decide the mode; the <em>time</em> does. A bar chart with years along the bottom is TREND, whereas a bar chart of age groups is COMPARE. Two pie charts dated in different years are TREND, because the headline is how the shares changed, even though you still compare slices. A table with years in the columns is TREND; a table of countries in a single year, or one pie chart for one year, is COMPARE. Any diagram of stages is SEQUENCE, whether the process is natural, such as a life cycle, or man-made.",
    "The classic error is writing <em>increased</em> about a chart where nothing changes over time. That is not a small slip: it tells the examiner you have not looked at the axes, and it counts as inaccurate content."
   ],
   "examples": [
    "The axis is a time line, so the sentence uses a change verb in the past simple.",
    "A single year means nothing rises or falls; the groups are simply compared.",
    "Wrong mode: school classes are categories, not time, so no trend verb is possible."
   ]
  }
 },
 "m01s2": {
  "A1": {
   "key": "Read the title, axes, units and key before any number.",
   "body": [
    "Many mistakes come from the <strong>unit</strong> (what the number counts). Read the <strong>axis</strong> (side line) label. <em>Thousands</em>: 350 means 350,000. <em>Millions</em>: 12.5 means 12.5 million. A pie chart shows a <strong>percentage</strong> (a share).",
    "First ask: what is measured? In what unit? For which groups? Over which years?",
    "Read small title words. <em>Average</em> is not total. <em>Per person</em> means one person. <em>Per week</em> is not per day. <em>Percentage of homes</em> is a share, never over 100. Write <em>85% of homes</em>, not <em>85 homes</em>.",
    "A table can mix units, like dollars and hours. Two charts can have two different units.",
    "A dotted future line is a <strong>projection</strong> (a guess). Do not write <em>had</em>. Write <em>is expected to reach</em>.",
    "Always write the unit: <em>350,000 cars</em>, <em>6 hours a week</em>."
   ],
   "examples": [
    "The axis says thousands. So 350 means 350,000.",
    "The axis says million tonnes. Write the unit.",
    "Average hours per week: one person, one week."
   ]
  },
  "A2": {
   "key": "Read the title, both axes, the units and the key first. The unit changes every sentence.",
   "body": [
    "Many data mistakes come from a wrong <strong>unit</strong> (what the number counts). If the axis says <em>thousands</em>, 350 means 350,000. If it says <em>millions</em>, 12.5 means 12.5 million. A pie chart number is a <strong>percentage</strong>. So 30 means 30% of the whole.",
    "In the first thirty seconds, ask: what is measured, and in what unit? For which categories, and over which years?",
    "Read the small words in the title. <em>Average</em> hours are not total hours. <em>Per person</em> means one person, not the whole country. <em>Per week</em> is not per day. <em>Percentage of homes</em> is a share, so it cannot be over 100. Write <em>85% of homes</em>, not <em>85 homes</em>.",
    "A table can mix units, for example dollars in two columns and hours in another. Two charts together can also use two different units.",
    "A dotted line after today is a <strong>projection</strong> (an expected future number). Do not report it with <em>had</em>. Use <em>is expected to reach</em>.",
    "Write the unit with every number: <em>350,000 cars</em>, <em>6 hours a week</em>."
   ],
   "examples": [
    "The axis says thousand cars, so 350 means 350,000.",
    "The axis says million tonnes, so write the unit.",
    "The title says average hours per week: one person, one week."
   ]
  },
  "B1": {
   "key": "Read the title, both axes, the units and the legend before anything else. The unit changes every sentence.",
   "body": [
    "Most \"inaccurate data\" marks come from a <strong>unit</strong> misread, not a number misread. A line at 350 on an axis labelled <em>thousand cars</em> means 350,000 cars, not 350. A bar at 12.5 on an axis labelled <em>millions</em> means 12.5 million. A pie slice of 30 means 30%, a share of the whole, not a quantity.",
    "So, in the first thirty seconds, check four things. What is measured (cars, hours, dollars, tonnes)? In what unit (thousands, millions, %, per person per week)? For which categories (the legend or the rows)? Over what range of years? Only then look for the big picture.",
    "Watch the small words in the title. <em>Average hours per week</em> is not total hours, and it is not per day. <em>Per person</em> means one person, not the whole group. <em>Percentage of homes</em> is a share, so it cannot be over 100. Write <em>85% of homes</em>, not <em>85 homes</em>. A table can mix units, such as dollars in two columns and hours in a third. Two visuals together can also use different units.",
    "If part of a line is dotted, or the years are in the future, those values are <strong>projections</strong>. Report them with <em>is expected to reach</em>, never with <em>had</em>.",
    "Write the unit into your sentences: <em>350,000 cars</em>, <em>12.5 million tonnes</em>, <em>6 hours a week</em>. The examiner checks the figure and the unit together."
   ],
   "examples": [
    "The axis says \"thousand cars\", so the figure needs three more zeros.",
    "The axis says \"million tonnes\", so the unit goes into the sentence.",
    "The title says average hours per week: one typical person, one week."
   ]
  },
  "B2": {
   "key": "Read the title, both axes, the units and the legend before anything else. The unit changes every sentence.",
   "body": [
    "Most \"inaccurate data\" marks come from a <strong>unit</strong> misread, not a number misread. A line at 350 on an axis labelled <em>thousand cars</em> means 350,000 cars, not 350. A bar at 12.5 on an axis labelled <em>millions</em> means 12.5 million. A pie slice of 30 means 30%, a share of the whole rather than a quantity, so it is reported with <em>accounted for</em>, not with tonnes or people.",
    "In the first thirty seconds, then, say aloud what is <em>measured</em> (visitors, hours, dollars, tonnes) and in what <em>unit</em> (thousands, millions, %, per person per week). Then name the <em>categories</em> (the legend or the rows) and the <em>range</em> of years. Only then look for the big picture, because an overview built on a misread unit is wrong from its first word.",
    "Watch the small words in the title. <em>Average hours per week</em> is neither a total nor a daily figure. <em>Per person</em> means one typical person, not the whole country or group. <em>Percentage of homes</em> is a share of homes, so the number cannot exceed 100, and <em>85 homes</em> would misreport <em>85% of homes</em>. A table can mix units across columns, with dollars in two and hours in the third, and two visuals side by side may measure quite different things.",
    "Check, too, whether part of a line is dotted or runs into future years. Those values are <strong>projections</strong>, so they take <em>is expected to reach</em>; reporting them with <em>had</em> turns a forecast into a false fact.",
    "Finally, write the unit into every sentence: <em>350,000 cars</em>, <em>12.5 million tonnes</em>, <em>30% of the budget</em>, <em>6 hours a week</em>. The examiner checks the figure and the unit together."
   ],
   "examples": [
    "The axis label is \"thousand cars\", so the bare 350 would understate the figure a thousand times.",
    "The axis label is \"million tonnes\", and the unit itself must appear in the sentence.",
    "The title says average hours per week: the figure describes one typical person in one week, not a total."
   ]
  }
 },
 "m01s3": {
  "A1": {
   "key": "Past years: past simple. Future years: is expected to. No dates: present simple.",
   "body": [
    "The dates decide the <strong>tense</strong> (verb time). All dates in the past? Use the <strong>past simple</strong>: <em>rose</em>, <em>fell</em>, <em>was</em>, <em>accounted for</em>. One past year is past simple too.",
    "Do not write <em>was increasing</em> or <em>was increased</em>. Use <em>has risen</em> only when the time runs to now.",
    "Future years or a dotted line are <strong>projections</strong> (expected numbers). Write <em>is expected to</em>, <em>is projected to</em> or <em>will</em>. A projection is not a past fact.",
    "No dates, as in a process? Use the <strong>present simple</strong>: <em>are washed</em>, <em>is mixed</em>. A pie chart with no year is present simple too.",
    "Maps with two past dates show finished changes. Use past forms: <em>was demolished</em>, <em>were built</em>. Use the present simple for what is there now. A planned map takes <em>will be built</em>."
   ],
   "examples": [
    "All the dates are past. Use the past simple.",
    "2035 is in the future. It is a projection.",
    "A process has no dates. Use the present simple."
   ]
  },
  "A2": {
   "key": "Past dates: past simple. Future years: is expected to. No dates: present simple.",
   "body": [
    "The time frame decides the <strong>tense</strong>. Are all the dates in the past? Use the <strong>past simple</strong>: <em>rose</em>, <em>fell</em>, <em>was</em>. A chart with one past year also takes the past simple.",
    "Keep it simple. <em>Was increasing</em> and <em>was increased</em> are wrong for trend verbs. <em>Has risen</em> fits only when the period runs up to now.",
    "A dotted line, or years after today, shows <strong>projections</strong> (expected numbers). Use <em>is expected to reach</em>, <em>is projected to fall</em> or <em>will rise</em>. Never report a projection as a past fact with <em>had</em> or <em>reached</em>.",
    "A process diagram has no dates. A pie chart may have no year. Then use the <strong>present simple</strong>: <em>the cans are washed</em>, <em>rent accounts for</em>.",
    "Maps with two past dates show finished changes. Use past forms like <em>was demolished</em> and <em>were built</em>, or <em>has been extended</em>. Use the present simple for what is there now. Use <em>will be built</em> for a planned map."
   ],
   "examples": [
    "All the dates are in the past, so use the past simple.",
    "2035 is a future year, so the value is a projection, not a fact.",
    "A process has no dates, so use the present simple."
   ]
  },
  "B1": {
   "key": "Past dates take the past simple, future years take is expected to, and no dates take the present simple.",
   "body": [
    "Tense follows the time frame, and you decide the time frame in triage. If all the dates are in the past, use the <strong>past simple</strong>: <em>rose</em>, <em>fell</em>, <em>was</em>, <em>accounted for</em>. A chart with one past year also takes the past simple. Keep it simple: <em>was increasing</em> and <em>was increased</em> are wrong for trend verbs. <em>Has increased</em> fits only when the period runs up to now, as in <em>since 2018, sales have risen</em>.",
    "If the graph runs into the future, with a dotted line or years after today, those values are <strong>projections</strong>. Use <em>is expected to reach</em>, <em>is projected to fall</em> or <em>will rise</em>. Never report a projection as a fact with <em>had</em> or <em>reached</em>.",
    "Some visuals have no dates at all, such as a process diagram or a single pie chart with no year. Use the <strong>present simple</strong> for them: <em>the cans are washed</em>, <em>the seed grows</em>, <em>rent accounts for</em>.",
    "Maps with two dates mix tenses on purpose. When both dates are past, the changes are finished. So use the past simple or present perfect: <em>the cinema was demolished</em>, <em>houses were built</em>, <em>the school has been extended</em>. Use the present simple for what is there now, and <em>will be built</em> for a planned map."
   ],
   "examples": [
    "All the dates are in the past, so the verb is past simple.",
    "2035 is a future year on the graph, so it is reported as an expectation.",
    "A process has no dates, so it takes the present simple passive."
   ]
  },
  "B2": {
   "key": "Past dates take the past simple, future years take is expected to, and no dates take the present simple.",
   "body": [
    "Tense follows the time frame, and the time frame is decided in triage. If all the dates are in the past, use the <strong>past simple</strong>: <em>rose</em>, <em>fell</em>, <em>was</em>, <em>accounted for</em>. That includes a chart with a single past year. Keep the form simple: <em>was increasing</em> and <em>was increased</em> are wrong for trend verbs. <em>Has increased</em> fits only when the period runs up to now, as in <em>since 2018, sales have risen</em>. A present-tense verb about past dates tells the examiner you have not checked the time frame.",
    "If the graph runs into the future, shown by a dotted line or by years after today, those values are <strong>projections</strong>. They take <em>is expected to reach</em>, <em>is projected to fall</em> or <em>will rise</em>. Never report a projection as a fact; <em>had</em> or <em>reached</em> with a future year is an error, because the change is expected, not finished.",
    "Some visuals have no dates at all: a process diagram, for instance, or a single pie chart with no year. These take the <strong>present simple</strong>: <em>the cans are washed</em>, <em>the seed germinates</em>, <em>rent accounts for</em>. The present simple describes how something works or how things stand, so a past tense here would invent a time frame the visual does not have.",
    "Maps with two dates mix tenses on purpose. When both dates are behind us, the changes are complete. Use the past simple or present perfect for what changed: <em>the cinema was demolished</em>, <em>houses were built</em>, <em>the school has been extended</em>. Use the present simple for what stands there now, and <em>will be built</em> only for a planned map of the future. A present-simple form such as <em>the cinema is demolished</em> would wrongly describe a finished change as if it were happening now."
   ],
   "examples": [
    "Every date is in the past, so the present-tense verb becomes past simple.",
    "2035 lies beyond the last real figure, so the value is reported as an expectation, not a result.",
    "A process has no dates, so the passive stays in the present simple."
   ]
  }
 },
 "m02s1": {
  "A1": {
   "key": "Four paragraphs: introduction, overview, detail, detail. No conclusion.",
   "body": [
    "Every report has four paragraphs. <strong>Paragraph 1</strong> is the <strong>introduction</strong>. It says what the chart shows, where and when. It can give the units. <strong>Paragraph 2</strong> is the <strong>overview</strong> (the summary). Its first word is <em>Overall</em>. It gives two or three big facts. It has no numbers.",
    "<strong>Paragraphs 3 and 4</strong> are the <strong>details</strong>. Each has one group of features. Every sentence has a number, date or label.",
    "Use about <strong>30 / 45 / 60 / 60</strong> words. Do not put all details in one block. Split them into two paragraphs.",
    "The overview goes second. Then it is there if time ends. No overview? Then Task Achievement cannot go above Band 5.",
    "Never write a fifth paragraph, a conclusion. It repeats the overview. Stop after paragraph 4.",
    "Things you can count take <em>the number of</em>: cars. Things you cannot count take <em>the amount of</em>: water."
   ],
   "examples": [
    "Introduction: what, where, when. About 20 words.",
    "Overview: <em>Overall</em> plus two big facts. No numbers.",
    "Detail: a claim with numbers. Paragraph 4 does the same.",
    "No conclusion. The report ends after paragraph 4."
   ]
  },
  "A2": {
   "key": "Introduction, overview, detail A, detail B: about 30 / 45 / 60 / 60 words, and no conclusion.",
   "body": [
    "Every Task 1 report uses the same four paragraphs. <strong>Paragraph 1</strong>, the <strong>introduction</strong>, says what the visual shows, where and when. <strong>Paragraph 2</strong>, the <strong>overview</strong> (the summary), begins <em>Overall,</em>. It gives the two or three biggest general facts, with no figures. <strong>Paragraphs 3 and 4</strong> give the details. Each one covers one group of features. Every sentence has a figure, date or label.",
    "The word plan is about <strong>30 / 45 / 60 / 60</strong>. The introduction is shortest and the detail paragraphs are longest. One long block of details is a Coherence problem, so split it into two paragraphs.",
    "The overview goes second. Then it is on the page even if time runs out. With no overview, Task Achievement cannot go above Band 5.",
    "There is no fifth paragraph. A conclusion repeats the overview and costs Coherence and Cohesion. End with the last detail.",
    "In the introduction, use <em>the number of</em> for things you can count, like people. Use <em>the amount of</em> for things you cannot count, like water or money."
   ],
   "examples": [
    "The introduction: what, where and when, in about 20 words.",
    "The overview: Overall plus two general facts, with no figures.",
    "A detail sentence: a claim with figures. Paragraph 4 does the same for the second group.",
    "No conclusion. The report ends after paragraph 4."
   ]
  },
  "B1": {
   "key": "Introduction, overview, detail A, detail B: four paragraphs of about 30 / 45 / 60 / 60 words, and no conclusion.",
   "body": [
    "Every Task 1 report uses the same skeleton, whatever the chart. <strong>Paragraph 1</strong> is the <strong>introduction</strong>. It says what the visual shows, where and when, often with the units. <strong>Paragraph 2</strong> is the <strong>overview</strong>. It begins <em>Overall,</em> and gives the two or three biggest general truths, with no figures. <strong>Paragraphs 3 and 4</strong> are the detail paragraphs, one group of features each. Every detail sentence carries a figure, a date or a label.",
    "The word budget is roughly <strong>30 / 45 / 60 / 60</strong>. The introduction is the smallest paragraph and the detail paragraphs are the largest, because that is where the evidence lives. If all the details sit in one long block, split it into two paragraphs. One block is a weak sign for Coherence.",
    "The order matters. The overview goes second, straight after the introduction, so it is already on the page if time runs out. A report with no overview cannot score above Band 5 for Task Achievement.",
    "There is no fifth paragraph. Task 1 has no conclusion, because the overview already summarises. A conclusion repeats it, which costs Coherence and Cohesion. The report simply ends with the last detail sentence.",
    "One word choice in the introduction: <em>the number of</em> goes with things you can count, such as people or cars. <em>The amount of</em> goes with things you cannot count, such as money, energy or time."
   ],
   "examples": [
    "The introduction: what, where and when, in about 20 words.",
    "The overview: Overall plus two general truths, and no figures.",
    "A detail sentence: a claim with figures. Paragraph 4 does the same for the second group.",
    "No conclusion. The report ends after paragraph 4."
   ]
  },
  "B2": {
   "key": "Introduction, overview, detail A, detail B: four paragraphs of about 30 / 45 / 60 / 60 words, and no conclusion.",
   "body": [
    "Every Task 1 report, whatever the chart, uses the same skeleton. <strong>Paragraph 1</strong> is the <strong>introduction</strong>: one or two sentences saying what the visual shows, where and when, with the units inside it or in a second sentence. <strong>Paragraph 2</strong> is the <strong>overview</strong>: it begins <em>Overall,</em> and gives the two or three biggest general truths, with no figures. <strong>Paragraphs 3 and 4</strong> are the detail paragraphs, one group of features each, and every sentence carries a figure, a date or a label.",
    "The word budget is roughly <strong>30 / 45 / 60 / 60</strong>, which lands just under 200 words. In practice aim for 160–190: comfortably above the 150 minimum, and short enough to leave three minutes for checking. The introduction is the smallest paragraph and the detail paragraphs are the largest, because that is where the evidence lives. An overview that swells towards 90 words has usually let figures creep in. A single long block of details mixes two groups and weakens Coherence, so split it into two groups.",
    "The order matters. The overview goes second, straight after the introduction, so that it is already on the page if time runs out. A report with no overview cannot score above Band 5 for Task Achievement, so the cheapest paragraph in the report is also the most valuable.",
    "There is no fifth paragraph. Task 1 has no conclusion: the overview already summarises, and a conclusion repeats it, which costs Coherence and Cohesion. The report simply ends with its last detail sentence.",
    "The introduction also needs the right noun. Use <em>the number of</em> for countable things such as people or cars, and <em>the amount of</em> for uncountable things such as money, energy or time."
   ],
   "examples": [
    "The introduction: what is measured, where and when, in about 20 words.",
    "The overview: Overall plus two general truths, with no figures at all.",
    "A detail sentence: a claim backed by figures. Paragraph 4 does the same for the second group.",
    "No conclusion: the report ends with the last detail of paragraph 4."
   ]
  }
 },
 "m02s2": {
  "A1": {
   "key": "The [visual] shows [what] in [where] between [year] and [year].",
   "body": [
    "The <strong>introduction</strong> is one sentence. Use this pattern. <em>The [visual] shows [what] in [where] between [year] and [year].</em> Take every slot from the chart. No dates? Drop the time slot. You can also write <em>illustrates</em> or <em>compares</em>. Use your own words, not the task sentence.",
    "Name the visual: graph, chart, table, diagram or map. Do not give findings here. Findings go in the <strong>overview</strong> (paragraph 2).",
    "Countable things take <em>the number of</em>: tourists, cars. Uncountable things take <em>the amount of</em>: water, money. A % axis takes <em>the percentage of</em>.",
    "Give the units. A short second sentence is fine. <em>The figures are in thousands.</em>",
    "Use <em>the</em>: <em>the</em> bar chart, <em>the</em> population of. Most country names have no <em>the</em>: Japan, Kenya. But say <em>the UK</em>. General uncountable nouns have no <em>the</em>: <em>water</em>, not <em>the water</em>.",
    "Time phrase: <em>over a fifteen-year period</em>. Use <em>a</em>, a hyphen and <em>year</em>, not <em>years</em>."
   ],
   "examples": [
    "Every slot is filled: visual, what, where, when.",
    "A second short sentence gives the units.",
    "Two words were missing: <em>the</em> and <em>the</em>.",
    "No findings here. Say what is measured."
   ]
  },
  "A2": {
   "key": "The [visual] shows [what] in [where] between [Y1] and [Y2]. Fill every slot and give the units.",
   "body": [
    "The <strong>introduction</strong> is one sentence with a fixed pattern. <em>The [visual] shows [what] in [where] between [year] and [year].</em> You can also use <em>illustrates</em> or <em>compares</em>. Every slot comes from the chart: the title, the axes and the key. Use your own words, not the task sentence. With no dates, drop the time slot. Do not give findings here; they go in the <strong>overview</strong> (paragraph 2).",
    "Get the visual word right: line graph, bar chart, pie chart, table, diagram or maps. For the <em>what</em>, use <em>the number of</em> for countable things like tourists. Use <em>the amount of</em> for uncountable things like water. Use <em>the percentage of</em> when the axis shows %.",
    "Put the units in the introduction too. You can add a short sentence: <em>The figures are given in millions.</em>",
    "Articles are part of the pattern: <em>the</em> line graph, <em>the</em> number of, <em>the</em> population of. Most country names take no article, like Japan, but say <em>the UK</em> and <em>the USA</em>. General uncountable nouns take no article: <em>water</em>, not <em>the water</em>.",
    "To change the time phrase, write <em>over a fifteen-year period</em>. It needs <em>a</em>, a hyphen and singular <em>year</em>."
   ],
   "examples": [
    "Every slot is filled: visual, what, where and when.",
    "A second short sentence gives the units.",
    "Two articles were missing. <em>The</em> is part of the pattern.",
    "No findings in the introduction. Say what is measured, not what you found."
   ]
  },
  "B1": {
   "key": "The [visual] shows [what] in [where] between [Y1] and [Y2]. Fill every slot from the chart, and mention the units.",
   "body": [
    "The introduction is one sentence with a fixed pattern. <em>The [visual] shows [what] in [where] between [year] and [year].</em> Instead of <em>shows</em>, you can write <em>illustrates</em> or <em>compares</em>. Every slot comes from the chart itself: the title, the axis labels and the legend. Fill the slots in your own words, not by copying the task sentence. If the chart has no dates, drop the time slot and use the present tense. The introduction says what is measured, not what you found. Findings belong in the overview, which begins <em>Overall,</em>.",
    "Get the visual word right: line graph, bar chart, pie chart(s), table, diagram, maps. Then get the <em>what</em> right. Use <em>the number of</em> for things you can count, such as tourists or cars. Use <em>the amount of</em> for things you cannot count, such as water or money. Use <em>the percentage of</em> when the axis shows %.",
    "The units belong in the introduction too. Put them inside the sentence or in a short second one: <em>The figures are given in millions.</em> Without units, no figure in paragraphs 3 and 4 makes sense.",
    "Articles are part of the pattern: <em>the</em> line graph, <em>the</em> number of, <em>the</em> population of. Country names take no article (Japan, Kenya), except fixed ones such as <em>the UK</em> and <em>the USA</em>. Uncountable nouns used generally take no article: <em>water</em>, not <em>the water</em>.",
    "A useful time phrase is <em>over a fifteen-year period</em>. It needs <em>a</em>, a hyphen and singular <em>year</em>. This is because <em>fifteen-year</em> works as an adjective."
   ],
   "examples": [
    "The pattern with every slot filled: visual, what, where and when.",
    "A second short sentence carries the units.",
    "Two articles were missing. <em>The</em> is part of the pattern.",
    "No findings in the introduction. Say what is measured, not what you found."
   ]
  },
  "B2": {
   "key": "The [visual] shows [what] in [where] between [Y1] and [Y2]. Fill every slot from the chart, and mention the units.",
   "body": [
    "The introduction is one sentence built from a fixed pattern: <em>The [visual] shows / illustrates / compares [what is measured] in [where] between [year] and [year].</em> Every slot comes from the chart itself: the title, the axis labels and the legend. If the chart has no dates, drop the time slot and use the present tense. A sentence that fills only one or two slots is too thin to count as an introduction, and one that copies the task sentence earns nothing. What it must not contain is a finding: the introduction says what is measured, and the results belong in the overview, which begins <em>Overall,</em>.",
    "Get the <em>visual</em> word right: line graph, bar chart, pie chart(s), table, diagram, maps. Get the <em>what</em> right too. Use <em>the number of</em> for things you can count (tourists, cars, students) and <em>the amount of</em> for things you cannot (water, money, energy). When the axis shows %, the precise phrase is <em>the percentage</em> or <em>the proportion of</em>, not even <em>the number of</em>. With people, <em>total</em> and <em>quantity</em> do not collocate in this pattern.",
    "The units belong in the introduction as well, either inside the sentence or as a short second sentence such as <em>The figures are given in millions.</em> A reader who does not know the units cannot understand a single figure in paragraphs 3 and 4.",
    "Articles are part of the pattern: <em>the</em> line graph, <em>the</em> number of, <em>the</em> population of. Country names take no article (Japan, Kenya), except fixed ones such as <em>the UK</em> and <em>the USA</em>. Uncountable nouns used generally take no article: <em>water</em>, not <em>the water</em>.",
    "When you rephrase the dates, write <em>over a fifteen-year period</em>: the article <em>a</em>, a hyphen, and singular <em>year</em>, because <em>fifteen-year</em> works as an adjective."
   ],
   "examples": [
    "The pattern with every slot filled: visual, what, where and when.",
    "A second short sentence carries the units, so the figures later make sense.",
    "Two missing articles: <em>the</em> belongs to the fixed pattern.",
    "No findings in the introduction: state what is measured, not what you discovered."
   ]
  }
 },
 "m02s3": {
  "A1": {
   "key": "Copied words are not counted. Change the verb, the noun and the time.",
   "body": [
    "The rule: <em>\"any copied rubric must be discounted\"</em>. Words copied from the task sentence are not counted. Copy 20 words, and 150 words become 130.",
    "So write a <strong>paraphrase</strong> (same facts, new words). Make three changes. The verb: <em>shows</em> → <em>illustrates</em> or <em>compares</em>. The noun: <em>the number of buyers</em> → <em>how many people bought</em>. The time: <em>between 2000 and 2012</em> → <em>over a twelve-year period</em>.",
    "Keep the meaning. A city is not a whole country or continent. Never change <em>number</em> to <em>amount</em> for countable things. Keep every fact, even future years. Years, countries and categories stay the same. Only one year? Keep it: <em>in 2019</em>.",
    "Use neutral verbs: <em>illustrates</em>, <em>compares</em>, <em>presents</em>, <em>gives information about</em>. Not <em>talks about</em>, <em>tells us</em> or <em>proves</em>.",
    "Countable things take <em>the number of</em>: glasses. Uncountable things take <em>the amount of</em>: milk. Most countries have no <em>the</em>. But say <em>the UK</em>, <em>the USA</em>."
   ],
   "examples": [
    "Three changes rewrite almost any task sentence.",
    "Same meaning, new shape.",
    "<em>Talks about</em> is spoken English. Use <em>shows</em>.",
    "This change makes a new fact. It is wrong."
   ]
  },
  "A2": {
   "key": "Copied rubric is not counted. Change the verb, the noun phrase and the time phrase.",
   "body": [
    "The descriptors say <em>\"any copied rubric must be discounted\"</em>. Words copied from the task sentence leave your word count. They show nothing about your English. A 20-word copied introduction turns 150 words into 130. So write a <strong>paraphrase</strong>: the same facts in different words.",
    "Three changes are enough. The verb: <em>shows</em> becomes <em>illustrates</em>, <em>compares</em> or <em>presents</em>. The noun phrase: <em>the number of buyers</em> becomes <em>how many people bought</em>. The time phrase: <em>between 2000 and 2012</em> becomes <em>over a twelve-year period</em>.",
    "A paraphrase must keep the meaning. One city cannot become a whole country or continent. <em>The number of</em> cannot become <em>the amount of</em> for countable things. Keep every fact, including future projections. Years, countries and category names do not change. With only one year, keep it (<em>in 2019</em>); no <em>between … and</em> is needed.",
    "Use neutral reporting verbs: <em>shows</em>, <em>illustrates</em>, <em>compares</em>, <em>gives information about</em>. Do not use <em>talks about</em>, <em>tells us</em> or <em>proves</em>.",
    "Check the counted word: <em>the number of glasses</em>, but <em>the amount of milk</em>. Most countries take no <em>the</em>, except <em>the UK</em> or <em>the USA</em>."
   ],
   "examples": [
    "These three changes rewrite almost any task sentence.",
    "Same meaning, new shape. The task sentence used different words.",
    "<em>Talks about</em> is spoken English. Use <em>shows</em>, <em>illustrates</em> or <em>compares</em>.",
    "This change makes a new fact, so it is an error."
   ]
  },
  "B1": {
   "key": "Copied rubric is discounted. Change the verb, change the noun phrase, change the time phrase.",
   "body": [
    "The descriptors say that <em>\"any copied rubric must be discounted\"</em>. Words copied from the task sentence are removed from your word count. They do not count as evidence of your English. A 20-word copied introduction leaves a 150-word report at 130 words. So the introduction must be a <strong>paraphrase</strong>: the same facts in different words.",
    "Three swaps are enough. <strong>The verb:</strong> <em>shows</em> becomes <em>illustrates</em>, <em>compares</em>, <em>presents</em> or <em>gives information about</em>. <strong>The noun phrase:</strong> <em>the number of buyers</em> becomes <em>how many people bought</em>, and <em>salary</em> can become <em>pay</em>. <strong>The time phrase:</strong> <em>between 2000 and 2012</em> becomes <em>over a twelve-year period</em> or <em>from 2000 to 2012</em>.",
    "A paraphrase must keep the meaning. One city cannot become a whole country or region. <em>The number of</em> cannot become <em>the amount of</em> for countable things. Keep every fact, including any projections. Some words have no synonym: years, country names and categories stay as they are. With a single year, simply keep <em>in 2019</em>, with no <em>between … and</em>.",
    "Reporting verbs must be neutral and academic. Avoid <em>talks about</em> and <em>tells us</em>, which are spoken English, and <em>proves</em>, which claims more than a chart can show.",
    "Make two final checks. First, count the unit word: <em>the number of glasses</em>, but <em>the amount of milk</em>. Second, leave out <em>the</em> before most country names, except <em>the UK</em>, <em>the USA</em> and <em>the Netherlands</em>."
   ],
   "examples": [
    "The three swaps that rewrite almost any task sentence.",
    "The task sentence said it differently. Same meaning, new shape.",
    "<em>Talks about</em> is spoken English. Use shows, illustrates or compares.",
    "A paraphrase that changes the facts is an error, not a paraphrase."
   ]
  },
  "B2": {
   "key": "Copied rubric is discounted. Change the verb, change the noun phrase, change the time phrase.",
   "body": [
    "The descriptors say that <em>\"any copied rubric must be discounted\"</em>. Words copied from the task sentence are removed from your word count and do not count as evidence of your English. A 20-word copied introduction therefore leaves a 150-word report at 130 words. Copying is therefore never \"safe\", even though the copied words are correct. The introduction must be a <strong>paraphrase</strong>: the same facts in different words.",
    "Three swaps are enough. <strong>The verb:</strong> <em>shows</em> becomes <em>illustrates</em>, <em>compares</em>, <em>presents</em> or <em>gives information about</em>. <strong>The noun phrase:</strong> <em>the number of buyers</em> becomes <em>how many people bought</em>, and <em>salary</em> can become <em>pay</em>. <strong>The time phrase:</strong> <em>between 2000 and 2012</em> becomes <em>over a twelve-year period from 2000 to 2012</em>, or simply <em>from 2000 to 2012</em>.",
    "A paraphrase must keep the meaning. A single city cannot become a whole country or continent, and <em>the number of</em> cannot become <em>the amount of</em> for countable things. Nothing may be dropped either: projections, extra columns, age groups and the time frame all survive the rewrite. Some words have no synonym: years, country names and category names stay as they are. Keep those and change the rest; a visual with a single year keeps <em>in 2019</em> and needs no <em>between … and</em>.",
    "Reporting verbs are neutral and academic: <em>shows</em>, <em>illustrates</em>, <em>compares</em>, <em>presents</em>, <em>gives information about</em>. Avoid <em>talks about</em> and <em>tells us</em>, which are spoken register, and <em>proves</em>, which turns a description into a claim.",
    "Two final checks. Count the unit word, not the substance. <em>The number of glasses</em> is right when the chart counts glasses; <em>the amount of milk</em> fits when it measures the drink. And leave out the article before most country names, keeping it only for fixed ones such as <em>the UK</em>, <em>the USA</em> and <em>the Netherlands</em>."
   ],
   "examples": [
    "The three swaps that rewrite almost any task sentence.",
    "The task sentence used different words for the same facts: same meaning, new shape.",
    "<em>Talks about</em> is spoken register; a chart shows, illustrates or compares.",
    "A paraphrase that changes the facts is an error, not a paraphrase."
   ]
  }
 },
 "m03s1": {
  "A1": {
   "key": "The overview is paragraph two: Overall, big ideas, no numbers.",
   "body": [
    "The <strong>overview</strong> (the summary paragraph) has two or three sentences. Its first word is <em>Overall</em>. Do not use <em>Firstly</em> or <em>However</em>. Task 1 has no <strong>conclusion</strong> (last paragraph). So never write <em>In conclusion</em>.",
    "Put it in <strong>paragraph two</strong>, after the introduction. At the end, time can run out. No overview? Then <strong>Task Achievement</strong> (the task mark) stops at Band 5. Band 6 says <em>\"a relevant overview is attempted\"</em>. Band 7 says <em>\"a clear overview\"</em>.",
    "It is like a news headline. Give the big <strong>general</strong> truths. What rose? What fell? What was biggest? Names and years are fine. Numbers are not. Numbers and small changes go in paragraphs 3 and 4. <em>There were five shops</em> belongs in paragraph one. Give no opinion or reasons.",
    "Compare with <em>whereas</em> or <em>while</em>. Then cover the numbers on the chart. Is your paragraph still true? Then it is an overview."
   ],
   "examples": [
    "Two big ideas and <em>whereas</em>. No numbers.",
    "The big story of two pie charts. What fell, what rose.",
    "True, but it has numbers. It is a paragraph 3 sentence."
   ]
  },
  "A2": {
   "key": "The overview is paragraph two: Overall, then two or three general truths, with no figures.",
   "body": [
    "The <strong>overview</strong> (the summary paragraph) has two or three sentences. It begins with <em>Overall,</em> and gives the biggest general truths of the chart. These are what rose, what fell, what was largest and what stayed the same.",
    "<em>Overall,</em> is the right first word. <em>Firstly</em> starts a list, and <em>However</em> needs an idea before it. Task 1 has no <strong>conclusion</strong> (final paragraph), so <em>In conclusion</em> is wrong too.",
    "Write the overview in <strong>paragraph two</strong>, after the <strong>introduction</strong>. If you leave it for the end, time may run out. With no overview, <strong>Task Achievement</strong> (the task mark) cannot go above Band 5. Band 6 says <em>\"a relevant overview is attempted\"</em>. Band 7 says <em>\"a clear overview\"</em>.",
    "The overview is <strong>general</strong>. Category names and years are fine, but numbers, percentages and amounts are not. They go in paragraphs 3 and 4, with single figures and small ups and downs. <em>There were five shops</em> is introduction work, not a finding. Never add your opinion or reasons.",
    "A good overview usually compares. Use <em>whereas</em> or <em>while</em>: bus travel rose, whereas car travel fell. To test it, cover the numbers on the chart. Is your paragraph still true and useful? Then it is an overview."
   ],
   "examples": [
    "Two general truths joined by <em>whereas</em>. There are no figures.",
    "The headline of the two pie charts: what fell and what rose.",
    "It is true, but the figures make it a detail sentence for paragraph 3."
   ]
  },
  "B1": {
   "key": "The overview is paragraph two: it begins Overall, gives two or three general truths and carries no figures.",
   "body": [
    "The <strong>overview</strong> is a short paragraph of two or three sentences. It begins with <em>Overall,</em> and states the biggest general truths of the chart. These are what rose, what fell, what was largest and what stayed the same. Think of it as the headline of a news story, not the article.",
    "<em>Overall,</em> is the signal word the examiner expects. <em>Firstly</em> starts a list, and <em>However</em> needs an earlier idea to contrast with. <em>In conclusion</em> is wrong, because Task 1 has no conclusion paragraph.",
    "The overview goes in <strong>paragraph two</strong>, straight after the introduction. Writers who leave it for the end often run out of time and never write it. Written second, it is safe when the clock beats you. This matters: a report with no overview cannot go above <strong>Band 5</strong> for Task Achievement. Band 6 needs <em>\"a relevant overview is attempted\"</em>, and Band 7 needs <em>\"a clear overview\"</em>. A script must fully fit a band to receive it.",
    "An overview is <strong>general</strong>. Dates and category names are fine, but numbers, percentages and amounts are not. Those belong in paragraphs 3 and 4, together with single figures and small bumps in a line. Saying how many categories there are is introduction work, not a finding. The overview also gives no opinion and no reasons.",
    "It usually contains a <strong>comparison</strong>: bus travel rose <em>whereas</em> car travel fell. To test your overview, cover the numbers on the chart. If the paragraph still says something true and useful, it is an overview."
   ],
   "examples": [
    "Two general truths and a contrast with <em>whereas</em>, and no figures at all.",
    "The headline of the two pie charts: what lost ground and what gained it.",
    "This is true, but it is a detail sentence. The figures make it paragraph 3, not paragraph 2."
   ]
  },
  "B2": {
   "key": "The overview is paragraph two: Overall, plus the two or three biggest general truths, with no figures.",
   "body": [
    "The <strong>overview</strong> is a short paragraph, usually two or three sentences, that begins <em>Overall,</em> and states the biggest general truths of the chart. Those truths are what rose, what fell, what was largest and what stayed the same. It is the headline of the report. If the chart were a news story, the overview would be the title, not the article.",
    "<em>Overall,</em> is the signal that tells the examiner the overview has arrived. <em>Firstly</em> starts a list, <em>However</em> needs something earlier to contrast with, and <em>In conclusion</em> belongs to a paragraph that Task 1 does not have.",
    "The overview goes in <strong>paragraph two</strong>, straight after the introduction. Writers who leave it for the end usually never write it, because time runs out. Written second, it is on the page whatever happens, and the examiner sees the big picture before the details. A report with no overview cannot score above <strong>Band 5</strong> for Task Achievement. Band 6 says <em>\"a relevant overview is attempted\"</em>; Band 7 says <em>\"a clear overview\"</em>. A script must fully fit a band to receive it, so a missing overview pins the score at 5. Nothing else in the test is worth so much for so few words.",
    "An overview is <strong>general</strong>. It uses dates and category names freely, but it does not carry numbers, percentages or amounts. Those belong in paragraphs 3 and 4, along with single figures and small bumps in a line. Stating how many categories the chart has is the job of the introduction, not a finding. Opinions and reasons have no place in the overview, or anywhere in Task 1.",
    "It usually contains a <strong>comparison</strong>: one thing rose <em>whereas</em> another fell; one group was largest <em>while</em> another was smallest. The test of a good overview is to cover the numbers on the chart. If the paragraph still says something true and useful, it is an overview; if it needs the numbers to mean anything, it is a detail paragraph in disguise."
   ],
   "examples": [
    "Two general truths set against each other with <em>whereas</em>, and not a single figure.",
    "The headline of the two pie charts: which source lost its position and which ones rose to replace it.",
    "Accurate, but it is a detail sentence. The figures place it in paragraph 3, not paragraph 2."
   ]
  }
 },
 "m03s2": {
  "A1": {
   "key": "Three faults spoil an overview: vague words, numbers, or an opinion.",
   "body": [
    "Fault one is a <strong>vague</strong> (unclear) overview. Every chart has differences. So <em>some differences</em> says nothing. So does <em>plenty of data</em>. <em>Changed</em> is vague too. Say <em>rose</em> or <em>fell</em>. Band 7 needs <em>\"a clear overview\"</em>. It says <em>\"main trends or differences are identified\"</em>.",
    "Use two content words or more. Try <em>rose, fell, largest, smallest, doubled, remained stable</em>.",
    "Fault two is <strong>figures</strong> (numbers). Numbers and percentages go in paragraphs 3 and 4. Years and names are fine. The overview must say when and what.",
    "Fault three is <strong>opinion</strong>. Do not write <em>should</em>. Do not explain causes. Just report.",
    "<em>There were six groups</em> is not a finding. It is the introduction. Good overviews compare two things. Give each one a direction. Use <em>while</em>, <em>whereas</em> or <em>in contrast</em>. Prices rose, while sales fell."
   ],
   "examples": [
    "Vague. Every chart has differences. Which ones?",
    "Clear. Two content ideas and a contrast.",
    "A number. This is a paragraph 3 sentence.",
    "An opinion. It is not in the chart."
   ]
  },
  "A2": {
   "key": "Three things spoil an overview: saying nothing, giving figures or giving an opinion.",
   "body": [
    "<strong>Vague.</strong> Every chart has differences. So <em>some differences</em> or <em>plenty of data</em> tells the examiner nothing. <em>Changed</em> is also vague, because it hides the direction. Say <em>rose</em> or <em>fell</em>. Band 7 needs <em>\"a clear overview\"</em> in which <em>\"main trends or differences are identified\"</em>. Use at least two content words, such as <em>rose, fell, largest, smallest, doubled, remained stable</em>.",
    "<strong>Figures.</strong> A sentence with a number or percentage is a detail sentence. It belongs in paragraph 3 or 4. Years and category names are fine, because the overview must say when and what.",
    "<strong>Opinion.</strong> Sentences with <em>should</em>, or <em>this is a good change</em>, are not in the chart. The overview reports. It does not judge, and it does not explain causes.",
    "Do not repeat the introduction either. <em>There were six groups</em> is not a finding.",
    "A good overview usually compares. Put two things in one sentence and give each one a direction. Join them with <em>while</em>, <em>whereas</em> or <em>in contrast</em>: prices rose, while sales fell. A sentence about one thing alone compares nothing. This answers the task's words <em>\"make comparisons where relevant\"</em>."
   ],
   "examples": [
    "Vague. Every chart has differences. Which ones?",
    "Clear: two content ideas and a contrast word.",
    "This has a figure, so it is a detail sentence for paragraph 3.",
    "This is an opinion. It is not in the chart, so it is not in the report."
   ]
  },
  "B1": {
   "key": "Three things spoil an overview: it says nothing, it carries figures, or it gives an opinion.",
   "body": [
    "<strong>Vague.</strong> <em>\"Overall, there were some differences\"</em> is true of every chart ever drawn, so it tells the examiner nothing. The same goes for <em>plenty of data</em>, and for <em>changed</em>, which hides whether things went up or down. Band 7 needs <em>\"a clear overview\"</em> in which <em>\"main trends or differences are identified\"</em>. So name the content: what rose, what fell, what was largest, what stayed the same. Every overview needs at least two content words such as <em>rose, fell, largest, smallest, doubled, remained stable</em>.",
    "<strong>Figures.</strong> A sentence carrying a number is a detail sentence, even if it starts with <em>Overall</em>. Numbers, percentages and amounts belong in paragraphs 3 and 4. Years and category names are fine, because the overview must still say <em>when</em> and <em>what</em>.",
    "<strong>Opinion.</strong> <em>\"Overall, this is a positive change\"</em> is not in the chart, and neither is any sentence with <em>should</em>. The overview reports; it does not judge or explain causes. Repeating the introduction, such as how many groups there are, is not a finding either.",
    "A good overview usually contains a <strong>comparison</strong>: <em>while, whereas, in contrast, the former … the latter</em>. Put two things in one sentence and give each a direction, as in <em>prices rose, while sales fell</em>. A sentence about one thing alone compares nothing. Two general truths joined by <em>whereas</em> is the classic shape. It meets the task's demand to <em>\"make comparisons where relevant\"</em>."
   ],
   "examples": [
    "Vague: every chart has differences. Which ones does this chart show?",
    "Clear: two content claims and a contrast, with no figures.",
    "This carries a figure, so it is a detail sentence for paragraph 3.",
    "An opinion. It is not in the chart, so it does not belong in the report."
   ]
  },
  "B2": {
   "key": "Three things spoil an overview: it says nothing, it carries figures, or it gives an opinion.",
   "body": [
    "<strong>Vague.</strong> <em>\"Overall, there were some differences\"</em> is true of every chart ever drawn, so it tells the examiner nothing. <em>The graph contains plenty of data</em> fails in the same way, and so does <em>changed</em>, which hides the direction: if everything went up, say <em>rose</em>. Band 7 needs <em>\"a clear overview\"</em> in which <em>\"main trends or differences are identified\"</em>. Name the content: what rose, what fell, what was largest, what stayed the same. Every overview needs at least two content words such as <em>rose, fell, largest, smallest, doubled, remained stable</em>.",
    "<strong>Figures.</strong> A sentence that carries a number is a detail sentence wearing an overview's first word. Numbers, percentages and amounts belong in paragraphs 3 and 4. Years and category names are fine, because the overview must still say <em>when</em> and <em>what</em>.",
    "<strong>Opinion.</strong> <em>\"Overall, this is a positive change\"</em>, or any sentence built on <em>should</em>, is not in the chart. The overview reports; it does not judge, and it does not explain causes. Explanations of why something happened are equally out of place, since the chart shows what happened, not why. Nor does it repeat the introduction: the number of groups on the chart is a description of the visual, not a finding.",
    "A good overview usually contains a <strong>comparison</strong> or a contrast: <em>while, whereas, in contrast, the former … the latter</em>. The strongest version puts two items in the same sentence and gives each its direction, as in <em>prices rose, while sales fell</em>. A sentence that describes a single item, however accurately, compares nothing, so it cannot carry the overview on its own. Two general truths joined by <em>whereas</em> is the classic shape, and it satisfies the rubric's demand to <em>\"make comparisons where relevant\"</em> in the first forty words."
   ],
   "examples": [
    "Vague: every chart has differences, so the sentence names none of them.",
    "Clear: two content claims and a contrast, and no figure in sight.",
    "A figure turns this into a detail sentence for paragraph 3.",
    "An opinion. It cannot be read from the chart, so it has no place in the report."
   ]
  }
 },
 "m03s3": {
  "A1": {
   "key": "Find the headline. Write: Overall, [big idea], whereas [different big idea].",
   "body": [
    "First, find the <strong>headline</strong> (the news title). It is short and general. It has no numbers. One figure is not a headline. The introduction is not one. Your opinion is not one.",
    "Then use the <strong>P2 pattern</strong> (paragraph two shape). <em>Overall, [big idea], whereas [other big idea].</em> Put the biggest change first. <em>While</em> works like <em>whereas</em>. A second sentence can add one more truth.",
    "Openers: <em>Overall</em>, <em>In general</em>, <em>It is clear that</em>. Write 20 to 70 words. Years, names and labels are fine. Data numbers are not, even rounded ones. Change a number to words like <em>its highest point</em>.",
    "Use a <strong>comparison word</strong>. Try <em>whereas</em>, <em>while</em> or <em>in contrast</em>. <em>The former</em>, <em>the latter</em> and <em>both</em> also work. <em>Because</em> and <em>therefore</em> give reasons. Task 1 has no reasons. <em>Moreover</em> only adds. Two charts? Name both in the overview. Last test: hide the numbers with your hand. Is the story still clear?"
   ],
   "examples": [
    "Two headlines in the P2 pattern. Then a third idea.",
    "Big changes first. Then the slices that stayed.",
    "<em>In general</em> works like <em>Overall</em>."
   ]
  },
  "A2": {
   "key": "Find the headline, then write: Overall, [general claim], whereas [contrasting general claim].",
   "body": [
    "<strong>The headline method.</strong> Before you write, imagine the chart is a news story. What is the headline? A headline is short and general, with no figures. It is not one small figure, not the introduction and not an opinion.",
    "<strong>The P2 pattern</strong> (paragraph two): <em>Overall, [general claim], whereas / while [contrasting general claim].</em> The first claim is the biggest movement or difference. The second is the contrast or the exception. A second sentence can add a third truth. It might say who was largest all the time or what stayed the same. Or it might say which figures are projections.",
    "Begin with <em>Overall</em>, <em>In general</em> or <em>It is clear that</em>. Write two or three sentences (20 to 70 words). Years, names and numbers inside labels are allowed. Words like <em>doubled</em> are fine too. Data values are not allowed, not even rounded ones. Swap a figure for a general word, such as <em>its highest point</em>.",
    "Include a <strong>comparison word</strong>: <em>whereas, while, in contrast, the former, the latter, both</em>. <em>Because</em> and <em>therefore</em> give reasons, and Task 1 has none. <em>Moreover</em> only adds. With two visuals, the overview covers both. Finally, cover the numbers. Can a reader still learn the story? Then it works."
   ],
   "examples": [
    "Two headlines in the P2 pattern, then a third general truth. No figures.",
    "The two pie charts: the big movers first, the stable slices second.",
    "<em>In general</em> works as well as <em>Overall</em>."
   ]
  },
  "B1": {
   "key": "Find the headline, then write: Overall, [general claim], whereas [contrasting general claim].",
   "body": [
    "<strong>The headline method.</strong> Before writing, ask: if this chart were a news story, what would the headline be? A headline is short, general and has no figures, which is exactly what an overview is. It is not a single figure, a description of the chart or an opinion. Find one or two headlines and you have your paragraph.",
    "<strong>The P2 pattern.</strong> <em>Overall, [general claim], whereas / while [contrasting general claim].</em> The first claim is the biggest movement or the biggest difference; the second is the contrast or the exception. A second sentence can add a third truth. It might be who was largest throughout or what stayed the same. It might also say that figures after a date are projections.",
    "Openers that the checker accepts are <em>Overall,</em> <em>In general,</em> and <em>It is clear that</em>. Choose one, then write two or three general sentences of 20 to 70 words. Years, category names and numbers inside labels are allowed. So are multiples and fractions in words, such as <em>almost doubled</em> or <em>more than half</em>. Data values are not, not even rounded ones; replace them with general words such as <em>its highest point</em>.",
    "Include a <strong>comparison word</strong>: <em>whereas, while, in contrast, the former, the latter, both</em>. <em>Because</em> and <em>therefore</em> explain causes, which Task 1 does not do, and <em>moreover</em> only adds. If there are two visuals, the overview must cover both. Finally, cover the numbers on the chart. If a reader could still learn the story from your paragraph, it is doing its job."
   ],
   "examples": [
    "Two headlines in the P2 pattern, plus a third general truth. There are no figures.",
    "The two pie charts: the big movers come first, the stable slices second.",
    "<em>In general</em> works just as well as <em>Overall</em> as an opener."
   ]
  },
  "B2": {
   "key": "Find the headline, then write: Overall, [general claim], whereas [contrasting general claim].",
   "body": [
    "<strong>The headline method.</strong> Before writing, ask: if this chart were a news story, what would the headline be? A headline is short, general and has no figures, which is exactly what an overview is. A single figure is not a headline, a description of what the chart contains is the introduction, and a claim the chart cannot support is an opinion. Find one or two genuine headlines and you have your paragraph.",
    "<strong>The P2 pattern.</strong> <em>Overall, [general claim], whereas / while [contrasting general claim].</em> The first claim is the biggest movement or the biggest difference; the second is the contrast or the exception. A second sentence can add a third truth: who was largest throughout, what stayed the same, or that all figures after a date are projections.",
    "Openers that the checker accepts: <em>Overall,</em> <em>In general,</em> <em>It is clear that</em>. Choose one, then write two or three general sentences, 20 to 70 words in total. Years, category names and numbers inside labels (<em>the 15–24 age group</em>) are allowed. So are multiples and fractions expressed in words, such as <em>almost doubled</em> or <em>more than half</em>. Data values are not, not even rounded ones. When a figure slips in, replace it with a general expression such as <em>its highest point</em>, which keeps the truth and loses the number.",
    "Include a <strong>comparison word</strong>: <em>whereas, while, in contrast, the former, the latter, both</em>. <em>Because</em> and <em>therefore</em> introduce causes, which Task 1 does not ask for, and <em>moreover</em> merely adds a point without contrasting it. When the task has two visuals, the overview must cover both, ideally with one headline from each.",
    "Check your overview by covering the numbers on the chart. If a reader with no numbers could still learn the story of the chart from your paragraph, it is doing its job."
   ],
   "examples": [
    "Two headlines in the P2 pattern, followed by a third general truth. No figures anywhere.",
    "The two pie charts: the big movers first, then the slices that hardly changed.",
    "<em>In general</em> is an equally acceptable opener to <em>Overall</em>."
   ]
  }
 },
 "m04s1": {
  "A1": {
   "key": "Paragraphs 3 and 4: every sentence has a figure, a date or a label.",
   "body": [
    "Paragraphs 3 and 4 are the <strong>details</strong>. Every sentence needs a number, a year or a name. Take it from the chart. Names and years help, but the number is the proof. A year or a name alone still counts. A number is better. Band 5 says: <em>\"no data to support the description\"</em>. Band 6 says: <em>\"supported using figures/data\"</em>.",
    "Use <strong>claim + number</strong>. The <strong>claim</strong> says what happened. Use <em>rose</em>, <em>fell</em> or <em>the largest</em>. <em>Juice sales grew a lot</em> has no proof. <em>Juice sales grew from 200 to 350 cups</em> has proof. Change vague words like <em>very big</em> to a number. A claim with nothing from the chart is an opinion. A number with no claim is a list.",
    "The number must be <strong>true</strong>. Read it from the chart. Band 5 also says <em>\"inaccurate material\"</em>. A wrong number is as bad as none. Do not mix up two rows. Check the end values before <em>overtook</em>. <em>Just over half</em> must match the number.",
    "Circle the number, year or name in each sentence. Three or four good numbers are enough."
   ],
   "examples": [
    "A claim only. Now it has a number.",
    "Claim: <em>longest</em>. Number: 54. It is true.",
    "A wrong number. Read the chart again."
   ]
  },
  "A2": {
   "key": "Paragraphs 3 and 4: every sentence has a figure, a date or a chart label.",
   "body": [
    "Paragraphs 3 and 4 are the <strong>detail paragraphs</strong>. Band 5 for Task Achievement says <em>\"there may be no data to support the description\"</em>. Band 6 says details are <em>\"supported using figures/data\"</em>. Every detail sentence carries a figure, a date or a label from the chart. Names and years help, but the number is the proof. A year or a name alone still counts. A number is stronger.",
    "The shape is <strong>claim + number</strong>. The claim says what happened or how two things compare. Use words like <em>rose, fell, was the largest, was twice as high</em>. The number proves it. <em>Juice sales grew a lot</em> is only a claim. <em>Juice sales grew from 200 to 350 cups a day</em> has evidence. Replace vague phrases like <em>very big</em> with the figure. A claim with nothing from the chart is an opinion. A number with no claim is a list.",
    "The number must be <strong>true</strong>. Read it from the axis or the table, not from memory. Band 5 also punishes <em>\"inaccurate material\"</em>. So a wrong figure costs as much as a missing one. Do not mix up two rows. The claim must be true too, so check the end values before <em>overtook</em>. Words like <em>just over half</em> must agree with the figure.",
    "When you check, circle the figure, date or label in every detail sentence. Three or four good numbers per paragraph are enough."
   ],
   "examples": [
    "A claim only becomes a claim + number.",
    "Claim (<em>longest</em>) + number (54). It is true of the table.",
    "A wrong number is worse than no number. Read the chart again."
   ]
  },
  "B1": {
   "key": "In paragraphs 3 and 4, every sentence has a figure, a date or a label from the chart.",
   "body": [
    "The Band 5 descriptor for Task Achievement says <em>\"there may be no data to support the description\"</em>. Band 6 says details are <em>\"supported using figures/data\"</em>. The difference between the two bands is a habit. In the <strong>detail paragraphs</strong> (3 and 4), every sentence carries a figure, a date or a label from the chart. Names and years help, but the number is the proof. A sentence with a year or a name but no figure still meets the rule; it is simply weaker support.",
    "The shape is always the same: <strong>claim + number</strong>. The claim says what happened or how two things compare (<em>rose, fell, was the largest, was twice as high</em>). The number proves it. <em>Tea sales grew a lot</em> is a claim. <em>Tea sales grew from 200 to 350 cups a day</em> is a claim with evidence. Vague phrases such as <em>very big</em> should become the figure itself. A sentence with only a number is a list; a sentence with only a claim, and nothing from the chart, is an opinion.",
    "The number must be <strong>true</strong>. Read it from the axis or the table, not from memory. The Band 5 descriptor also punishes <em>\"inaccurate material\"</em>, so a wrong figure costs as much as a missing one. Swapping two rows of a table is a typical slip. The claim itself must also be true: check the final values before you write <em>overtook</em>. Approximation words such as <em>just over half</em> are fine if they agree with the figure.",
    "When you check your report, circle the figure, date or label in every detail sentence: no circle, no evidence. Not every figure needs to appear. Three or four well-chosen numbers per paragraph are worth more than ten in a row."
   ],
   "examples": [
    "A claim on its own becomes a claim + number.",
    "Claim (<em>longest</em>) + number (54), and it is true of the table.",
    "A wrong number is worse than useless, so read the chart again."
   ]
  },
  "B2": {
   "key": "In paragraphs 3 and 4, every sentence has a figure, a date or a label from the chart.",
   "body": [
    "The Band 5 descriptor for Task Achievement says <em>\"there may be no data to support the description\"</em>. Band 6 says details are <em>\"supported using figures/data\"</em>. The difference between the two bands is a habit: in the <strong>detail paragraphs</strong>, every sentence carries a figure, a date or a label from the chart. Names and years help, but the number is the proof: a sentence with a name or a year and no figure meets the requirement, but it is the weakest kind of support.",
    "The shape is always the same: <strong>claim + number</strong>. The claim says what happened or how two things compare (<em>rose, fell, was the largest, was twice as high</em>); the number proves it. <em>Tea sales grew a great deal</em> is a claim; <em>Tea sales grew from 200 to 350 cups a day</em> is a claim with evidence. Vague phrases such as <em>very big</em> or <em>very little</em> are placeholders for a figure that is sitting on the chart. A sentence with only a number and no claim is a list; a sentence with only a claim, and no figure, date or label, is an opinion.",
    "The number must be <strong>true</strong>. Read it from the axis or the table, not from memory. The Band 5 descriptor also punishes <em>\"inaccurate material\"</em>, so a wrong figure costs as much as a missing one. Swapping two rows of a table is one of the commonest ways to produce one. The claim must be true as well: a verb such as <em>overtook</em> is a factual statement, so read the end values before you use it. An approximation such as <em>just over half</em> is perfectly accurate as long as it agrees with the figure beside it.",
    "When you check your report, circle the figure, date or label in every detail sentence: no circle, no evidence; wrong circle, wrong evidence. Not every figure needs to appear. Three or four well-chosen numbers per paragraph, each attached to a claim, are worth more than ten numbers in a row."
   ],
   "examples": [
    "The claim on its own becomes claim + number.",
    "Claim (<em>longest</em>) + number (54), and both are true of the table.",
    "A wrong figure is worse than none. Read the chart again before you write."
   ]
  }
 },
 "m04s2": {
  "A1": {
   "key": "rose TO the end · rose BY the change · FROM X TO Y · peaked AT.",
   "body": [
    "<strong>Prepositions</strong> (small words like <em>to</em>, <em>by</em>) change the facts.",
    "<strong>to</strong> = the end number. A share went from 40% to 25%. It <em>fell to 25%</em>. <strong>by</strong> = the size of the change. It <em>fell by 15 percentage points</em>. Is the number the end? Use <em>to</em>. Is it the change? Use <em>by</em>.",
    "The safest pattern is <strong>from X to Y</strong>. It gives both ends.",
    "<strong>at</strong> = one fixed number. Say <em>peaked at</em> or <em>stood at</em>. Use <em>in</em> for a year, not a number. A share <em>accounted for</em> 40%.",
    "<em>By 2030</em> means not later than 2030. That is fine.",
    "No <em>the</em> before the number: <em>at 85,000</em>. From 20% to 30% is 10 <strong>percentage points</strong>, not 10%.",
    "The noun form: <em>a rise in sales of 5%</em>."
   ],
   "examples": [
    "Two true sentences. <em>to</em> is the end, <em>by</em> is the change.",
    "Wrong. 25% is the end, so use <em>to</em>.",
    "<em>at</em> for the top, <em>to</em> for the end.",
    "The noun pattern: a rise in [thing] of [size]."
   ]
  },
  "A2": {
   "key": "rose TO the end · BY the size of the change · FROM X TO Y · peaked AT.",
   "body": [
    "This is the most common grammar error in Task 1, and it changes the facts. Imagine a share that went from 40% to 25%. It <em>fell to 25%</em>: <strong>to</strong> gives the end point. It also <em>fell by 15 percentage points</em>: <strong>by</strong> gives the size of the change. If you swap the words, the sentence is false.",
    "The safest pattern is <strong>from X to Y</strong>: <em>Sales rose from 40 to 65.</em> It gives both ends and avoids the <em>by</em> trap completely.",
    "For one fixed point, use <strong>at</strong>: <em>peaked at 85,000</em>, <em>stood at 22%</em>. Use <em>in</em> only for a year, never before a figure. For a share, use <strong>accounted for</strong>: <em>rice accounted for 40%</em>. With the noun form, use <em>in … of</em>: <em>a rise in sales of 5%</em>.",
    "<em>By</em> before a year is different: <em>by 2030</em> means \"not later than 2030\". It is correct for a time or a projection.",
    "After <em>at, to</em> or <em>from</em>, do not put <em>the</em> before a number. Write <em>at 85,000</em>, not <em>at the 85,000</em>.",
    "<strong>Percentage points:</strong> from 20% to 30% is a rise of 10 percentage points. It is not a rise of 10%. To stay safe, write <em>from 20% to 30%</em>."
   ],
   "examples": [
    "Same chart, two true sentences, two different prepositions.",
    "Wrong: 25% is the end point, so it must be <em>to</em>.",
    "<em>at</em> for the fixed top point, <em>to</em> for the end of a change.",
    "The noun pattern: a rise in [thing] of [size]."
   ]
  },
  "B1": {
   "key": "rose TO the end point · rose BY the size of the change · rose FROM X TO Y · peaked AT · stood AT · accounted FOR · a rise IN sales OF 5%.",
   "body": [
    "This is the highest-frequency grammar error in Task 1, and it changes the facts. Imagine a share that went from 40% to 25%. It <em>fell to 25%</em>, because <strong>to</strong> marks the end point. It also <em>fell by 15 percentage points</em>, because <strong>by</strong> marks the size of the change. Swap the preposition and the sentence becomes false. Before you choose, ask: is this number where it ended, or how much it moved?",
    "The safe full pattern is <strong>from X to Y</strong>: <em>Sales rose from 40 to 65 units.</em> It gives both ends and avoids the <em>by</em> trap completely.",
    "For a fixed point, use <strong>at</strong>: <em>peaked at 85,000</em>, <em>stood at 22%</em>, <em>was highest in May, at 30 days</em>. <em>In</em> goes with the year (<em>in 2015</em>), never with the figure. For a share, use <strong>accounted for</strong> (<em>rice accounted for 40%</em>), which means \"made up\". With the noun form, use <em>in … of</em>: <em>a rise in sales of 5%</em>.",
    "<em>By</em> + a year is a different use. <em>By 2030</em> means \"not later than 2030\", and it is correct for a deadline or a projection. Numbers after <em>at, to, from</em> take no <em>the</em>: <em>peaked at 85,000</em>, not <em>at the 85,000</em>.",
    "<strong>Percent versus percentage points:</strong> a change from 20% to 30% is a rise of 10 percentage points, not \"10%\". The simplest protection is to write <em>from 20% to 30%</em>."
   ],
   "examples": [
    "The same chart gives two true sentences with two different prepositions.",
    "Wrong: 25% is the end point, so the preposition must be <em>to</em>.",
    "<em>at</em> for the fixed point, <em>to</em> for the end of a change.",
    "The noun pattern: a rise in [thing] of [size]."
   ]
  },
  "B2": {
   "key": "rose TO the end point · rose BY the size of the change · rose FROM X TO Y · peaked AT · stood AT · a rise IN sales OF 5%.",
   "body": [
    "This is the highest-frequency grammar error in Task 1, and unlike most grammar errors it changes the facts. Take a share that went from 40% to 25%. It <em>fell to 25%</em>: <strong>to</strong> marks the end point. It <em>fell by 15 percentage points</em>: <strong>by</strong> marks the size of the change. Swap the preposition and the sentence states a value that never appeared on the chart, or a change that never happened. The question to ask every time is whether the number is where the line finished or how far it travelled.",
    "The safe full pattern is <strong>from X to Y</strong>: <em>Sales rose from 40 to 65 units.</em> It gives both ends and avoids the <em>by</em> trap completely.",
    "For a fixed point use <strong>at</strong>: <em>peaked at 85,000</em>, <em>stood at 22%</em>, <em>was highest in May, at 30 days</em>. <em>In</em> belongs to the year (<em>in 2015</em>) and never introduces the figure itself. For a proportion, use <strong>accounted for</strong> (<em>rice accounted for 40%</em>), the fixed pair meaning \"made up this share\", which is the natural verb for pie charts. With the noun form use <em>in … of</em>: <em>a rise in sales of 5%</em>; <em>a fall in prices of 3 points</em>.",
    "Two more points. <em>By</em> followed by a year is a time expression, not a size: <em>is expected to reach 50,000 by 2030</em> is correct for a projection deadline. And numbers after <em>at, to, from</em> take no article: <em>peaked at 85,000</em>, not <em>at the 85,000</em>.",
    "<strong>Percent versus percentage points:</strong> a change from 20% to 30% is a rise of 10 percentage points, not \"10%\". The simplest protection is to write <em>from 20% to 30%</em> and avoid the trap entirely."
   ],
   "examples": [
    "The same chart, two true sentences and two different prepositions: the end point and the size of the change.",
    "Wrong: 25% is where oil ended, so the preposition must be <em>to</em>.",
    "<em>at</em> for the fixed point, <em>to</em> for the end of a change.",
    "The noun pattern: a rise in [thing] of [size]."
   ]
  }
 },
 "m04s3": {
  "A1": {
   "key": "Cannot read the exact number? Say around, just over or just under.",
   "body": [
    "Some values sit between <strong>gridlines</strong> (chart lines). A wrong exact number is <em>\"inaccurate material\"</em>. No number at all is <em>\"no data\"</em>. So use an <strong>approximation</strong> (a near number). Say <em>about</em>, <em>around</em>, <em>roughly</em>. Or say <em>nearly</em>, <em>almost</em>, <em>close to</em>. Or say <em>just over</em>, <em>just under</em>.",
    "The word must point the right way. <em>Nearly</em>, <em>almost</em> and <em>just under</em> mean below. <em>Just over</em> means above. <em>Around</em> and <em>roughly</em> mean either side. Half is 50%. A third is about 33%. A quarter is 25%. So 47% is <em>almost half</em>. 35% is <em>just over a third</em>. 3.2 times is <em>just over three times</em>. Say <em>exactly</em> only for exact numbers.",
    "<strong>Number or amount?</strong> You can count visitors, hours, cups. Use <em>the number of</em>. You cannot count electricity, energy, money, time. Use <em>the amount of</em>. Hours are counted, but time is not.",
    "Always add the <strong>unit</strong>: <em>12 hours</em>, <em>$5,000</em>. A number alone is half a fact."
   ],
   "examples": [
    "A near word plus the number. Both are true.",
    "47% is below half. Use <em>just under</em>.",
    "We count passengers. We measure water.",
    "120 and 610. A rough fraction is honest."
   ]
  },
  "A2": {
   "key": "Say around, just over or just under for unclear values. Count with number, measure with amount.",
   "body": [
    "Many values sit between the <strong>gridlines</strong>. A wrong exact number is <em>\"inaccurate material\"</em>, but no number is <em>\"no data\"</em>. The answer is <strong>approximation</strong>. Use words like <em>approximately, around, about, roughly, nearly, almost, just over, just under, close to</em>. It is accurate, safe and shows a range of words.",
    "Match the word to the number. <em>Nearly</em>, <em>almost</em> and <em>just under</em> mean below. <em>Just over</em> means above. <em>Around</em> and <em>roughly</em> mean near, on either side. Think of fractions. Half is 50%, a third is about 33%, a quarter is 25%. So 47% is <em>almost half</em>, and 35% is <em>just over a third</em>. Multiples work the same way: 3.2 times is <em>just over three times</em>. Use <em>exactly</em> only when the number is exact.",
    "<strong>Number or amount.</strong> Things you can count take <em>the number of</em>: visitors, tourists, hours, cups, households. Things you cannot count take <em>the amount of</em>: electricity, energy, money, rice, time. Hours are counted, although time is not. <em>The amount of visitors</em> is a common error.",
    "<strong>Units</strong> travel with the figure: <em>80 visitors</em>, <em>12 hours a week</em>, <em>$5,000</em>. A number with no unit is only half a fact."
   ],
   "examples": [
    "An approximation plus the figure: both are accurate.",
    "The word must point the right way. 47% is below half.",
    "Passengers are counted, so <em>number</em>. Water is measured, so <em>amount</em>.",
    "120 against 610: a rough fraction is honest and adds range."
   ]
  },
  "B1": {
   "key": "When the exact value cannot be read, say around, just over, just under or roughly. Count with number, measure with amount.",
   "body": [
    "Many values sit between the <strong>gridlines</strong>. Guessing a precise figure risks <em>\"inaccurate material\"</em>; refusing to give one risks <em>\"no data\"</em>. The way out is <strong>approximation</strong>: <em>approximately, around, about, roughly, nearly, almost, just over, just under, close to</em>. An approximation next to a value is accurate, safe and shows lexical range.",
    "Approximation words carry meaning, so match them to the number. <em>Nearly</em>, <em>almost</em> and <em>just under</em> mean below; <em>just over</em> means above; <em>around</em> and <em>roughly</em> mean either side. Compare with the nearest fraction: a half is 50%, a third about 33%, a quarter 25%. So 47% is <em>almost half</em>, and 35% is <em>just over a third</em>. Multiples follow the same logic: 3.2 times as many is <em>just over three times</em>, while 2.9 is <em>nearly three times</em>. <em>Exactly</em> is only true when the number is exact.",
    "<strong>Number or amount.</strong> Things you can count take <em>the number of</em>: visitors, tourists, hours, cups, households. Things you cannot count take <em>the amount of</em>: electricity, money, rice, time, energy. Note that hours are counted even though time is not. Either kind can take <em>the proportion of</em> or <em>the percentage of</em>. <em>The amount of visitors</em> is a high-frequency Lexical Resource error.",
    "<strong>Units</strong> travel with the figure: <em>80 visitors</em>, <em>12 hours a week</em>, <em>$5,000</em>, <em>3 million tonnes</em>. A bare number with no unit is only half a fact."
   ],
   "examples": [
    "An approximation plus the figure, and both are accurate.",
    "The approximation word must point the right way: 47% is below half.",
    "Passengers are counted, so <em>number</em>; water is measured, so <em>amount</em>.",
    "120 against 610: a rough fraction is honest and adds range."
   ]
  },
  "B2": {
   "key": "When the exact value cannot be read, say around, just over, just under, roughly. Count with number, measure with amount.",
   "body": [
    "Many values sit between the <strong>gridlines</strong>. Guessing a precise figure risks <em>\"inaccurate material\"</em>; refusing to give one risks <em>\"no data\"</em>. The way out is <strong>approximation</strong>: <em>approximately, around, about, roughly, nearly, almost, just over, just under, close to</em>. A value described as <em>just under half</em> is accurate, safe and shows lexical range at the same time. Equally, <em>roughly 50,000</em> is an honest reading of a value a little above that gridline.",
    "Approximation words carry meaning, so match them to the number. <em>Nearly</em> and <em>just under</em> mean below; <em>just over</em> means above; <em>around</em> and <em>roughly</em> mean either side. The reference points are the common fractions: a half is 50%, a third roughly 33%, a quarter 25%. So 47% is <em>almost half</em>, not <em>just over half</em>, and 35% is <em>just over a third</em>. Multiples work in the same way: 3.2 times as many is <em>just over three times</em>, whereas 2.9 times is <em>nearly three times</em>. <em>Exactly</em> is never safe unless the figure really is exact.",
    "<strong>Number or amount.</strong> Things you can count take <em>the number of</em>: visitors, tourists, hours, cups, households. Things you cannot count take <em>the amount of</em>: electricity, money, rice, time, energy. The pair <em>hours</em> and <em>time</em> shows the logic clearly: the same idea is countable in one word and uncountable in the other. Either kind can take <em>the proportion of</em> or <em>the percentage of</em>. <em>The amount of visitors</em> is one of the high-frequency errors, and it is a Lexical Resource fault.",
    "<strong>Units</strong> travel with the figure: <em>80 visitors</em>, <em>12 hours a week</em>, <em>$5,000</em>, <em>3 million tonnes</em>. A bare number with no unit is only half a fact, so check that every figure in your detail paragraphs has one."
   ],
   "examples": [
    "Approximation plus the exact figure: the two agree, so both are accurate.",
    "The approximation word must point the right way: 47% falls below half.",
    "Passengers are counted, so <em>number</em>; water is measured, so <em>amount</em>.",
    "120 against 610: a rough fraction is honest and adds lexical range."
   ]
  }
 },
 "m05s1": {
  "A1": {
   "key": "Put every category into one of two groups. One group, one paragraph.",
   "body": [
    "A chart is not a list. Look at the <strong>categories</strong> (lines, bars, slices, rows). Which ones belong together? Make two <strong>groups</strong> (sets with one story).",
    "Common pairs are <em>rose</em> and <em>fell</em>. Or <em>large</em> and <em>small</em>. Or <em>changed a lot</em> and <em>stayed the same</em>. Or <em>high from the start</em> and <em>started low, grew fast</em>. On a map, try <em>north</em> and <em>south</em>. Or <em>replaced</em> and <em>kept</em>.",
    "Give each group a name. The name tells its story. <em>Tea</em> is not a group name. <em>The drinks that grew</em> is. Two pie charts for two years? Do not group by chart. Group by how the slices changed.",
    "Grouping gives two rewards. <strong>Task Achievement</strong> (the task mark) wants <em>categorised</em> data. <strong>Coherence</strong> (organisation) wants <em>logically organised</em> ideas.",
    "Sort in about sixty seconds. Do it before paragraph three. Do not write one paragraph per category. That is a list. Examiners call it <em>mechanical</em>."
   ],
   "examples": [
    "Rose and fell. Two paragraphs.",
    "Changed a lot and stayed the same.",
    "Big sales and small sales.",
    "One paragraph per category is a list."
   ]
  },
  "A2": {
   "key": "Put every category into one of two groups that share a story. Each group becomes one paragraph.",
   "body": [
    "A chart is not a list. Before the detail paragraphs, look at the <strong>categories</strong>. These are the lines, bars, slices, rows or areas of a map. Ask: <em>which of these belong together?</em> Sort them into two <strong>groups</strong>.",
    "Common answers are <em>rising versus falling</em> and <em>large versus small</em>. There is also <em>changed a lot versus stayed the same</em>. Another is <em>high from the start versus started low and grew fast</em>. On a map, try <em>north versus south</em> or <em>replaced versus kept</em>.",
    "Give each group a <strong>name</strong> that tells its story. If you cannot name it, it is not a group. <em>Tea</em> is not a name, but <em>the drinks that grew</em> is. Names like <em>above ten</em> or <em>the 2000 chart</em> tell no story. With two pie charts, group the slices by how much they changed, not by chart.",
    "Grouping is worth two criteria. Task Achievement Band 7 asks for data that is <em>appropriately categorised</em>. Coherence Band 7 asks for <em>logically organised</em> information.",
    "Sort in about sixty seconds, before paragraph three. Do not write one paragraph per category in legend order. The examiner calls that <em>mechanical</em>."
   ],
   "examples": [
    "Rising versus falling: two paragraphs.",
    "Changed a lot versus stayed the same.",
    "Large versus small: high sales and lower sales.",
    "One paragraph per category is listing, not grouping."
   ]
  },
  "B1": {
   "key": "Put every category into one of two groups that share a story. Each group becomes one paragraph.",
   "body": [
    "A chart is not a list. Before you write your detail paragraphs, look at the <strong>categories</strong>: the lines, bars, slices, rows or areas of a map. Ask: <em>which of these belong together?</em> The usual answers are <em>rising versus falling</em>, <em>large versus small</em>, or <em>changed a lot versus stayed the same</em>. Another is <em>high from the start versus started low and grew fast</em>. On a map, try <em>north versus south</em>, <em>buildings versus open space</em> or <em>replaced versus kept</em>.",
    "Give each group a <strong>name</strong>. If you cannot name the group, it is not a group. <em>Tea</em> is not a name; <em>the drinks that grew</em> is. A good name tells the story of the chart, so labels like <em>above ten</em> or <em>the first chart</em> are weak. With two pie charts for two years, describing each chart separately is a classic error. Group the slices by how they changed.",
    "Grouping is worth two criteria at once. Task Achievement Band 7 asks for data that is <em>appropriately categorised</em>. Coherence Band 7 asks for information that is <em>logically organised</em>. One decision earns two rewards.",
    "Do the sorting in your head or in the margin, in about sixty seconds, before paragraph three. Students who skip this step write about each category in turn, often in legend order. The examiner calls this <em>mechanical</em>."
   ],
   "examples": [
    "Rising versus falling, which gives two paragraphs.",
    "Changed a lot versus stayed the same.",
    "Large versus small: the busy shops and the rest.",
    "One paragraph per category is listing, not grouping."
   ]
  },
  "B2": {
   "key": "Put every category into one of two groups that share a story. Each group becomes one paragraph.",
   "body": [
    "A chart is not a list. Before you write your detail paragraphs, look at the <strong>categories</strong> (the lines, bars, slices, rows or areas of a map) and ask: <em>which of these belong together?</em> The usual answers are <em>rising versus falling</em>, <em>large versus small</em>, <em>changed a lot versus stayed the same</em>, or <em>high from the start versus started low and grew fast</em>. On a map they are <em>north versus south</em>, <em>buildings versus open space</em>, or <em>replaced versus kept</em>.",
    "Give each group a <strong>name</strong>. If you cannot name the group, it is not a group. <em>Tea</em> is not a name; <em>the drinks that grew</em> is. The best names carry the story of the chart. That is why <em>above ten / below ten</em> or <em>the first chart / the second chart</em> is a weak split: it sorts the data without saying anything about it. With two pie charts for two years, describing each chart in turn is a classic error, because the story is what changed between them. Group the slices by the size of their change instead.",
    "Grouping is worth two criteria at once. Task Achievement Band 7 asks for data that is <em>appropriately categorised</em>; Coherence Band 7 asks for information that is <em>logically organised</em>. One decision, two rewards: two groups decided before writing pay twice.",
    "Do the sorting in your head or in the margin, in about sixty seconds, before you write paragraph three. Students who skip this step write a story about each category in turn, usually in the order of the legend, which the examiner calls <em>mechanical</em>. A report with one paragraph per category also hides the comparisons the rubric asks for, because each item is described alone."
   ],
   "examples": [
    "Rising versus falling: two groups, two paragraphs.",
    "Changed a lot versus stayed the same.",
    "Large versus small: the two busy shops and the rest.",
    "One paragraph per category is listing, not grouping."
   ]
  }
 },
 "m05s2": {
  "A1": {
   "key": "Paragraph three is Group A. Paragraph four is Group B.",
   "body": [
    "<strong>Paragraph three</strong> is Group A. First, name the group and its story, with no numbers. Then add two or three sentences with numbers.",
    "<strong>Paragraph four</strong> is Group B. Start with <em>In contrast</em> or <em>By comparison</em>. <em>On the other hand</em> also works.",
    "For a <strong>TREND</strong> (change over time) group, use time order. Give the start, the middle, then the end. The middle may be a peak or a crossover. For a <strong>COMPARE</strong> group, give the biggest first. For a map, give the old map first.",
    "Check each sentence. Is it about this group? A sentence goes with its <strong>subject</strong> (the main noun). Do not give every value of a line.",
    "Maps can group by area or by type of change. One paragraph per category is a list.",
    "Band 7 <strong>Coherence</strong> (organisation) needs clean groups. It says <em>\"information and ideas logically organised\"</em>. It also says <em>\"clear progression throughout\"</em>."
   ],
   "examples": [
    "Paragraph 3. One group in time order.",
    "Paragraph 4. A contrast word, then numbers.",
    "The clothes sentence is in the wrong group."
   ]
  },
  "A2": {
   "key": "Paragraph three is Group A. Paragraph four is Group B. Every sentence belongs to its group.",
   "body": [
    "With two named groups, the paragraphs are easy. <strong>Paragraph three</strong> takes Group A. Open with a <strong>topic sentence</strong> that names the group and its story, before any figures. Then give two or three sentences with figures.",
    "<strong>Paragraph four</strong> opens with a contrast word. Use <em>In contrast</em>, <em>By comparison</em> or <em>On the other hand</em>. Then do the same for Group B.",
    "Sentences follow a natural order. For a <strong>TREND</strong> group, use time order. Give the start value, the middle, then the end value. The middle is a peak, a crossover or a turning point. For a <strong>COMPARE</strong> group, use rank order. Put the biggest first, then the next, then the rest together. For a <strong>map</strong>, describe the old map and then what it became. Then move to the next area.",
    "Test every sentence: <em>does it belong to this group?</em> A sentence goes with the group of its subject. Do not give every value of one line.",
    "A map can be grouped by area or by type of change. One paragraph per category turns the report into a list in which nothing is compared.",
    "Clean groups earn Coherence Band 7: <em>\"information and ideas logically organised\"</em> with <em>\"clear progression throughout\"</em>."
   ],
   "examples": [
    "Paragraph 3: one group in time order (start, turning point, end).",
    "Paragraph 4: a contrast opener, then the second group with figures and a comparison.",
    "The clothes sentence belongs to the other group. Mixed groups confuse the reader."
   ]
  },
  "B1": {
   "key": "Paragraph three is Group A. Paragraph four is Group B. Every sentence in a paragraph belongs to its group.",
   "body": [
    "Once you have two named groups, the paragraphs almost write themselves. <strong>Paragraph three</strong> takes Group A. Open with a <strong>topic sentence</strong> that says what the group is and what it did, before any figures appear. Then give two or three sentences with figures. <strong>Paragraph four</strong> opens with a contrast word (<em>In contrast</em>, <em>By comparison</em>, <em>On the other hand</em>). Then it does the same for Group B.",
    "Inside a paragraph, sentences follow a natural order. For a <strong>TREND</strong> group that is usually time order. Give the start value, the middle (a peak, a crossover, a turning point), then the end value. For a <strong>COMPARE</strong> group it is rank order: the biggest first, then the next, then the rest together. For a <strong>map</strong>, describe what was there on the old map, then what it became. After that, move on to the next area.",
    "The test for every sentence is simple: <em>does this sentence belong to this group?</em> A sentence that mentions both groups goes with the group of its subject. A sentence giving every value of one line belongs nowhere.",
    "Maps have two standard groupings: by area, or by type of change. Whatever you choose, avoid one paragraph per category, because the report becomes a list in which nothing is compared.",
    "A report that keeps its groups clean earns Coherence Band 7: <em>\"information and ideas logically organised\"</em> with <em>\"clear progression throughout\"</em>."
   ],
   "examples": [
    "Paragraph 3: one group in time order, with start, turning point and end.",
    "Paragraph 4: a contrast opener, then the second group with figures and a comparison.",
    "The clothes sentence belongs to the other group, and mixed groups confuse the reader."
   ]
  },
  "B2": {
   "key": "Paragraph three is Group A. Paragraph four is Group B. Every sentence in a paragraph belongs to its group.",
   "body": [
    "Once you have two named groups, the paragraphs write themselves. <strong>Paragraph three</strong> takes Group A. Open with a <strong>topic sentence</strong> that says what the group is and what it did, before any figures appear, then give two or three sentences with figures. <strong>Paragraph four</strong> opens with a contrast word (<em>In contrast</em>, <em>By comparison</em>, <em>On the other hand</em>), which tells the reader that the group has changed. It then does the same for Group B.",
    "Inside a paragraph, sentences follow a natural order. For a <strong>TREND</strong> group that is usually time order: the start value, the middle (a peak, a crossover, a turning point), then the end value. The reader can then follow the line with a finger. For a <strong>COMPARE</strong> group it is rank order: the biggest first, then the next, then the rest together. For a <strong>map</strong>, describe what the old map showed, then what it became, and only then move to the next area. A sentence that refers back to the previous one must stay next to it.",
    "The test for every sentence is simple: <em>does this sentence belong to this group?</em> A sentence that mentions both groups, such as a crossover, belongs with the group that is its grammatical subject. A sentence giving every value of one line does not belong anywhere.",
    "Maps have two standard groupings, by area or by type of change; either works if each paragraph has a clear name and every feature has one home. What never works is one paragraph per category, which turns the report into a list in which nothing is compared.",
    "A report that keeps its groups clean earns Coherence Band 7: <em>\"information and ideas logically organised\"</em> with <em>\"clear progression throughout\"</em>. The examiner sees the plan on the page."
   ],
   "examples": [
    "Paragraph 3: one group in time order, moving from the start through the turning point to the end.",
    "Paragraph 4: a contrast opener, then the second group with figures and a comparison inside the group.",
    "The clothes sentence belongs to the other group. Mixed groups blur the plan and confuse the reader."
   ]
  }
 },
 "m05s3": {
  "A1": {
   "key": "Keep three to five numbers for each group. Leave the rest out.",
   "body": [
    "Do not write every number. The task says <em>\"select the main features\"</em>. Band 8 says <em>\"skilfully selected\"</em>. Band 5 says <em>mechanical</em>. Leaving numbers out is a skill. So a Band 8 paragraph often has fewer numbers.",
    "For a <strong>TREND</strong> group, keep four things. Keep the <strong>first</strong> and the <strong>last</strong> value. Keep the <strong>extreme</strong> (highest or lowest point). Add one <strong>comparison</strong> with the other group.",
    "For a <strong>COMPARE</strong> group, keep the <strong>largest</strong> and <strong>smallest</strong>. Add one <strong>multiple</strong>, like <em>twice as much</em>. Totals can prove it. Keep the <strong>exception</strong> (the odd one out).",
    "Leave middle values out. Keep one only for a crossover or a crash. Give middle ones a <strong>range</strong>: <em>between 5 and 9 hours</em>. A flat line also gets a range.",
    "Would a news headline use this number? If not, leave it out. Fewer numbers mean fewer mistakes."
   ],
   "examples": [
    "First, last, and one key middle event.",
    "Largest, second, smallest. Group the middle three.",
    "Six numbers, no choice. Keep the first and last."
   ]
  },
  "A2": {
   "key": "For each group keep three to five figures: first, last, extreme and one comparison.",
   "body": [
    "Choosing is the second half of grouping. A line graph may have eighteen values, but a Band 8 report uses perhaps eight. The task says <em>\"select the main features\"</em>. Band 8 rewards features that are <em>\"skilfully selected\"</em>, while Band 5 describes <em>mechanical</em> reporting. So a good paragraph often has fewer figures, better chosen.",
    "For a <strong>TREND</strong> group, keep four figures. Keep the <strong>first</strong> and <strong>last</strong> values and the <strong>extreme</strong> (a peak or a low). Add one <strong>comparison</strong> with the other group.",
    "For a <strong>COMPARE</strong> group, keep the <strong>largest</strong> and the <strong>smallest</strong>. Add one <strong>multiple or gap</strong>, such as <em>almost twice as much</em>. Totals can prove a multiple. Also keep the <strong>exception</strong>: the one that goes the other way.",
    "Middle values appear only if something happens there, like a crossover or a collapse. Middle categories can share one <strong>range</strong>: <em>between 5 and 9 hours</em>. So can a line that stays level.",
    "A useful test: would a news headline mention this figure? If not, leave it out. Fewer figures mean fewer errors and more time to check."
   ],
   "examples": [
    "First, last, and the one middle event that matters.",
    "Largest, second and smallest. The three middle slices can go together.",
    "Six figures and no selection. Keep only the first and the last."
   ]
  },
  "B1": {
   "key": "For each group keep three to five figures: the first, the last, the extreme and one comparison. Leave the rest out on purpose.",
   "body": [
    "Selecting is the second half of grouping. A line graph with three lines and six years has eighteen values. A Band 8 report uses perhaps eight of them. The task asks you to <em>\"select the main features\"</em>. Band 8 Task Achievement rewards features that are <em>\"skilfully selected\"</em>, while Band 5 describes <em>mechanical</em> reporting. Leaving things out is not laziness; it is the skill being tested. A top-band paragraph often uses fewer numbers than a weak one.",
    "The figures that survive are predictable. For a <strong>TREND</strong> group, keep the <strong>first</strong> value, the <strong>last</strong> value and the <strong>extreme</strong> (a peak or a low). Add one <strong>comparison</strong> with the other group. For a <strong>COMPARE</strong> group, keep the <strong>largest</strong>, the <strong>smallest</strong>, and one <strong>multiple or gap</strong> (<em>almost twice as much</em>). Totals can prove a multiple. Keep the <strong>exception</strong> too: the one item that moves against the others.",
    "Middle values only appear if something happens there, such as a crossover or a collapse. Middle categories, or a series that hardly moves, can be summarised with one <strong>range</strong>: <em>between 5 and 9 hours</em>.",
    "A useful test: would a newspaper headline mention this figure? The result is a shorter, cleaner paragraph with fewer chances for error. Students who list every value spend their words on the dullest numbers. They then run out of time for the check."
   ],
   "examples": [
    "First, last, and the one middle event that matters.",
    "Largest, second and smallest; the three middle slices can be summarised together.",
    "Six figures and no selection. Keep only the first and the last."
   ]
  },
  "B2": {
   "key": "For each group keep three to five figures: the first, the last, the extreme and one comparison. Leave the rest out on purpose.",
   "body": [
    "Selecting is the second half of grouping. A line graph with three lines and six years has eighteen values; a Band 8 report uses perhaps eight of them. The rubric says <em>\"select the main features\"</em>, and Band 8 Task Achievement rewards features that are <em>\"skilfully selected\"</em>, whereas Band 5 describes <em>mechanical</em> reporting. Leaving things out is not laziness; it is the skill being tested. That is why a top-band detail paragraph often uses fewer numbers than a weak one, and picks them far more carefully.",
    "The figures that survive are predictable. For a <strong>TREND</strong> group: the <strong>first</strong> value, the <strong>last</strong> value, the <strong>extreme</strong> (a peak or a low) and one <strong>comparison</strong> with the other group. For a <strong>COMPARE</strong> group: the <strong>largest</strong>, the <strong>smallest</strong>, and one <strong>multiple or gap</strong> (<em>almost twice as much</em>). Where the multiple is not obvious, the totals that prove it are worth keeping. Any <strong>exception</strong>, the one item moving against the rest, is a key feature in its own right.",
    "Middle values only appear if something happens there, such as a crossover or a collapse. Otherwise the in-between categories, or a series that barely moves, can be handled in half a sentence with a <strong>range</strong>: <em>between 5 and 9 hours</em>.",
    "A useful test: would a newspaper headline mention this figure? A rise of 80% in a decade is news; a single value in a middle year on a steady slope is not. The result is a shorter, cleaner paragraph with fewer chances for error. Students who list every value spend their word budget on the least interesting numbers and run out of time for the check. Fewer, better-chosen figures are what moves a report up the bands."
   ],
   "examples": [
    "First, last, and the single middle event that changes the story.",
    "Largest, second and smallest; the three middle slices can be summarised together in one range.",
    "Six figures and no selection at all. Keep the first and last values and drop the rest."
   ]
  }
 },
 "m06s1": {
  "A1": {
   "key": "Learn verb and noun pairs: rose / a rise, fell / a fall. Use past simple.",
   "body": [
    "<strong>TREND mode</strong> (charts with years) has a small verb kit. Up: <em>rose</em>, <em>increased</em>, <em>grew</em>. Down: <em>fell</em>, <em>dropped</em>, <em>declined</em>. Flat: <em>remained stable</em>, <em>levelled off</em>. Up and down many times: <em>fluctuated</em>. Up again after a fall: <em>recovered</em>.",
    "A huge, sudden fall: <em>plummeted</em>. <em>Declined</em> is too weak for that. A small, short fall: <em>dipped</em>.",
    "Each verb has a <strong>noun</strong> partner. Learn the pairs: rose / a rise, fell / a fall. Also: dropped / a drop, peaked / a peak. Noun pattern: <em>There was a fall in sales</em>. After <em>a</em>, use the noun, not <em>rose</em>. Before the noun, use an adjective: <em>a sharp rise</em>.",
    "Past years need the <strong>past simple</strong>. Irregular: rise → rose, fall → fell, grow → grew. <em>Rised</em> is not a word. Use the <strong>S3</strong> pattern. <em>Sales fell from 900 to 400.</em> Add a year after each number.",
    "Look at the <strong>whole line</strong>, start to end. One small bump is not <em>fluctuated</em>. Down overall? It <em>fell</em>."
   ],
   "examples": [
    "Verb pattern, past simple, <em>from</em> … <em>to</em>.",
    "Noun pattern: <em>a rise in</em> + the thing.",
    "Two mistakes. <em>Rised</em> is not a word. The line goes down.",
    "<em>Grew</em> is another word for <em>rose</em>. Good for a big, long rise."
   ]
  },
  "A2": {
   "key": "Every change has a verb and a noun: rose / a rise, fell / a fall. Use the past simple.",
   "body": [
    "<strong>TREND mode</strong> (a chart with years) uses a small, closed set of verbs. Up: <em>rose</em>, <em>increased</em>, <em>grew</em>, <em>climbed</em>. Down: <em>fell</em>, <em>decreased</em>, <em>dropped</em>, <em>declined</em>. Flat: <em>remained stable</em>, <em>levelled off</em>, <em>plateaued</em>. Up and down again and again: <em>fluctuated</em>. Up again after a fall: <em>recovered</em>.",
    "Some verbs also show size. A very big, sudden fall <em>plummeted</em> or <em>collapsed</em>. For that line, <em>declined</em> is true but too weak. A small, short fall only <em>dipped</em>.",
    "Each verb has a <strong>noun</strong> partner: a rise, a fall, a drop, a peak. The noun gives a second pattern: <em>There was a rise in ticket sales</em>. Using both patterns shows <strong>range</strong>. After <em>a</em> you need the noun, not <em>rose</em> or <em>risen</em>. Before the noun you need an adjective (<em>sharp</em>), not an adverb (<em>sharply</em>).",
    "Past years need the <strong>past simple</strong>, not <em>rises</em>, <em>has risen</em> or <em>is rising</em>. Learn the irregular forms: rise → rose, fall → fell, grow → grew. <em>Rised</em> does not exist. The basic <strong>S3</strong> pattern is: <em>Sales fell from 900 in 2015 to 400 in 2020</em>.",
    "Choose a verb for the <strong>whole line</strong>. Compare the first and the last figure. One small bump does not make a line <em>fluctuate</em>. If it goes down overall, it <em>fell</em>."
   ],
   "examples": [
    "Verb pattern in the past simple, with <em>from</em> … <em>to</em> and a year after each number.",
    "Noun pattern: <em>There was a rise in</em> + the thing that changed.",
    "Two mistakes: <em>rised</em> is not a word, and the line goes down.",
    "<em>Grew</em> is a good change from <em>rose</em> for a long, strong increase."
   ]
  },
  "B1": {
   "key": "Learn each trend verb with its noun (rose / a rise, fell / a fall) and use the past simple.",
   "body": [
    "<strong>TREND mode</strong> has a small, closed kit of verbs. Up: <em>rose</em>, <em>increased</em>, <em>grew</em>, <em>climbed</em>. Down: <em>fell</em>, <em>decreased</em>, <em>dropped</em>, <em>declined</em>. Flat: <em>remained stable</em>, <em>levelled off</em>, <em>plateaued</em>. Up and down several times: <em>fluctuated</em>. Back up after a fall: <em>recovered</em>. A student who uses ten verbs correctly scores higher than one who uses thirty badly.",
    "A few verbs also carry size. A huge, sudden fall, such as from 80,000 to 2,000, <em>plummeted</em> or <em>collapsed</em>. <em>Declined</em> would be true but too weak for it. <em>Dipped</em> means only a small, short drop.",
    "Each verb has a <strong>noun partner</strong>: rise / a rise, fall / a fall, drop / a drop, peak / a peak. The noun gives you a second pattern: <em>There was a rise in ticket sales</em> instead of <em>Ticket sales rose</em>. Using both is what the examiner calls <strong>range</strong>. After <em>a</em> you need the noun, never a verb form like <em>rose</em> or <em>risen</em>. An adjective goes before the noun (<em>a sharp rise</em>), not an adverb.",
    "Past years take the <strong>past simple</strong>; present forms tell the examiner you ignored the dates. Watch the irregular forms: rise → rose, fall → fell, grow → grew. <em>Rised</em> does not exist. The core <strong>S3</strong> pattern is subject + verb + <em>from</em> start value + year + <em>to</em> end value + year.",
    "Choose the verb that is true of the <strong>whole line</strong>, not one moment. A line that falls with one small bump still <em>fell</em>; one bump does not make it <em>fluctuate</em>. A verb that does not match the data costs Task Achievement."
   ],
   "examples": [
    "Verb form in the past simple, with <em>from</em> … <em>to</em> and both years.",
    "Noun form: <em>a rise in</em> + subject. Same fact, different pattern.",
    "Wrong form and wrong direction. The line goes down, so <em>fell</em>.",
    "<em>Grew</em> is a good alternative to <em>rose</em> for a long, strong increase."
   ]
  },
  "B2": {
   "key": "Every change has a verb form and a noun form (rose / a rise, fell / a fall): learn them in pairs and use the past simple for past dates.",
   "body": [
    "<strong>TREND mode</strong> has a small, closed kit. <em>Up:</em> rose, increased, grew, climbed. <em>Down:</em> fell, decreased, dropped, declined. <em>Flat:</em> remained stable, levelled off, plateaued. <em>Up and down:</em> fluctuated. <em>Back up after a fall:</em> recovered. A student who uses ten verbs correctly scores higher than one who uses thirty badly, so learn these until they are automatic.",
    "Some verbs build the size of the change into the word. A collapse, such as a fall from 80,000 to 2,000 in two years, <em>plummeted</em> or <em>collapsed</em>; <em>declined</em> is accurate but far too weak for it. At the other end, <em>dipped</em> means a small, brief drop, so it would understate a collapse.",
    "Each verb has a <strong>noun partner</strong>: rise / a rise, increase / an increase, fall / a fall, drop / a drop, decline / a decline, peak / a peak. The noun gives you a second pattern: <em>There was a rise in ticket sales</em> instead of <em>Ticket sales rose</em>. Using both is what the examiner calls <strong>range</strong>. Keep the noun phrase clean. After <em>a</em> comes the noun, never <em>rose</em> or <em>risen</em>, and the word before it is an adjective (<em>a sharp rise</em>), not an adverb.",
    "Past years take the <strong>past simple</strong>; <em>rises</em>, <em>has risen</em> or <em>is rising</em> tell the examiner you have not looked at the dates. Watch the irregular forms: rise → rose (not <em>rised</em>, which does not exist), fall → fell, grow → grew. The most useful sentence in this mode is <strong>S3</strong>: subject + past simple verb + <em>from</em> start value + year + <em>to</em> end value + year.",
    "Finally, choose the verb that is true of the <strong>whole line</strong>. Compare the first and last values before you look at the wiggles. A line that drifts downwards with one small bump still <em>fell</em>; one bump does not make it <em>fluctuate</em>. The verb must match the data, or Task Achievement pays for it."
   ],
   "examples": [
    "Verb form, past simple, <em>from</em> … <em>to</em> with a year after each figure: the S3 frame.",
    "Noun form: <em>a rise in</em> + subject. The same fact in a second pattern shows range.",
    "Wrong form and wrong direction. <em>Rised</em> does not exist, and the line goes down, so <em>fell</em>.",
    "<em>Grew</em> is a good alternative to <em>rose</em> for a long, strong increase."
   ]
  }
 },
 "m06s2": {
  "A1": {
   "key": "Add a size word to every trend verb. Match it to the numbers.",
   "body": [
    "A verb gives the direction. A <strong>degree word</strong> (a size word) gives how much. After a verb, use the adverb: <em>rose sharply</em>. Before a noun, use the adjective: <em>a sharp rise</em>.",
    "Big change: <em>dramatically</em>, <em>sharply</em>, <em>significantly</em>, <em>considerably</em>. Small change: <em>slightly</em>, <em>marginally</em>. A move from 20% to 19% is <em>marginal</em>. A move from 10% to 70% is <em>dramatic</em>. A big word for a tiny change is an error.",
    "<strong>Pace</strong> words say how fast or smooth: <em>gradually</em>, <em>steadily</em>, <em>rapidly</em>. They do not say how big. <em>Gradual</em> is about speed, not size. A line can rise steadily and considerably.",
    "<strong>S3</strong>: <em>Prices rose sharply from 10 to 40</em>. <strong>S4</strong>: <em>There was a sharp rise in prices</em>. Add a year after each number.",
    "<em>From</em> goes with the start number. <em>To</em> goes with the end number. <em>By</em> gives the size of the change. So: from 20% to 30%, or by 10 percentage points."
   ],
   "examples": [
    "S3 with an adverb. A 32-point fall is dramatic.",
    "S4 with an adjective. One point is marginal.",
    "Pace word: the line climbs fast, with no stop.",
    "About 15% down over ten years. Not dramatic. It fell slowly: <em>gradually</em>."
   ]
  },
  "A2": {
   "key": "Add one degree word to every trend verb. Match it to the size of the change.",
   "body": [
    "A trend verb gives the direction. A <strong>degree word</strong> says how much. Use an adverb after a verb: <em>rose sharply</em>, <em>fell slightly</em>. Use an adjective before a noun: <em>a sharp rise</em>, <em>a slight fall</em>. Learn the pairs: sharp / sharply, dramatic / dramatically, considerable / considerably, slight / slightly, marginal / marginally.",
    "Big change: <em>dramatically</em>, <em>sharply</em>, <em>significantly</em>, <em>considerably</em>. Medium: <em>moderately</em>. Small: <em>slightly</em>, <em>marginally</em>. A fall from 50% to 49% is <em>marginal</em>. A rise from 10% to 70% is <em>dramatic</em>. Calling a one-point change dramatic is an accuracy error.",
    "<strong>Pace</strong> words say how fast and smooth the change was: <em>gradually</em>, <em>steadily</em>, <em>rapidly</em>. They do not give the size. A line that climbs evenly for ten years rose steadily. One that jumps in two years rose rapidly. A line can rise both steadily and considerably.",
    "Two patterns carry most detail sentences. <strong>S3</strong>: <em>Prices rose sharply from 10 in 2010 to 40 in 2020</em>. <strong>S4</strong>: <em>There was a sharp rise in prices, from 10 to 40</em>.",
    "Use <em>from</em> for the start value and <em>to</em> for the end value. Use <em>by</em> only for the size of the change. A share that moves from 20% to 30% rose <em>by</em> 10 percentage points."
   ],
   "examples": [
    "S3 with a degree adverb. A 32-point fall deserves <em>dramatically</em>.",
    "S4 with a degree adjective. One point is marginal.",
    "Pace word: the line climbs fast and without a pause.",
    "About 15% down over ten years. <em>Dramatically</em> is too strong; <em>gradually</em> fits the slow pace."
   ]
  },
  "B1": {
   "key": "Add one degree word to every trend verb and match it to the size: sharply for big, slightly for small.",
   "body": [
    "A bare verb gives only the direction. A <strong>degree word</strong> says how much. Use verb + adverb (<em>rose sharply</em>, <em>fell slightly</em>) or adjective + noun (<em>a sharp rise</em>, <em>a slight fall</em>). An adjective after a verb is a word-form error. Learn the pairs: sharp / sharply, dramatic / dramatically, significant / significantly, considerable / considerably, moderate / moderately, slight / slightly, marginal / marginally.",
    "Big changes take <em>dramatically</em>, <em>sharply</em>, <em>significantly</em> or <em>considerably</em>. Small ones take <em>slightly</em> or <em>marginally</em>. The degree must match the data. A fall from 50% to 49% is <em>marginal</em>; a rise from 10% to 70% is <em>dramatic</em>. Calling a one-point change dramatic is an accuracy error, not a vocabulary success. Lexical Resource Band 7 rewards <strong>precision</strong>, and precision means the word fits the number.",
    "Some words describe <strong>pace</strong> rather than size. <em>Gradually</em>, <em>steadily</em> and <em>rapidly</em> say how fast and how smooth the change was. A line that climbs evenly for ten years rose steadily. So a line can rise both steadily and considerably. <em>Gradual</em> never tells the reader how big the change was.",
    "Two patterns carry almost every TREND detail sentence. <strong>S3</strong>: subject + verb + adverb + <em>from</em> X in year + <em>to</em> Y in year. <strong>S4</strong>: <em>There was a</em> + adjective + rise/fall + <em>in</em> subject, from X to Y. Use both in one report.",
    "Prepositions matter too. <em>From</em> marks the start value and <em>to</em> the end value. <em>By</em> gives only the size of the change. A share that moves from 20% to 30% rose by 10 percentage points, not by 10%."
   ],
   "examples": [
    "S3 with a degree adverb. A 32-point fall deserves <em>dramatically</em>.",
    "S4 with a degree adjective. One point means marginal.",
    "Pace word: the line climbs fast and without a pause.",
    "About 15% down, spread over ten years. <em>Dramatically</em> overstates the size; <em>gradually</em> fits the steady pace."
   ]
  },
  "B2": {
   "key": "Add one degree word to every trend verb and make it match the size of the change: sharply for big, slightly for small.",
   "body": [
    "A bare verb says the direction; a <strong>degree word</strong> says how much. Two forms do the job: verb + adverb (<em>rose sharply</em>, <em>fell slightly</em>) and adjective + noun (<em>a sharp rise</em>, <em>a slight fall</em>). Mixing them up, as in <em>fell slight</em> or <em>a slightly fall</em>, is a word-form error. Learn the pairs together: sharp / sharply, dramatic / dramatically, significant / significantly, considerable / considerably, moderate / moderately, slight / slightly, marginal / marginally.",
    "The degree must match the data. A share that moves from 50% to 49% has changed <em>marginally</em>; one that climbs from 10% to 70% has changed <em>dramatically</em>. Calling a one-point change \"dramatic\" is an accuracy error, not a vocabulary success. Lexical Resource Band 7 rewards <strong>precision</strong>, and precision means the word fits the number.",
    "Some words describe <strong>pace</strong> rather than size: <em>gradually</em>, <em>steadily</em> and <em>rapidly</em> say how fast and how smoothly the change happened. A line that climbs evenly for ten years <em>rose steadily</em>; one that jumps within two years <em>rose rapidly</em>. Pace and size are separate questions, so a line can rise both steadily and considerably. <em>Gradual</em> on its own never tells the reader how large a change was.",
    "Two patterns carry almost every detail sentence in TREND mode. <strong>S3</strong>: subject + rose/fell + adverb + <em>from</em> X in year + <em>to</em> Y in year. <strong>S4</strong>: <em>There was a</em> + adjective + rise/fall + <em>in</em> subject, from X to Y. Use both in the same report.",
    "Finally, keep the prepositions straight. <em>From</em> marks the start value and <em>to</em> the end value; <em>by</em> gives only the size of the change. A share that moves from 20% to 30% has risen by 10 percentage points, never \"by 10%\", and mixing up <em>to</em> and <em>by</em> changes the meaning of the sentence."
   ],
   "examples": [
    "S3 with a degree adverb. A 32-point fall deserves <em>dramatically</em>.",
    "S4 with a degree adjective. A one-point change is marginal.",
    "Pace word: the line climbs fast and without pause.",
    "About 15% down, spread over ten years. <em>Dramatically</em> does not fit the size; <em>gradually</em> fits the steady pace."
   ]
  }
 },
 "m06s3": {
  "A1": {
   "key": "Highest point: peaked at. Lowest: hit a low of. Future: is expected to.",
   "body": [
    "Report the top and bottom. Highest: <em>peaked at</em> or <em>reached a high of</em>. Lowest: <em>hit a low of</em>. Use <em>at</em> after <em>peaked</em> and <em>stood</em>. Use <em>of</em> after <em>a high</em> or <em>a low</em>. <em>In</em> goes with the year.",
    "Then say what came next. <em>Prices peaked at 50 before falling.</em> <em>Sales hit a low of 5, then recovered.</em> Flat line? Use <em>levelled off at</em>. A line that goes back up did not level off.",
    "A dotted line shows the <strong>future</strong>. These are <strong>projections</strong> (future guesses). After the last real year, change the tense. Use <em>is expected to</em> or <em>is projected to</em>. <em>Is forecast to</em> and <em>will</em> work too. Past or present forms say it already happened. Use <em>by</em> with a future year: <em>by 2050</em>.",
    "One sentence can have two times. <em>Rents peaked in 2015 and will fall by 2035.</em> Each verb matches its year.",
    "One line goes above another? Say so: <em>overtook</em>."
   ],
   "examples": [
    "Highest point, then what came next: <em>before</em> + -ing.",
    "Lowest point, then up again. <em>Of</em> after <em>a low</em>.",
    "A future year, so a projection verb.",
    "2045 is after the last real year. No past simple."
   ]
  },
  "A2": {
   "key": "Highest point: peaked at. Lowest point: hit a low of. Future years: is expected to.",
   "body": [
    "The highest and lowest points of a line are always <strong>key features</strong>. Highest: <em>peaked at</em>, <em>reached a high of</em>, <em>reached a peak of</em>. Lowest: <em>hit a low of</em>, <em>fell to a low of</em>, <em>bottomed out at</em>. After <em>peaked</em> or <em>stood</em>, use <em>at</em>. After <em>a high</em> or <em>a low</em>, use <em>of</em>. <em>In</em> goes with the year.",
    "Then say what happened next. <em>Prices peaked at 50 in 2015 before falling slightly.</em> Or: <em>Sales hit a low of 5 and then recovered.</em> This joins two facts in one sentence. If the line stops moving, use <em>levelled off at</em>. A line that goes back up has not levelled off.",
    "Some graphs draw a dotted line into the future. Everything after the last real year is a <strong>projection</strong> (a forecast). Use <em>is expected to</em>, <em>is projected to</em>, <em>is forecast to</em> or <em>will</em>. Past and present forms say the figure is already true, so they are wrong. With a future year, <em>by 2050</em> is natural: at some point up to then.",
    "One sentence can hold two time frames. <em>Rents peaked in 2015 and will fall by 2035.</em> Each verb must match its own year. If one line goes above another, report it: <em>overtook</em>."
   ],
   "examples": [
    "Peak plus what happened next, joined with <em>before</em> + -ing.",
    "Low point plus recovery. <em>Of</em> after <em>a low</em>.",
    "Future year, so a projection verb, not <em>declined</em>.",
    "2045 is after the last real figure (2025). Past simple is wrong here."
   ]
  },
  "B1": {
   "key": "Use \"peaked at\" for the top, \"hit a low of\" for the bottom and \"is expected to\" for future years.",
   "body": [
    "The extremes of a line are always <strong>key features</strong>. For the highest point, write <em>peaked at</em>, <em>reached a high of</em> or <em>reached a peak of</em>. For the lowest point, write <em>hit a low of</em>, <em>fell to a low of</em> or <em>bottomed out at</em>. The preposition after <em>peaked</em> (and <em>stood</em>) is always <em>at</em>, because it names a fixed point. After <em>a high</em> or <em>a low</em> it is <em>of</em>. <em>To</em> and <em>by</em> belong with rose and fell.",
    "After a peak or a low, say what happened next. <em>Prices peaked at 50 in 2015 before falling slightly.</em> <em>Sales hit a low of 5 in 2009 and then recovered strongly.</em> This turns two facts into one complex sentence, which Band 7 grammar asks for. If the line stops moving, use <em>levelled off at</em> or <em>plateaued at</em>. A line that climbs again has not levelled off.",
    "<strong>Projections</strong> change the tense. Some graphs draw a dotted line into the future. Everything after the last real year is a forecast. Write <em>is expected to</em>, <em>is projected to</em>, <em>is forecast to</em> or <em>will</em>. Past and present forms claim the figure is already true. <em>By 2050</em> is the natural preposition, meaning at some point up to that year.",
    "One sentence can hold two time frames if each verb matches its year. <em>Rents peaked in 2015 and are expected to fall to 900 by 2035.</em> Also look for a <strong>crossover</strong>, where one line goes above another. Report it with <em>overtook</em> and the year."
   ],
   "examples": [
    "Peak plus what happened next, joined with <em>before</em> + -ing.",
    "Low point plus recovery. Note <em>of</em> after <em>a low</em>.",
    "Future year, so a projection verb, not <em>declined</em>.",
    "2045 is after the last real figure (2025). Past simple is wrong here."
   ]
  },
  "B2": {
   "key": "Name the highest point with \"peaked at\", the lowest with \"hit a low of\", and use \"is expected to\" for any year in the future.",
   "body": [
    "The extremes of a line are always <strong>key features</strong>. The highest point: <em>peaked at</em>, <em>reached a high of</em>, <em>reached a peak of</em>. The lowest point: <em>hit a low of</em>, <em>bottomed out at</em>, <em>fell to a low of</em>. The preposition after <em>peaked</em> (and <em>stood</em>) is always <em>at</em>, because it names a fixed point rather than a movement; after <em>a high</em> or <em>a low</em> it is <em>of</em>. <em>To</em> and <em>by</em> belong with rose and fell, and <em>in</em> goes with the year.",
    "After a peak or a low, say what happened next. <em>Prices peaked at 50 in 2015 before falling slightly</em>; <em>sales hit a low of 5 in 2009 and then recovered strongly</em>. This turns two facts into one sentence, which is the complex structure Band 7 grammar asks for. If the line stops moving, use <em>levelled off at</em> or <em>plateaued at</em>, but a line that climbs again straight after its low has not levelled off.",
    "<strong>Projections</strong> change the tense. Some graphs draw a dotted line into the future, and everything after the last real year is a forecast. Write <em>is expected to reach</em>, <em>is projected to fall to</em>, <em>is forecast to</em>, or <em>will reach … by 2050</em>. <em>By</em> means at some point up to that year, which is the natural preposition for a forecast. Past simple, present simple or present perfect for a future year all claim the figure is already true: a clear tense error that the examiner sees at once.",
    "One sentence can hold two time frames as long as each verb matches its year: <em>Rents peaked in 2015 and are expected to fall to 900 by 2035.</em> Writing the past peak in the present (<em>which peaks in 2015</em>) is just as wrong as writing the forecast in the past. Finally, look for a <strong>crossover</strong>, the point where one line rises above another, and report it with <em>overtook</em> and the year."
   ],
   "examples": [
    "Peak plus what happened next, joined with <em>before</em> + -ing.",
    "Low point plus recovery. <em>Of</em> after <em>a low</em>.",
    "Future year, so a projection verb, not <em>declined</em>.",
    "2045 is after the last real figure (2025), so past simple is wrong here."
   ]
  }
 },
 "m07s1": {
  "A1": {
   "key": "No years, no rise or fall. Compare: higher than, the highest, twice as.",
   "body": [
    "Some bar charts show groups, like ages, but no years. This is <strong>COMPARE mode</strong> (comparing groups). There is no time, so nothing rises or falls. Age groups are not years. Do not write <em>rose</em> or <em>fell</em>.",
    "Two things: <strong>comparative</strong> + <em>than</em>. Say <em>more than</em>, not <em>more as</em> or <em>the more</em>. Top or bottom: <em>the</em> + <strong>superlative</strong>, like <em>the lowest</em>. Never drop <em>the</em>. <em>Most</em> never takes <em>than</em>. <em>Most low</em> is wrong. <em>Lower</em> compares only two.",
    "Size of the gap: a <strong>multiple</strong>. Say <em>twice as much as</em>, <em>three times as high as</em>. Divide to check: 20 and 5 make four times.",
    "Use <strong>S5</strong>. <em>A was higher than B, at 9 and 3 respectively.</em> <strong>Respectively</strong> means \"in the same order\". First name, first number. Two names need two numbers. It goes at the end. <strong>S6</strong>: <em>A was twice as high as B</em>.",
    "Close numbers are <em>roughly equal</em>. After a number, add -s: <em>three days</em>."
   ],
   "examples": [
    "S5: <em>far higher than</em>, two numbers, <em>respectively</em>.",
    "S6 multiple: 12 is three times 4.",
    "Close numbers: <em>roughly equal</em>. No trend verb.",
    "No years, so nothing fell. Compare the groups."
   ]
  },
  "A2": {
   "key": "When nothing moves through time, nothing rises or falls. Use higher than, the highest, twice as much as.",
   "body": [
    "Some charts show categories (age groups, subjects, countries) but no years. They are in <strong>COMPARE mode</strong>. Nothing rises or falls, because there is no time for it to change in. Age groups going from young to old are still categories, not years. So <em>gaming fell with age</em> is a TREND verb on the wrong chart.",
    "Three tools do most of the work. A <strong>comparative</strong> compares two bars and takes <em>than</em>: <em>more than</em>, <em>higher than</em>. Not <em>more as</em>, and not <em>the more</em>. A <strong>superlative</strong> names the extreme with <em>the</em> + -est: <em>the highest</em>, <em>the lowest</em>. <em>Lower</em> compares only two; <em>most low</em> is not English; <em>most</em> never takes <em>than</em>. A <strong>multiple</strong> gives the size of the gap: <em>twice as much as</em>. Divide to check it.",
    "<strong>S5</strong>: <em>A was far higher than B, at 9 and 3 respectively</em>. <strong>Respectively</strong> means \"in the same order\", so the first figure goes with the first name. It needs two figures for two names, and it goes at the end. <strong>S6</strong>: <em>A was twice as high as B</em>.",
    "Match the degree word to the gap: <em>far higher</em>, <em>slightly lower</em>, <em>roughly equal</em>. Remember the plural after a number: three day<em>s</em>."
   ],
   "examples": [
    "S5: comparative, degree word, both figures, then <em>respectively</em>.",
    "S6 multiple: 12 books against 4 is three times.",
    "Near-equal bars need <em>roughly equal</em>, not a trend verb.",
    "No time axis, so no falling. Compare instead."
   ]
  },
  "B1": {
   "key": "With no time axis, nothing rises or falls: use higher than, the highest, twice as much as and respectively.",
   "body": [
    "A bar chart with categories on the bottom axis (age groups, subjects, countries) and no years is in <strong>COMPARE mode</strong>. Nothing rises or falls, because there is no time for it to rise or fall in. Age groups that go from young to old are still categories. A student who writes <em>gaming decreased with age</em> has used a TREND verb on a chart with no time.",
    "Three tools do most of the work. <strong>Comparatives</strong> compare two bars and always take <em>than</em>: <em>more than</em>, <em>higher than</em>. Never <em>more as</em> or <em>the more … than</em>. <strong>Superlatives</strong> name the extreme with <em>the</em> + -est form: <em>the highest</em>, <em>the lowest</em>, <em>the most</em>. <em>Lower</em> compares only two things, <em>most low</em> is not English, and a superlative cannot take <em>than</em> or drop <em>the</em>. <strong>Multiples</strong> give the size of the gap: <em>twice as much as</em>, <em>three times as high as</em>. Divide to check, or the multiple becomes an accuracy error.",
    "The first pattern is <strong>S5</strong>: A was far higher than B, at X and Y respectively. The second is <strong>S6</strong>: A was twice as high as B. <strong>Respectively</strong> means \"in the same order\", so the figures follow the order of the names. It needs two figures for two names, and it goes at the end.",
    "Degree words match the gap: <em>far higher</em>, <em>slightly lower</em>, <em>by far the highest</em>. Bars that are almost the same are <em>roughly equal</em>. Remember the plural after a number: three day<em>s</em>, six countrie<em>s</em>."
   ],
   "examples": [
    "S5: comparative, degree word, both figures, then <em>respectively</em>.",
    "S6 multiple: 12 books against 4 is three times as many.",
    "Near-equal bars need a <em>roughly equal</em> phrase, not a trend verb.",
    "No time axis, so no falling. Compare the groups instead."
   ]
  },
  "B2": {
   "key": "When nothing moves through time, nothing rises or falls: rank the bars with higher than, the highest, twice as much as and respectively.",
   "body": [
    "A bar chart with categories on the bottom axis (age groups, subjects, countries) and no years is in <strong>COMPARE mode</strong>. Nothing rises or falls, because there is no time for it to rise or fall in. Age groups arranged from young to old are still categories measured at one moment. So <em>gaming decreased with age</em> puts a TREND verb on a chart with no time, and the examiner notices. The kit is different: <em>higher than</em>, <em>the highest</em>, <em>twice as much as</em>, <em>far more than</em>.",
    "Three tools do most of the work. <strong>Comparatives</strong> compare two bars and always take <em>than</em>: <em>more … than</em>, <em>far higher … than</em>; <em>as</em> belongs only to <em>as much as</em>, and <em>the more</em> is not a comparative. <strong>Superlatives</strong> name the extreme with <em>the</em> + -est: <em>the highest</em>, <em>the lowest</em>, <em>the most</em>. <em>Lower</em> compares two things only, <em>most low</em> is not English, and a superlative neither drops <em>the</em> nor takes <em>than</em>. <strong>Multiples</strong> give the size of the gap: <em>twice as much as</em>, <em>three times as high as</em>. Divide before you write, because a wrong multiple is an accuracy error.",
    "This mode has two patterns. <strong>S5</strong>: A was far / slightly higher than B, at X and Y respectively. <strong>S6</strong>: A was twice as high / much as B. <strong>Respectively</strong> means \"in the same order\": the figures follow the order of the names. There must be one figure per name, and the word goes at the end of the sentence.",
    "Degree words belong here too: <em>far higher</em>, <em>slightly lower</em>, <em>roughly equal</em>, <em>by far the highest</em>. Match them to the gap; bars a few units apart are <em>roughly equal</em>, not <em>higher</em>. And remember the plural after any number above one: three day<em>s</em>, six countrie<em>s</em>."
   ],
   "examples": [
    "S5: comparative + degree word + both figures + <em>respectively</em>.",
    "S6 multiple: 12 books against 4.",
    "Near-equal bars need a <em>roughly equal</em> phrase, not a trend verb.",
    "No time axis, so no falling. Compare instead."
   ]
  }
 },
 "m07s2": {
  "A1": {
   "key": "Pie slices are shares. Use accounted for and fractions, not rose.",
   "body": [
    "One pie chart shows <strong>shares</strong> (parts) of 100%. Nothing moves, so nothing rises. Use <strong>proportion verbs</strong> (share verbs): <em>accounted for</em>, <em>made up</em>, <em>represented</em>. Not <em>increased to</em>, <em>reached</em> or <em>contributed to</em>.",
    "Change a percentage into a <strong>fraction</strong>. A quarter is 25%. A third is 33%. Half is 50%. Add <em>just over</em> or <em>just under</em>. 23% is just under a quarter. 36% is over a third. 46% is almost half. Give the fraction and the number.",
    "<strong>S6</strong> joins verb, number and fraction. <em>Rent accounted for the largest share, at 45%.</em>",
    "Add the big slices: <em>together they made up 70%</em>. Then the rest: <em>the remaining 30%</em>. Two things together take <em>were</em>, not <em>was</em>.",
    "Two pies with two years? The change needs <strong>TREND</strong> verbs. <em>The share of oil fell from 40% to 25%.</em> Inside one year, still use proportion verbs."
   ],
   "examples": [
    "Share verb, <em>the largest</em>, exact number, then the fraction.",
    "Add the big slices. Then the rest in one go.",
    "Two pies, two years. Trend verbs for the change.",
    "One pie, one year. Nothing rose."
   ]
  },
  "A2": {
   "key": "A pie chart shows shares of a whole. Use accounted for, made up and fractions, not trend verbs.",
   "body": [
    "One pie chart is <strong>COMPARE mode</strong>: every slice is a share of 100%. Use <strong>proportion verbs</strong>: <em>accounted for</em>, <em>made up</em>, <em>represented</em>, <em>comprised</em>. <em>Rent accounted for 45% of spending.</em> Do not write <em>increased to</em> or <em>reached</em>, because nothing rose. <em>Contributed to</em> does not take a percentage.",
    "Turn percentages into <strong>fractions</strong> for range. A quarter is 25%, a third is 33% and half is 50%. Add <em>just over</em> or <em>just under</em> to show the side. So 23% is just under a quarter and 36% is over a third. 46% is almost half. Pair the fraction with the exact figure: <em>at 45%, almost half</em>.",
    "<strong>S6</strong> puts it together: proportion verb, <em>the largest share</em>, <em>at</em> + figure, then the fraction. Two more moves help. Add the big slices: <em>Rent and food together made up 70%</em>. Then sweep the small ones: <em>the remaining 30%</em> (100 minus 70). A subject with <em>and</em> is plural, so it takes <em>were</em>.",
    "<strong>Two pie charts for two years</strong> mix modes. Inside each year, use proportion verbs. For the change between them, use TREND verbs: <em>oil fell from 40% to 25%</em>."
   ],
   "examples": [
    "Proportion verb, superlative, figure and fraction in one sentence.",
    "Add the big slices, then sweep the rest.",
    "Two pies, two years: TREND verbs for the change between them.",
    "One pie, one year. Nothing rose."
   ]
  },
  "B1": {
   "key": "A pie chart shows shares: use proportion verbs (accounted for, made up) and fractions, not trend verbs.",
   "body": [
    "A single pie chart is pure <strong>COMPARE mode</strong>: every slice is a share of 100%. The verbs are <strong>proportion verbs</strong>: <em>accounted for</em>, <em>made up</em>, <em>represented</em>, <em>comprised</em>. <em>Rent accounted for 45% of spending.</em> Do not write <em>increased to</em> or <em>reached</em>, because nothing rose. <em>Contributed to</em> does not take a percentage.",
    "Turn percentages into <strong>fractions</strong> to add range. A quarter is 25%, a third about 33% and half 50%. Use <em>just over</em> or <em>just under</em> to show which side you are on. So 23% is just under a quarter and 31% just under a third. 36% is over a third, 46% almost half and 54% just over half. <em>Almost half</em> only fits figures just below 50%, in the mid-to-high forties. Pair the fraction with the exact figure. The fraction shows vocabulary; the figure keeps accuracy.",
    "<strong>S6</strong> joins all of this: proportion verb, superlative, <em>at</em> + figure, fraction. Two moves save words. Combine the big slices: <em>Rent and food together made up 70%, over two-thirds</em>. Then sweep the small ones with <em>the remaining 30%</em>, which is simply 100 minus the big slices. A subject joined by <em>and</em> is plural, so it takes <em>were</em>.",
    "<strong>Two pie charts for two years</strong> are different, because they mix modes. Shares inside each year still take proportion verbs. The change between the years takes TREND language: <em>the share of oil fell from 40% to 25%</em>."
   ],
   "examples": [
    "Proportion verb + superlative + figure + fraction.",
    "Combine the big slices, then sweep the rest.",
    "Two pies, two years: TREND verbs for the change between them.",
    "One pie, one year. Nothing rose."
   ]
  },
  "B2": {
   "key": "A pie chart shows shares of a whole: use proportion verbs (accounted for, made up) and fractions (a third, just under half), not trend verbs.",
   "body": [
    "A single pie chart is pure <strong>COMPARE mode</strong>: every slice is a share of 100%. The verbs are <strong>proportion verbs</strong>: <em>accounted for</em>, <em>made up</em>, <em>represented</em>, <em>comprised</em>. <em>Rent accounted for 45% of spending</em>, not <em>rent rose to 45%</em>: nothing rose, and <em>reached</em> or <em>increased to</em> are TREND verbs. <em>Contributed to</em> looks similar but does not take a percentage.",
    "Percentages become <strong>fractions</strong> to add range. The anchors are a quarter (25%), a third (about 33%) and half (50%); <em>just over</em> and <em>just under</em> show which side of the anchor you are on. So 23% is <em>just under a quarter</em>, 31% <em>just under a third</em>, 36% <em>over a third</em>, 46% <em>almost half</em> and 54% <em>just over half</em>. A fraction that is too generous, such as <em>almost half</em> for a figure in the thirties, is an accuracy error. Pair the fraction with the exact figure: the fraction shows vocabulary; the figure keeps accuracy.",
    "<strong>S6</strong> puts the pieces in one sentence: proportion verb, superlative, <em>at</em> + figure, fraction. Two further moves save words. Combine the big slices: <em>Rent and food together made up 70%, over two-thirds of the total</em>. Then sweep the small ones: <em>the remaining 30%</em>, which is simply 100 minus the combined figure. Agreement still matters, because a subject joined by <em>and</em> is plural: <em>rent and food together were</em>, never <em>was</em>.",
    "<strong>Two pie charts for two years</strong> are different: they mix modes. Shares within each year are still described with proportion verbs. The change between the years, however, takes TREND language: <em>the share of oil fell from 40% to 25%, while solar rose from 5% to 20%</em>. A sentence that only gives the two shares, without saying which way they moved, misses the main point of the second chart."
   ],
   "examples": [
    "Proportion verb + superlative + figure + fraction.",
    "Combine the big slices, then sweep the rest with <em>the remaining</em>.",
    "Two pies, two years: TREND verbs for the change between them.",
    "One pie, one year. Nothing rose."
   ]
  }
 },
 "m07s3": {
  "A1": {
   "key": "Read down and across. Compare whole rows, not one box.",
   "body": [
    "A <strong>table</strong> is a bar chart without bars. Every box looks important. It is not. Read it twice: down each <strong>column</strong>, then along each <strong>row</strong>. Find the biggest and smallest in each. These are the <strong>key features</strong>.",
    "Compare whole rows or columns. Good: <em>Spain had the highest pay and the shortest week.</em> Weak: one box, like <em>Spain's pay was $50,000.</em> One box compares nothing. Two boxes with no comparison are still a list.",
    "Useful words: <em>ranged from … to</em>, <em>in second place</em>, <em>whereas</em>, <em>respectively</em>. <em>Prices ranged from $5 in Laos to $40 in Japan.</em> Add a runner-up: <em>with Korea in second place</em>. Multiples: divide. 40 and 5 make eight times. Not sure? Write <em>far higher</em>. Close numbers are <em>roughly equal</em>.",
    "Check the columns first. Years? Then <strong>TREND</strong>: rose, fell. Other measures? Then <strong>COMPARE</strong>. <em>The number of</em> is singular: <em>was</em>, not <em>were</em>. <em>Fewest</em> needs a plural: <em>the fewest days</em>."
   ],
   "examples": [
    "One whole row in one sentence. Three numbers.",
    "Smallest to biggest in one column. Then a multiple.",
    "Two columns of one row. <em>Whereas</em> shows the contrast.",
    "Three boxes, no comparison. This is just a list."
   ]
  },
  "A2": {
   "key": "Find the biggest and smallest number in each row and column. Compare whole rows, not one box.",
   "body": [
    "A table is a bar chart without the bars, so the same <strong>COMPARE</strong> kit works. The danger is that every box looks equally important. Read the table twice: once down each <strong>column</strong>, once along each <strong>row</strong>. The biggest and smallest number in each row and column are your <strong>key features</strong>.",
    "Then compare whole rows or columns. <em>Spain had the highest pay and the shortest week</em> covers a whole row. <em>Spain's pay was $50,000</em> reports one box and compares nothing. Two boxes from one row with no comparison are still a list.",
    "Use <em>ranged from $5 in Laos to $40 in Japan</em>. Also use <em>in second place</em>, <em>whereas</em> and <em>respectively</em>. Add a runner-up with <em>with</em>: <em>with Korea in second place at $30</em>. Multiples work well because the numbers are exact, but divide first. If you are not sure, write <em>far higher</em>. Very close figures are <em>roughly equal</em>.",
    "Check the mode first. If the columns are years, the table is <strong>TREND</strong> and needs rose and fell. If the columns are measures (pay, hours), it is COMPARE. Watch the grammar: <em>the number of</em> takes <em>was</em>, and <em>fewest</em> needs a plural noun."
   ],
   "examples": [
    "A whole row in one sentence, with three figures.",
    "Range plus multiple: the two ends of one column.",
    "Two columns of one row, contrasted with <em>whereas</em>.",
    "Three boxes and no comparison. The examiner marks this list down."
   ]
  },
  "B1": {
   "key": "Find the extremes in each row and column, and compare whole rows or columns, never one cell.",
   "body": [
    "A table is a bar chart without the bars, so the same <strong>COMPARE</strong> kit applies. The danger is that every cell looks equally important. It is not. Read the table twice: once down each <strong>column</strong> (which country has the highest figure?) and once along each <strong>row</strong> (does one country lead on every measure?). The biggest and smallest number in each row and column are your <strong>key features</strong>.",
    "Then compare <strong>whole rows or columns</strong>. <em>Spain had the highest pay and the shortest week</em> covers a whole row in one sentence. <em>Spain's pay was $50,000</em> reports one cell and compares nothing. Even two cells from one row are only a list if you do not compare them. The first is Band 7 thinking; the second is a list.",
    "Useful table language includes <em>ranged from $5 in Laos to $40 in Japan</em> and <em>in second place</em>. Others are <em>at the other end of the scale</em>, <em>the figure for</em>, <em>whereas</em> and <em>respectively</em>. Add a runner-up with <em>with</em> + noun: <em>with Korea in second place at $30</em>. Multiples work well because the numbers are exact, but only if the division is right. If unsure, write <em>far higher</em>. Very close figures are <em>roughly equal</em>, which is a key feature too.",
    "Check the mode first. If the columns are years, the table is <strong>TREND</strong> and needs rose and fell. If the columns are measures (salary, hours), it is COMPARE. Watch the head noun: <em>the number of days</em> takes <em>was</em>. <em>Fewest</em> goes with a plural noun: <em>the fewest days</em>."
   ],
   "examples": [
    "A whole row in one sentence, with three figures.",
    "Range plus multiple: the two ends of one column.",
    "Two columns of one row contrasted with <em>whereas</em>.",
    "Three cells, no comparison. This is the list the examiner marks down."
   ]
  },
  "B2": {
   "key": "Find the biggest and smallest number in each row and each column, and compare whole rows or columns, never one cell at a time.",
   "body": [
    "A table is a bar chart without the bars, so the same <strong>COMPARE</strong> kit applies. The danger is that every cell looks equally important. It is not. Read the table twice: once <strong>down each column</strong> (which country has the highest starting figure? the longest hours?) and once <strong>along each row</strong> (does one country lead on every measure?). The biggest and smallest number in each row and column are your key features.",
    "Then compare <strong>whole rows or columns</strong>. <em>Spanish doctors had the highest pay and the shortest week</em> covers a whole row in one sentence. <em>Spain's pay was $50,000</em> reports one cell and compares nothing. Two cells from the same row are still a list if neither is ranked against the other countries. The first is Band 7 thinking; the second is a list.",
    "Useful table language: <em>ranged from $5 in Laos to $40 in Japan</em>; <em>in second place</em>; <em>at the other end of the scale</em>; <em>the figure for</em>; <em>whereas</em>; <em>respectively</em>. <em>With</em> + noun adds a runner-up without a new sentence: <em>with Korea in second place at $30</em>. Multiples work well here because the numbers are exact, but divide before you write; if the result is not close to a whole number, <em>far higher</em> is safer. Near-equal figures are a key feature too and deserve <em>roughly equal</em> or <em>similar</em>.",
    "Check the mode first. If the columns are years, the table is <strong>TREND</strong> and needs rose and fell; if the columns are measures (salary, hours), it is COMPARE. And watch the grammar. The head noun of <em>the number of days</em> is <em>number</em>, so the verb is <em>was</em>; <em>fewest</em> goes with a plural countable noun, as in <em>the fewest days</em>."
   ],
   "examples": [
    "A whole row in one sentence, with three figures.",
    "Range + multiple: the extremes of one column.",
    "Two columns of one row contrasted with <em>whereas</em>.",
    "Three cells, no comparison. This is the list the examiner marks down."
   ]
  }
 },
 "m08s1": {
  "A1": {
   "key": "A process has no dates: present simple. Man-made: passive. Natural: active.",
   "body": [
    "A <strong>process</strong> diagram shows stages, not years. So use the <strong>present simple</strong>. No past, no future, no present perfect. Not <em>is drying</em> either: that means right now.",
    "<strong>Man-made</strong> process: people or machines do the work. Use the <strong>passive</strong>: <em>is</em> or <em>are</em> + past participle. One thing: <em>The sugar is heated</em>. Many things: <em>The beans are dried</em>.",
    "<strong>Natural</strong> process: it happens by itself. Use the active: <em>the seed grows</em>, <em>the flower opens</em>. Do not write <em>the seed is grown</em>. That sounds like someone did it.",
    "Labels on the diagram are often nouns. You make the verbs. <em>Collected</em>: picked up. <em>Transported</em>: moved, for example by lorry. <em>Sorted</em>: put into groups. <em>Crushed</em>: broken into small pieces. <em>Melted</em>: made liquid by heat. <em>Moulded</em>: given a shape. Put the diagram details in your sentence."
   ],
   "examples": [
    "Man-made, many cherries: <em>are</em> + past participle.",
    "One thing: <em>is</em> + past participle. Details included.",
    "Natural: active present simple.",
    "No dates, so no past tense."
   ]
  },
  "A2": {
   "key": "A process has no dates, so use the present simple. Man-made steps are passive; natural steps are active.",
   "body": [
    "A process diagram shows <strong>stages</strong>, not years. There is no time frame, so every verb is in the <strong>present simple</strong>. The past (<em>were dried</em>) is the most common error. It comes from writing about line graphs. The future and present perfect are wrong too. The continuous (<em>is drying</em>) means right now, so avoid it.",
    "In a <strong>man-made</strong> process, the worker does not matter. Use the <strong>passive</strong>: <em>is</em> / <em>are</em> + past participle. A singular subject takes <em>is</em>: <em>the sugar is heated</em>. A plural subject takes <em>are</em>: <em>the beans are dried</em>.",
    "In a <strong>natural</strong> process, things happen by themselves. Use the <strong>active</strong>: <em>the seed grows</em>, <em>the flower opens</em>. <em>The seed is grown</em> sounds as if someone grew it.",
    "The labels on the picture are usually nouns, so build a verb bank first. <em>Collected</em> means picked up. <em>Transported</em> means moved, for example by lorry. <em>Sorted</em> means put into groups. <em>Crushed</em> means broken into small pieces. <em>Melted</em> means made liquid by heat. <em>Moulded</em> means given a shape. Others are <em>washed</em>, <em>filled</em> and <em>delivered</em>. Add the details from the diagram, such as a temperature."
   ],
   "examples": [
    "Man-made, plural subject: <em>are</em> + past participle.",
    "Singular subject: <em>is</em> + past participle, with the diagram details.",
    "Natural process: active present simple.",
    "No dates, so no past tense."
   ]
  },
  "B1": {
   "key": "A process has no dates, so it takes the present simple: man-made steps are passive, natural steps are active.",
   "body": [
    "A process diagram shows <strong>stages</strong>, not years. There is no time frame, so every verb is in the <strong>present simple</strong>. The past simple (<em>were dried</em>) is the most common tense error in this mode. It comes from habit after weeks of line graphs. The present perfect and the future attach a time the diagram does not give. The continuous (<em>is drying</em>) means right now.",
    "A <strong>man-made</strong> process (recycling, manufacturing, producing) does not care who does the work. So its natural voice is the <strong>passive</strong>: be + past participle. A singular subject takes <em>is</em> (<em>the sugar is heated</em>); a plural subject takes <em>are</em> (<em>the beans are dried</em>). An active form like <em>the beans dry</em> would make the material do the job.",
    "In a <strong>natural</strong> process (a life cycle, the water cycle), things happen by themselves. So the verbs are <strong>active</strong>: <em>the seed grows</em>, <em>the flower opens</em>. Writing <em>the seed is grown</em> sounds as if someone grew it.",
    "The verbs come from you, not from the diagram, because the labels are usually nouns. Build a verb bank before you write: <em>collected</em>, <em>transported</em> (moved by lorry), <em>washed</em>, <em>sorted</em> (put into groups). Then <em>crushed</em> (broken into small pieces), <em>melted</em> (made liquid by heat), <em>moulded</em> (given a shape), <em>filled</em>, <em>delivered</em>. Each label becomes a passive verb, and that earns Lexical Resource. The details on the picture, such as a temperature, go into the sentence."
   ],
   "examples": [
    "Man-made, plural subject: <em>are</em> + past participle.",
    "Singular subject: <em>is</em> + past participle. The rollers and the temperature go in the sentence.",
    "Natural process: active present simple. Nobody does it to the seed.",
    "No dates, so no past tense."
   ]
  },
  "B2": {
   "key": "A process has no dates, so it takes the present simple: man-made steps are passive (the beans are dried), natural steps are active (the seed grows).",
   "body": [
    "A process diagram shows <strong>stages</strong>, not years. There is no time frame, so every verb is in the <strong>present simple</strong>. The past simple (<em>were dried</em>) is the most common tense error in this mode, and it comes from habit: students have just spent weeks writing about line graphs. The present perfect and the future fail for the same reason: they attach the event to a time the diagram does not give. The continuous (<em>is drying</em>) suggests something happening right now, so it is wrong as well.",
    "For a <strong>man-made</strong> process (recycling, manufacturing, producing), nobody cares who does the work, so the natural voice is the <strong>passive</strong>: be + past participle. A singular subject takes <em>is</em> (<em>the sugar is heated</em>) and a plural subject takes <em>are</em> (<em>the beans are dried</em>). An active form such as <em>the beans dry</em> wrongly makes the material do the work.",
    "For a <strong>natural</strong> process (a life cycle, the water cycle), things happen by themselves, so the verbs are <strong>active</strong>: <em>the seed grows</em>, <em>the flower opens</em>. Writing <em>the seed is grown</em> sounds as if a gardener were involved. Never use the passive for a step that happens by itself, such as <em>hatches</em> or <em>grows</em>.",
    "The verbs come from you, not from the diagram: the labels are usually nouns (<em>Washing</em>, <em>Sorting</em>, <em>Furnace</em>), so build a verb bank before you write. <em>Collected</em>, <em>transported</em> (moved by lorry), <em>washed</em>, <em>sorted</em> (put into groups), <em>crushed</em> (broken into small pieces), <em>melted</em> (made liquid by heat), <em>moulded</em> (given a shape), <em>filled</em>, <em>delivered</em>. Each label becomes a passive verb, and that is Lexical Resource earned. Any detail printed on the picture, such as a temperature or a material, belongs in the sentence."
   ],
   "examples": [
    "Man-made, plural subject (<em>cherries</em>): <em>are</em> + past participle.",
    "Singular subject (<em>pulp</em>): <em>is</em> + past participle. The details printed on the diagram, the rollers and the temperature, go in the sentence.",
    "Natural process: active present simple, because the seed and the root act by themselves.",
    "No dates, so no past tense: the present simple passive."
   ]
  }
 },
 "m08s2": {
  "A1": {
   "key": "Use a new sequencer for each stage. Do not repeat then.",
   "body": [
    "<strong>Sequencers</strong> (order words) link the stages. Start: <em>At the first stage</em>. Middle: <em>Next</em>, <em>After this</em>, <em>Following this</em>. End: <em>Finally</em>. Use a different one each time. <em>Then, then, then</em> is <em>mechanical</em>: Band 6.",
    "Some sequencers join two stages in one sentence. <em>Once</em> + <em>has been</em> + past participle. <em>Once the milk has been heated, it is cooled.</em> Not <em>had been</em>: that is past. <em>Before being</em> + past participle. <em>The paper is dried before being cut.</em> Nothing goes between <em>being</em> and the participle. Never write <em>before been</em>.",
    "<em>Followed by</em> adds the next thing. Never <em>following by</em>. <em>Following this</em> starts a new sentence.",
    "Times on the diagram are sequencers too: <em>after two days</em>. A cycle ends with <em>after which the cycle begins again</em>."
   ],
   "examples": [
    "<em>Once</em> + <em>has been</em> joins two stages.",
    "<em>Before being</em> joins two stages in one sentence.",
    "Time phrase, <em>which then</em>, <em>followed by</em>: three links.",
    "Four times <em>then</em>. Mechanical. Change the words."
   ]
  },
  "A2": {
   "key": "Use a different sequencer for each stage: next, once … has been, before being, finally.",
   "body": [
    "A process is a chain, and <strong>sequencers</strong> show the links. Start with <em>At the first stage</em>. In the middle, use <em>Next</em>, <em>After this</em>, <em>Following this</em> or <em>At the following stage</em>. End with <em>Finally</em>. Use one per stage and never the same one twice in a row. <em>Then, then, then</em> is what Band 6 calls <em>mechanical</em>.",
    "Three sequencers join two stages in one sentence. <em>Once</em> + <em>has been</em> + past participle: <em>Once the milk has been heated, it is cooled.</em> <em>Had been</em> is past, so it is wrong here. <em>Before being</em> + past participle: <em>The paper is dried before being cut.</em> Nothing comes between <em>being</em> and the participle, and <em>before been</em> is not a form. <em>After which</em> + a full clause: <em>The boxes are packed, after which they are sent out.</em>",
    "In a natural cycle, use the same tools in the active. <em>Followed by</em> adds the next thing; it is never <em>following by</em>. Time phrases from the diagram (<em>after two days</em>) are sequencers too, and they carry data.",
    "A cyclical process ends with <em>after which the cycle begins again</em>."
   ],
   "examples": [
    "<em>Once</em> + <em>has been</em> joins two stages in one sentence.",
    "<em>Before being</em> + past participle joins two stages in one sentence.",
    "Time phrase + <em>which then</em> + <em>followed by</em>: three links in one sentence.",
    "Four <em>then</em>s: mechanical cohesion. Vary the sequencer."
   ]
  },
  "B1": {
   "key": "Use a different sequencer for each stage: at the first stage, next, once … has been …, before being …, finally.",
   "body": [
    "A process is a chain, and the reader needs to feel the links. <strong>Sequencers</strong> do that job: <em>At the first stage</em>, <em>Next</em>, <em>Following this</em>, <em>After this</em>, <em>At the following stage</em>, <em>Finally</em>. Use one sequencer per stage, and never the same one twice in a row. <em>Then, then, then</em> is what Coherence Band 6 calls <em>mechanical</em>.",
    "Three sequencers join two stages inside one sentence, which is the complex grammar Band 7 wants. <em>Once</em> + <em>has been</em> + past participle: <em>Once the milk has been heated, it is cooled.</em> This is the present perfect passive; <em>had been</em> belongs to the past. <em>Before being</em> + past participle: <em>The paper is dried before being cut.</em> No subject and no base form come after <em>being</em>, and <em>before been</em> does not exist. <em>After which</em> + a full clause: <em>The boxes are packed, after which they are sent to shops.</em>",
    "For a natural cycle the same tools work in the active: <em>once the seed has split, a root appears</em>. <em>Followed by</em> is a fixed phrase with a past participle, never <em>following by</em>. <em>Following this</em> is a different sequencer that starts a new sentence. Time phrases from the diagram are sequencers too, and they carry data.",
    "Plan the sequencers before you write. The first stage gets <em>At the first stage</em>, the last gets <em>Finally</em>, and the middle stages share the others. A cyclical process ends with <em>after which the cycle begins again</em>."
   ],
   "examples": [
    "<em>Once</em> + <em>has/have been</em> joins two stages in one sentence.",
    "<em>Before being</em> + past participle joins the last two stages without a new sentence.",
    "Time phrase + <em>which then</em> + <em>followed by</em>: three links in one sentence.",
    "Four <em>then</em>s: mechanical cohesion. Vary the sequencer."
   ]
  },
  "B2": {
   "key": "Move the reader from stage to stage with a different sequencer each time: at the first stage, next, once … has been …, after which, before being …, finally.",
   "body": [
    "A process is a chain, and the reader needs to feel the links. <strong>Sequencers</strong> do that job: <em>At the first stage</em>, <em>Next</em>, <em>Following this</em>, <em>After this</em>, <em>At the following stage</em>, <em>Finally</em>. Use one sequencer per stage, and never the same one twice in a row. <em>Then, then, then</em> is what Coherence Band 6 calls <em>mechanical</em>, even when every stage and every passive is correct.",
    "Three sequencers join two stages inside one sentence, which is the complex grammar Band 7 wants. <em>Once … has been …</em>: <em>Once the milk has been heated, it is cooled.</em> This is the present perfect passive for a finished step; <em>had been</em> belongs to past narratives, and an active form would make the material do the work. <em>Before being …</em>: <em>The paper is dried before being cut.</em> A past participle follows <em>being</em> directly, with no subject and no base form, and <em>before been</em> does not exist. <em>After which</em>: <em>The boxes are packed, after which they are sent to shops.</em> It needs a full clause after it and keeps the stages in their real order.",
    "For a natural cycle the same tools work in the active: <em>once the seed has split, a root appears</em>; <em>a root appears, followed by a shoot</em>. <em>Followed by</em> is a fixed phrase built on the past participle, never <em>following by</em>, whereas <em>Following this</em> is a separate sequencer that opens a new sentence. Time phrases from the diagram (<em>after about two weeks</em>, <em>by the third month</em>) are sequencers too, and they carry data at the same time.",
    "Plan the sequencers before you write. The first stage gets <em>At the first stage</em> and the last gets <em>Finally</em>; the stages in between share <em>next</em>, <em>once</em>, <em>after which</em>, <em>before being</em> and <em>following this</em>. A cyclical process ends with <em>after which the cycle begins again</em>."
   ],
   "examples": [
    "<em>Once</em> + <em>has/have been</em> + past participle joins a finished stage to the next one.",
    "<em>Before being</em> is followed directly by a past participle (<em>cut</em>) and joins two stages without a new sentence.",
    "Time phrase + <em>which then</em> + <em>followed by</em>: three links in one sentence, all active for a natural cycle.",
    "Four <em>then</em>s: mechanical cohesion. Vary the sequencer."
   ]
  }
 },
 "m08s3": {
  "A1": {
   "key": "Process overview: how many stages, cycle or line, start and end.",
   "body": [
    "A process has no trend. Students often skip the <strong>overview</strong> (the summary paragraph). No overview means Band 5 at most.",
    "Answer four questions. How many stages? <strong>Cyclical</strong> (it goes round) or <strong>linear</strong> (start to end)? What goes in at the start? What comes out at the end? Natural or man-made can help too. <em>Overall, the process is linear and has six stages.</em>",
    "Count the boxes carefully. Six boxes means six stages. The number must match the diagram. Every stage must appear in paragraphs 3 and 4. A missing stage is an <strong>accuracy</strong> fault.",
    "Overview words: <em>stage</em>, <em>phase</em>, <em>cycle</em>, <em>begins with</em>, <em>ends with</em>. <strong>Raw material</strong>: what goes in. <strong>End product</strong>: what comes out. No measurements, like temperatures or times. Small details wait for paragraph 3. No opinion, like <em>recycling is good</em>.",
    "The last stage still uses passive present simple. A cycle ends: <em>after which the cycle begins again</em>."
   ],
   "examples": [
    "Shape, number, start, end: all four in one sentence.",
    "Two groups of stages. This plans paragraphs 3 and 4.",
    "A natural cycle: the end feeds the start.",
    "Wrong number (there are six). And an opinion."
   ]
  },
  "A2": {
   "key": "A process overview: how many stages, cyclical or linear, the start and the end.",
   "body": [
    "A process has no trend to summarise, so students often skip the <strong>overview</strong>. That means Band 5 at most. The overview answers four questions: how many <strong>stages</strong>? <strong>Linear</strong> (one way, start to end) or <strong>cyclical</strong> (it goes round)? What goes in at the start? What comes out at the end? <em>Natural</em> or <em>man-made</em> can help too. <em>Overall, the process is linear and has six stages, from cocoa beans to chocolate bars.</em>",
    "Count the boxes carefully. The number in the overview must match the diagram. Every stage must also appear in paragraphs 3 and 4. A missing stage is an <strong>accuracy fault</strong>. The examiner checks the diagram while reading.",
    "A second sentence can group the stages into two <strong>phases</strong>. These become paragraphs 3 and 4.",
    "Useful words: <em>stage</em>, <em>step</em>, <em>phase</em>, <em>cycle</em>, <em>begins with</em>, <em>ends with</em>, <em>consists of</em>. The <strong>raw material</strong> goes in; the <strong>end product</strong> comes out. Equipment is what does the work. Do not give measurements (temperatures, times, amounts); small details belong in paragraph 3. Never give an opinion. The last stage still takes the passive present simple. A cycle ends with <em>after which the cycle begins again</em>."
   ],
   "examples": [
    "Shape, count, start, end: all four in one sentence.",
    "A grouping sentence. It plans paragraphs 3 and 4.",
    "A natural cycle: the end feeds the start.",
    "Wrong count (there are six) and an opinion."
   ]
  },
  "B1": {
   "key": "A process overview gives the number of stages, linear or cyclical, the start and the end.",
   "body": [
    "A process has no trend to summarise, so students often skip the <strong>overview</strong>. That is a Band 5 ceiling. A process overview answers four questions. How many <strong>stages</strong>? <strong>Linear</strong> or <strong>cyclical</strong>? What goes in at the start, and what comes out at the end? Add <em>natural</em> or <em>man-made</em> if it is useful. <em>Overall, the process is linear and has six stages, beginning with cocoa beans and ending with chocolate bars.</em>",
    "Count the stages carefully. Six boxes means six stages. A description that skips one is an <strong>accuracy fault</strong>, because the examiner ticks the diagram as they read. Every stage must appear at least once in paragraphs 3 and 4, and the number in the overview must match.",
    "A useful second sentence groups the stages into two <strong>phases</strong>. That grouping then becomes paragraphs 3 and 4, so the overview also plans the report.",
    "The vocabulary of the overview is small: <em>stage, step, phase, cycle, cyclical, linear</em>. Add <em>raw material, end product, begins with, ends with, consists of, involves</em>. The <strong>raw material</strong> is the input and the <strong>end product</strong> is the output; equipment is what does the work. Give no measurements (temperatures, times, amounts), though counting the stages is fine. Small details belong in paragraph 3. Give no opinion about whether the process is good. In the body, the final stage keeps the passive present simple. A cycle closes with <em>after which the cycle begins again</em>."
   ],
   "examples": [
    "Shape, count, start, end: all four in one sentence.",
    "A grouping sentence: it plans paragraphs 3 and 4.",
    "A natural cycle: the end feeds the start.",
    "Wrong count (there are six) and an opinion. Two faults in one line."
   ]
  },
  "B2": {
   "key": "The overview of a process says how many stages there are, whether it is linear or cyclical, what it starts with and what it ends with.",
   "body": [
    "A process has no trend to summarise, so students often skip the <strong>overview</strong>. That is a Band 5 ceiling. The overview of a process answers four questions: <em>how many stages</em>, <em>linear or cyclical</em>, <em>what goes in at the start</em>, <em>what comes out at the end</em>. Add <em>natural or man-made</em> if it is useful. <em>Overall, the process is linear and consists of six stages, beginning with the harvesting of cocoa beans and ending with packed bars of chocolate.</em>",
    "Count the stages carefully. A diagram with six boxes has six stages; a description that skips one is an <strong>accuracy fault</strong>, and the examiner ticks the diagram as they read. Every stage must appear at least once in paragraphs 3 and 4, and the number in the overview must match. Calling a loop \"linear\", or a seven-box diagram \"six stages\", fails the overview however good the English is.",
    "A useful second sentence groups the stages: <em>The stages fall into two phases: preparing the beans and making the chocolate.</em> That grouping then becomes paragraphs 3 and 4, so the overview also plans the report.",
    "The vocabulary of the overview is small: <em>stage, step, phase, cycle, cyclical, linear, raw material, end product, begins with, ends with, consists of, involves</em>. The <strong>raw material</strong> is what goes in, the <strong>end product</strong> is what comes out, and equipment is simply what does the work. No measurements (temperatures, times, amounts) belong in the overview, though counting the stages is fine; specific details and special names for materials wait for paragraph 3. No opinion about whether the process is good for anyone. In the body, the final stage keeps the passive present simple, and a cyclical process closes with <em>after which the cycle begins again</em>."
   ],
   "examples": [
    "Shape (linear), count (six), start and end: all four in one sentence.",
    "A grouping sentence: it plans paragraphs 3 and 4.",
    "A natural cycle: the end feeds the start, so it is cyclical.",
    "Wrong count (the cocoa diagram has six) and an opinion. Two faults in one line."
   ]
  }
 },
 "m09s1": {
  "A1": {
   "key": "Say where things are with north, south, east and west, never left or right.",
   "body": [
    "A <strong>map task</strong> (two maps of one place) shows change. First, say where things are. North is at the top of the map. South is at the bottom. East is the right side. West is the left side. Higher on the map means further north.",
    "Use <strong>compass points</strong> (north, south, east, west). Write <em>in the north</em>. Write <em>in the south-west corner</em>. Do not write <em>left</em>, <em>right</em>, <em>above</em> or <em>below</em>. Those words describe the paper, not the town.",
    "<em>Adjacent to</em> means right next to. <em>Opposite</em> means facing, across a road or river. Also use <em>next to</em>, <em>along</em> and <em>between</em>.",
    "Use these verbs: <em>was located</em>, <em>stood</em>, <em>occupied</em>. A river <em>runs along</em> something.",
    "Order: year, place, verb, compass point, neighbour. Group places by area too: north, centre, south."
   ],
   "examples": [
    "A compass point and <em>opposite</em>. Now we know the place.",
    "A railway <em>runs along</em> the edge. Bridges go <em>over</em>.",
    "Paper words. Say <em>in the north-east corner</em>."
   ]
  },
  "A2": {
   "key": "Use compass points and position phrases to say where things are, never left and right.",
   "body": [
    "A map task gives you two maps of the same place. Before you describe changes, you must say where things are. The examiner reads the map with <strong>north at the top</strong>. So south is at the bottom. East is the right-hand side, and west is the left-hand side. A feature nearer the top is further north. But never write these paper words in your report.",
    "Write with <strong>compass points</strong>, for example <em>in the north</em> or <em>in the south-west corner</em>. Do not write <em>left</em>, <em>right</em>, <em>above</em>, <em>below</em> or <em>on the left-hand side</em>. They describe the paper, not the town.",
    "Add <strong>position phrases</strong> to fix one feature against another. <em>Adjacent to</em> means right next to. <em>Opposite</em> means facing, across a road or river. Other phrases are <em>next to</em>, <em>along</em> and <em>between</em>. You can also use <em>in the centre of</em> and <em>on the site of</em>. Useful verbs are <em>was located</em>, <em>was situated</em>, <em>stood</em> and <em>occupied</em>. Rivers and roads <em>run along</em> something.",
    "A full position sentence has five parts. They are year, feature, position verb, compass point and neighbour. You can also group features by area, such as north, centre and south."
   ],
   "examples": [
    "A compass point plus <em>opposite</em> fixes the hospital exactly.",
    "<em>Runs along</em> is for a railway, road or river. A bridge goes <em>over</em> it.",
    "These are paper directions. Say <em>in the north-east corner</em> instead."
   ]
  },
  "B1": {
   "key": "Say where things are with compass points and position phrases, never left and right.",
   "body": [
    "A map task asks you to compare two pictures of the same place. Before you can say what changed, you need to say <em>where</em> things are. The examiner reads the map with <strong>north at the top</strong>. So the bottom is south, the right-hand side is east and the left-hand side is west. A feature nearer the top of the map is further north than a feature below it.",
    "Always use <strong>compass points</strong>: <em>in the north</em>, <em>to the south of the river</em>, <em>along the eastern edge</em>. Never write <em>left</em>, <em>right</em>, <em>above</em>, <em>below</em> or <em>on the left-hand side</em>. These words describe the paper, not the town, and they sound like a child giving directions.",
    "Next, add a <strong>position phrase</strong> that fixes one feature against another. <em>Adjacent to</em> means right next to, and <em>opposite</em> means facing, across a road or river. <em>Along</em> means following a line, such as a road. Other phrases are <em>next to</em>, <em>between</em>, <em>in the centre of</em> and <em>on the site of</em>. The position verbs are simple: <em>was located</em>, <em>was situated</em>, <em>stood</em> and <em>occupied</em>. Roads and rivers <em>run</em>, so a river <em>runs along</em> an edge.",
    "A complete position sentence has a fixed order. It goes time phrase, feature, position verb, compass point, then a phrase about a neighbour. When two features sit side by side, name the compass direction between them. You can also group features by area, such as north, centre and south. Each group then becomes a paragraph or part of one."
   ],
   "examples": [
    "A compass point plus a position phrase (<em>opposite</em>) fixes the hospital exactly.",
    "<em>Runs along</em> suits a railway, road or river; a bridge carries a road <em>over</em> it.",
    "Paper directions, not town directions. Say <em>in the north-east corner</em>."
   ]
  },
  "B2": {
   "key": "Say where things are with compass points and position phrases, never with left, right, above or below.",
   "body": [
    "A map task asks you to compare two pictures of the same place, and before you can say what changed, you need to say <em>where</em> things are. The examiner reads every map with <strong>north at the top</strong>. The bottom of the map is therefore south, the right-hand side is east and the left-hand side is west. A feature nearer the top is further north than one below it, so check the compass before you write any position phrase.",
    "In the report itself, use <strong>compass points</strong>: <em>in the north</em>, <em>to the south of the river</em>, <em>in the south-west corner</em>, <em>along the eastern edge</em>. Words such as <em>left</em>, <em>right</em>, <em>above</em>, <em>below</em> and <em>on the left-hand side</em> describe the paper, not the town. They also sound like a child giving directions, which is not the register of an academic report.",
    "Then add the <strong>position phrases</strong> that fix one feature against another. <em>Adjacent to</em> means right next to; <em>opposite</em> means facing, across a road or river; <em>along</em> means following a line, such as a road. Add <em>next to</em>, <em>between</em>, <em>in the centre of</em> and <em>on the site of</em>. The verbs for position are simple: <em>was located</em>, <em>was situated</em>, <em>stood</em> and <em>occupied</em>, while roads and rivers <em>run</em>, so a river <em>runs along</em> the edge of a town.",
    "A full position sentence follows a fixed order: a time phrase, the feature, a position verb and a compass point. A second phrase then fixes it against a neighbour. When two features sit side by side, name the compass direction between them rather than calling one of them central. Practise reading a map aloud in these words before you write a sentence. Finally, grouping features by area, such as north, centre and south, is one of the two ways to organise a map report. Each named group then becomes a paragraph or part of one."
   ],
   "examples": [
    "Compass point plus position phrase: <em>to the east of</em> the high street and <em>opposite</em> the market fix the hospital exactly.",
    "<em>Runs along</em> is the natural verb for a railway, road or river; a bridge carries a road <em>over</em> or <em>across</em> it.",
    "Paper directions that describe the page, not the place. Say <em>in the north-east corner</em>."
   ]
  }
 },
 "m09s2": {
  "A1": {
   "key": "Map changes use the passive. The two map dates choose the tense.",
   "body": [
    "Maps show no people. So use the <strong>passive</strong> (be + past participle). It always needs <em>be</em>: <em>was</em>, <em>has been</em>, <em>will be</em>. Without <em>be</em>, the building does the action.",
    "The two map titles choose the tense. Two past years? Use <em>was built</em>. After <em>by</em> and a year, <em>had been built</em> is fine. A past year and <em>now</em>? Use <em>has been built</em>. A <strong>plan</strong> (changes to come)? Use <em>will be built</em> or <em>is to be built</em>. <em>Has been</em> for a plan is wrong.",
    "Learn these verbs: <em>built, added, demolished, knocked down, cleared, planted</em>. Also learn <em>converted into, replaced by, extended, relocated to, pedestrianised</em>.",
    "<em>Extended</em>: same place, but bigger. <em>Relocated</em>: moved to a new place. <em>Pedestrianised</em>: closed to cars, open to walkers.",
    "Put old and new together: <em>X was replaced by Y</em>. Or: <em>X was knocked down to make way for Y</em>."
   ],
   "examples": [
    "Two past dates, so <em>was demolished</em>. Old and new together.",
    "The second map is a plan: <em>will be built</em>.",
    "The map shows no doer. Use the passive."
   ]
  },
  "A2": {
   "key": "Map changes use the passive. The dates of the two maps choose the tense.",
   "body": [
    "Nobody on a map does anything, so use the <strong>passive</strong>: <em>be</em> + past participle. Write <em>the hotel was demolished</em>, not <em>they demolished the hotel</em>. The <em>be</em> part is necessary: <em>was</em>, <em>has been</em>, <em>had been</em> or <em>will be</em>. Without it, the building does the action itself.",
    "The tense comes from the two map titles. Two past dates: <em>was demolished</em>. After <em>by</em> and a past year, <em>had been replaced</em> is also fine. A past map and a map of <em>now</em>: <em>has been converted</em>. A map of now and a <strong>plan</strong>: <em>will be built</em> or <em>is to be relocated</em>. <em>Has been moved</em> about a plan is wrong. The change has not happened yet.",
    "Learn the change verbs: <em>built, added, demolished, knocked down, cleared, planted</em>. Also learn <em>converted into, replaced by, extended, expanded, relocated to, pedestrianised</em>. <em>Extended</em> means the same place, but bigger. <em>Relocated</em> means moved to a new site. <em>Pedestrianised</em> means closed to cars and open to people on foot.",
    "Say old and new in one sentence. Write <em>X was replaced by Y</em> or <em>X was converted into Y</em>. Or write <em>X was knocked down to make way for Y</em>."
   ],
   "examples": [
    "Both maps are in the past, so use past simple passive. Old and new are in one sentence.",
    "The second map is a plan, so use the future passive.",
    "The map does not show who did it. Use the passive: <em>the hotel was demolished</em>."
   ]
  },
  "B1": {
   "key": "Map changes are written in the passive, and the tense follows the dates on the two maps.",
   "body": [
    "Nobody on a map does anything, so the natural voice is the <strong>passive</strong>: <em>be</em> plus a past participle. Write <em>the hotel was demolished</em>, because the map does not show who did it. The <em>be</em> part is essential: <em>was built</em>, <em>has been built</em>, <em>had been built</em>, <em>will be built</em>. Without it, the sentence says the building did the action itself.",
    "Learn the change verbs as past participles: <em>built, constructed, added, demolished, knocked down, removed, cleared, planted</em>. Also learn <em>converted into, turned into, redeveloped as, replaced by, extended, expanded, relocated to, pedestrianised</em>. <em>Extended</em> or <em>expanded</em> means the feature stayed in place but grew. <em>Relocated</em> means it moved to a new site. <em>Pedestrianised</em> means closed to traffic and given to people on foot, so cars can no longer use the road.",
    "The tense comes from the titles of the two maps. Two past dates: past simple passive, <em>was demolished</em>. After <em>by</em> and a past year, <em>had been replaced</em> is also accurate. A past map and a map of <em>now</em>: present perfect passive for the change, <em>has been converted</em>. Then use present simple for what is there now: <em>a supermarket now occupies the site</em>. A map of now and a <strong>plan</strong> or proposal: future passive, <em>will be built</em> or <em>is to be relocated</em>. <em>Has been moved</em> about a plan says the change already happened, which is inaccurate.",
    "Two sentence shapes say old and new together: <em>X was replaced by Y</em> and <em>X was converted into Y</em>. Other shapes start from the new feature or the change. Examples are <em>Y was built on the site of X</em> and <em>X was demolished to make way for Y</em>. Mix them to avoid repeating one pattern."
   ],
   "examples": [
    "Two past dates, so past simple passive. The old and the new feature appear in one sentence.",
    "The second map is a plan, so future passive.",
    "Active voice with an invented doer. The map does not show who did it: <em>the hotel was demolished</em>."
   ]
  },
  "B2": {
   "key": "Map changes are written in the passive (was demolished, has been converted into, will be built), and the tense follows the two dates.",
   "body": [
    "Nobody on a map does anything, so the natural voice is the <strong>passive</strong>: <em>be</em> plus a past participle. Examples are <em>the hotel was demolished</em> and <em>a car park was added</em>. The map never shows who made a change, so an active sentence with a council or a company as its subject invents information. The <em>be</em> part is essential in every tense: <em>was built</em>, <em>has been built</em>, <em>had been built</em>, <em>will be built</em>. Without it, the sentence claims that the building performed the action itself.",
    "The change verbs form a small kit, best learnt as past participles: <em>built, constructed, added, demolished, knocked down, removed, cleared, planted</em>. The kit continues with <em>converted into, turned into, redeveloped as, replaced by, extended, expanded, relocated to, pedestrianised</em>. Meaning matters. <em>Extended</em> and <em>expanded</em> describe a feature that stayed where it was and grew; <em>relocated</em> means it moved to a new site. <em>Pedestrianised</em> is the one verb that means closed to traffic and given to people on foot: the road is still there, but cars can no longer use it.",
    "The tense comes from the titles of the two maps. With two past dates, use the past simple passive, <em>was demolished</em>; after <em>by</em> plus a past year, the past perfect passive, <em>had been replaced</em>, is also accurate. With a past map and a map of <em>now</em> or <em>today</em>, use the present perfect passive for the change, <em>has been converted</em>. Use the present simple for what is there now. With a map of now and a <strong>plan</strong> or proposal, use the future passive, <em>will be built</em> or <em>is to be relocated</em>. Writing <em>has been moved</em> about a plan tells the examiner the change already happened, which counts as inaccurate content.",
    "Two shapes are especially useful. <em>X was replaced by Y</em> and <em>X was converted into Y</em> give old and new in one sentence. <em>Y was built on the site of X</em> and <em>X was demolished to make way for Y</em> do the same from the other side. Use both so that the paragraph does not repeat one pattern."
   ],
   "examples": [
    "Two past dates, so past simple passive, with old and new in one sentence through <em>replaced by</em>.",
    "A plan, not a record, so future passive: the change has not happened yet.",
    "The map does not show who did it, so an active sentence invents a doer. Use the passive: <em>the hotel was demolished</em>."
   ]
  }
 },
 "m09s3": {
  "A1": {
   "key": "The map overview says the big change and what stayed the same.",
   "body": [
    "A map report needs an <strong>overview</strong> (the summary paragraph). Without it, Task Achievement cannot go above Band 5. Start with <em>Overall</em>. Write two or three sentences. Use no numbers.",
    "What kind of place did it become? What was removed and added? What stayed the same?",
    "Name what stayed the same. It is a key feature. A name is not a feature. You may name the biggest change. Do not list two small changes. Do not be vague, like <em>the town changed a lot</em>.",
    "Never give reasons. The map shows what changed, not why. Never give opinions, like <em>better</em>. Check each claim on both maps. Do not write <em>all</em> if only part changed.",
    "Plan paragraphs 3 and 4. Group by area, like north then south. Or group by type: buildings, then roads and parks. Do not go one feature at a time. Do not describe one map, then the other."
   ],
   "examples": [
    "The kind of change, what went and what stayed.",
    "The big change and the things that did not change.",
    "Too vague. Say what kind of change it was."
   ]
  },
  "A2": {
   "key": "The map overview says what kind of change happened overall and what stayed the same.",
   "body": [
    "A map report needs an <strong>overview</strong> as much as a line graph does. Without one, Task Achievement cannot go above Band 5. Begin with <em>Overall</em> and write two or three sentences. Give no measurements.",
    "First, what is the overall character of the change? Is it more homes, more shops, more green or more tourism? Next, what was removed, added and kept? What stayed the same is a real key feature. You may also name the biggest single change, without sizes.",
    "Avoid four things. A list of two small details is not a summary. A vague sentence, such as <em>the area changed a lot</em>, says nothing. Reasons are not on the map, so do not explain why. Opinions, such as <em>better</em>, do not belong. A place name is not a feature. Check every claim on both maps. Do not write <em>the whole</em> if only part changed.",
    "Then group the changes for paragraphs 3 and 4. Group by area, such as east and then west. Or group by type, such as buildings and then roads. Decide before you write. Do not go feature by feature. Do not describe one map and then the other."
   ],
   "examples": [
    "The kind of change, what was removed and what stayed. There are no measurements.",
    "The main change and the exceptions in one sentence.",
    "This is too vague. Name the kind of change."
   ]
  },
  "B1": {
   "key": "The map overview says what kind of change happened overall and names what stayed the same.",
   "body": [
    "A map report needs an <strong>overview</strong> just as much as a line graph does. Students forget it more often because there are no trends to summarise. Without an overview, Task Achievement cannot go above Band 5. Begin with <em>Overall</em>, write two or three sentences and give no measurements.",
    "Ask the SPACE headline questions. What is the <em>overall character</em> of the change: more residential, more commercial, more green, more built-up or more tourist-oriented? What was <em>removed</em>, what was <em>added</em> and what was <em>kept</em>? What stayed the same is a legitimate key feature, and the examiner expects you to notice it. You may also name the single most significant change, as long as there are no measurements.",
    "Several things do not belong in an overview. A list of two small details is not a summary. A vague sentence such as <em>the area changed a lot</em> names no kind of change. The maps show what changed, never why, so reasons are invented material and cost marks. Words such as <em>better</em> or <em>more attractive</em> are opinions. A place name is not a key feature either. Finally, check every general claim against both maps. Do not write <em>the whole</em> or <em>all</em> if only part of a feature changed.",
    "Then group the changes for the two detail paragraphs. Group either by <em>area</em>, such as the east and then the west. Or group by <em>type of change</em>, such as redeveloped buildings and then roads and open space. Either works if you decide before you write. Do not walk through the map feature by feature. Do not describe the whole first map and then the whole second map. That leaves the comparison to the reader."
   ],
   "examples": [
    "The character of the change, what was removed and what stayed, with no measurements.",
    "An island in one sentence: the headline and the exceptions.",
    "Too vague to be a key feature. Name the kind of change."
   ]
  },
  "B2": {
   "key": "The map overview says what kind of change happened overall and names what stayed the same.",
   "body": [
    "A map report needs an <strong>overview</strong> just as much as a line graph does, and students forget it more often because there are no trends to summarise. The cost is the same as on any other visual: without an overview, Task Achievement cannot go above Band 5. Begin with <em>Overall</em>, write two or three sentences and include no measurements.",
    "Ask the SPACE headline questions. What is the <em>overall character</em> of the change: more residential, more commercial, more green, more built-up or more tourist-oriented? What was <em>removed</em>, what was <em>added</em> and what was <em>kept</em>? What stayed the same is a legitimate key feature, and an examiner expects you to notice the building that did not move. Naming the single most significant change, without measurements, is also exactly what an overview does. A place name on its own, by contrast, is not a feature at all.",
    "Four kinds of sentence fail. Two specific details side by side are details, not a summary. A vague sentence such as <em>the area changed a lot</em> is too general to count as a key feature. A reason is invented material, because the maps show what changed, never why, so a <em>because</em> clause costs Task Achievement marks. An evaluative word such as <em>better</em> or <em>more attractive</em> is an opinion. Finally, check each general claim against both maps before you write it: <em>the whole</em>, <em>entire</em> or <em>all</em> is false if only part of a feature changed.",
    "Then group the changes for the two detail paragraphs. Group either by <em>area</em> (the east, then the west; or north of the road, then south) or by <em>type of change</em> (redeveloped sites, then transport and open space). Either grouping works as long as it is decided before you write. Do not walk through the map feature by feature. Nor should you describe the whole first map and then the whole second, because that leaves the comparison to the reader: this is what <em>mechanical</em> means."
   ],
   "examples": [
    "Character of change, what was removed and what stayed, with no measurements: a complete map overview in one sentence.",
    "An island in one sentence: the headline transformation and the exceptions, joined by <em>while</em>.",
    "Too vague to be a key feature. Name the kind of change."
   ]
  }
 },
 "m10s1": {
  "A1": {
   "key": "Two visuals, one introduction: name both and join them with while or and.",
   "body": [
    "Some tasks have two <strong>visuals</strong> (charts, tables or graphs). Do not write two reports. Write one report with four paragraphs.",
    "The <strong>introduction</strong> (paragraph 1) is one sentence. Name both visuals. Say what each one measures. Add the place and the year. Add the <strong>units</strong> (like dollars or hours).",
    "Use this pattern: <em>The chart shows ..., while the table gives ...</em> Join the two halves with <em>while</em> or <em>and</em>. Do not use <em>because</em> or <em>so</em>. They add a reason the visuals do not show.",
    "Give each visual its own verb and time. One may cover twenty years. The other may show one year.",
    "Link the halves with small words. Write <em>in each city</em> or <em>over the same period</em>. <em>Each city</em> points back to the cities named before.",
    "Put no figures in the introduction. Put no rankings or reasons there. Two short separate sentences are weak."
   ],
   "examples": [
    "One sentence. Both visuals. <em>While</em> and <em>each city</em> join them.",
    "Two short sentences. They copy the task. No link.",
    "<em>And</em> also works when the visuals do not contrast."
   ]
  },
  "A2": {
   "key": "Two visuals get one introduction. Name both in one sentence, joined with while or and.",
   "body": [
    "Some tasks give you two visuals, for example a bar chart and a table. Students often write two separate reports. Do not. The report still has <strong>four paragraphs</strong>. The introduction names both visuals, and each detail paragraph takes one of them.",
    "The introduction is one sentence. Use this pattern: <em>The [bar chart] shows [what A], while the [table] gives [what B]</em>. Name the type of each visual and say what it measures. Add the place and the year. Add the <strong>units</strong> if the task gives them, such as hours or US dollars. Two short separate sentences treat the visuals as two tasks.",
    "Join the halves with <em>while</em> or <em>and</em>. Do not use <em>because</em> or <em>so</em>, because they invent a cause. Give each visual its own verb (<em>shows</em>, <em>illustrates</em>) and its own time. A line graph may cover twenty years, but a pie chart may show one year.",
    "Link the halves with a small phrase, like <em>in each city</em>. It points back to the cities already named. Keep figures, rankings and reasons out of the introduction."
   ],
   "examples": [
    "One sentence names both visuals. <em>While</em> and <em>each city</em> link them.",
    "Two short sentences copy the task and do not connect the visuals.",
    "<em>And</em> also works when the visuals are not in contrast."
   ]
  },
  "B1": {
   "key": "Two visuals get one introduction: name both in one sentence and join them with while or and.",
   "body": [
    "Sometimes the task gives you two visuals, for example a bar chart and a table. Students often panic and write two separate reports. Do not. The report still has <strong>four paragraphs</strong>. Only two things change: the introduction names both visuals, and each detail paragraph takes one of them.",
    "The introduction is one sentence. The pattern is: <em>The [bar chart] shows [what A], while the [table] gives information about [what B]</em>. Add the place and year at the end. Name the type of each visual and say what each one measures. Add the units if the task gives them, for example hours per day or US dollars. Two short separate sentences, one per visual, treat the visuals as two separate tasks.",
    "Join the two halves with <em>while</em> or <em>and</em>; <em>and</em> works well when the visuals are not in contrast. Do not use <em>because</em> or <em>so</em>, since they invent a cause that the visuals do not show. Give each visual its own verb (<em>shows</em>, <em>illustrates</em>) and its own time frame. A line graph may cover twenty years, while a pie chart shows a single year.",
    "Use a small reference phrase to link the halves instead of repeating the categories. Examples are <em>in each city</em>, <em>for the same four cities</em> and <em>over the same period</em>. A phrase like <em>in each city</em> points back to the cities already named for the first visual. This shows the examiner that you have seen how the visuals connect. Keep figures, rankings and reasons out of the introduction; the units are the detail it needs."
   ],
   "examples": [
    "One sentence names both visuals, linked with <em>while</em> and the reference phrase <em>each city</em>.",
    "Two short sentences that copy the task and do not connect the visuals.",
    "<em>And</em> also works when the visuals are not in contrast. Each visual has its own time frame."
   ]
  },
  "B2": {
   "key": "Two visuals get one introduction: name both in one sentence, say what each measures, and join them with while or and.",
   "body": [
    "Sometimes the task gives you two visuals: a bar chart and a table, a line graph and a pie chart. Students often panic and write two separate reports. Do not. The report still has <strong>four paragraphs</strong>, and the only things that change are that the introduction names both visuals and each detail paragraph takes one of them.",
    "The introduction pattern is: <em>The [bar chart] shows [what A], while the [table] gives information about [what B], [in place, year]</em>. Name the type of each visual, say what each one measures, and add the units if the rubric gives them, such as hours per day or US dollars. Two short separate sentences that copy the rubric treat the visuals as two separate tasks. One joined sentence, with place, year and units, tells the examiner this is one report.",
    "Join the two halves with <em>while</em> or <em>and</em>, which simply place the visuals side by side; <em>and</em> is the natural choice when they are not in contrast. Avoid <em>because</em> and <em>so</em>, which would invent a cause that the visuals do not show. Each visual also keeps its own verb (<em>illustrates</em>, <em>shows</em>) and its own time frame. A line graph may cover twenty years, while a pie chart records a single year.",
    "Use a small reference phrase to link the two halves instead of repeating the categories: <em>in each city</em>, <em>for the same four cities</em>, <em>over the same period</em>. A phrase such as <em>in each city</em> points back to the cities already named for the first visual. This tells the examiner that you have seen how the visuals connect. What stays out of the introduction is just as clear: no figures, no rankings and no reasons. The units of measurement are the only detail it needs; the most expensive item or the highest value waits for the detail paragraphs."
   ],
   "examples": [
    "One sentence, both visuals named, linked with <em>while</em> and the reference phrase <em>each city</em>.",
    "Two short sentences that copy the rubric and do not connect the visuals, so they read as two tasks.",
    "<em>And</em> also works when the visuals are not in contrast; note the different verb and time frame for each visual."
   ]
  }
 },
 "m10s2": {
  "A1": {
   "key": "One overview for both visuals: one headline for each, no numbers.",
   "body": [
    "With two visuals, write one <strong>overview</strong> (the summary paragraph). It is still paragraph 2. Start with <em>Overall</em>. Use no figures. Category names are fine.",
    "Give one <strong>headline</strong> (the main point) for each visual. A headline names the top and the bottom. For example: <em>Overall, Lima was hottest and Oslo coldest.</em> Then add a headline for the second visual. Join them with <em>while</em>.",
    "Do both visuals show the same categories? Then look for a <strong>link</strong> (a connection). Write it in one sentence. But check every category first. One that fits is not enough. One that breaks it makes the link false.",
    "Avoid two mistakes. Do not write two overviews. That makes two small reports. Do not invent a link or a reason. Exact figures go in paragraphs 3 and 4."
   ],
   "examples": [
    "Two headlines, one for each visual. No figures.",
    "A true link between the visuals. No figures.",
    "Figures belong in the details. This is not an overview."
   ]
  },
  "A2": {
   "key": "One overview, beginning with Overall: a headline for each visual, and one link if true.",
   "body": [
    "With two visuals the overview still comes second and still has no figures. Category names, like countries, are fine. Begin with <em>Overall</em>. The difference is that it must <strong>mention both visuals</strong>. Give one <strong>headline</strong> for the first visual and one for the second, joined with <em>while</em>. A headline names the extremes. That means the highest and lowest, or the top and bottom pairs.",
    "If both visuals show the same categories, look for a <strong>link</strong>. State it in one general sentence. For example, one city might be first on both measures. A true link helps you reach the <em>\"clear overview\"</em> of Band 7.",
    "Check the link against every category in both visuals first. If one category breaks the pattern, the link is false.",
    "There are two traps. First, one overview for each visual makes two mini-reports. Write one overview with two headlines. Second, do not invent a link or a reason. Remove the figures from your sentence. If nothing is left, it is not an overview."
   ],
   "examples": [
    "Two headlines, one for each visual, with no figures.",
    "A true link between the two visuals, said in general words.",
    "These figures belong in the detail paragraphs. This is not an overview."
   ]
  },
  "B1": {
   "key": "One overview, beginning with Overall, with the headline of each visual and one link if you can see one.",
   "body": [
    "With two visuals the overview still comes second, still begins with <em>Overall</em> and still has no figures. Category names, such as countries, are fine. The difference is that it must <strong>mention both visuals</strong>. Write one headline for the first visual and one for the second, joined with <em>while</em> or <em>whereas</em>. A strong headline names the extremes: the highest and the lowest, or the top pair and the bottom pair.",
    "If the same categories appear in both visuals, look for a <strong>link</strong> and state it in one general sentence. For example, one city might be first on both measures. Or two cities might combine high numbers in one visual with low numbers in the other. A true link like this helps to earn the <em>\"clear overview\"</em> of Band 7.",
    "Before you write a link, check it against every category in both visuals. One category that fits is not enough; if even one category breaks the pattern, the claim is false. A link such as <em>the cheaper it was, the more people bought</em> must hold for every row.",
    "There are two traps. First, writing one overview per visual produces two mini-reports. The four-paragraph shape needs one overview with two headlines, then one detail paragraph per visual. Second, do not invent a link that the data do not support, and do not add a reason. Exact figures belong in the detail paragraphs. A useful test is to cover the figures in your sentence. If nothing general is left, it is not an overview."
   ],
   "examples": [
    "Two headlines, one for each visual, joined by <em>while</em>. No figures.",
    "A true link between the visuals, stated in general terms.",
    "Correct figures, but figures belong in the detail paragraphs. This is not an overview."
   ]
  },
  "B2": {
   "key": "One overview, beginning with Overall, giving the headline of each visual and one link if the data support it.",
   "body": [
    "With two visuals the overview still comes second and still has no figures; category names, such as countries, are fine. The difference is that it must <strong>mention both visuals</strong>. Give one headline for the first and one for the second, joined with <em>while</em> or <em>whereas</em>. A strong headline names the extremes: the highest and the lowest, or the top pair and the bottom pair. An overview that describes only one visual leaves half of the task without a key feature.",
    "If the same categories appear in both visuals, look for a <strong>link</strong> and state it in one sentence. One category might lead on both measures, or two categories might combine high values in one visual with low values in the other. A link of this kind is a true general statement, and it helps to earn the <em>\"clear overview\"</em> of Band 7.",
    "The link must survive a check against every category. A claim such as <em>the cheaper it was, the more people bought</em> is false if even one category breaks the pattern, however neatly the other categories fit. Read the second visual as carefully as the first before you claim that a category is highest or lowest on both.",
    "Two traps remain. The first is writing one overview per visual, which produces two mini-reports. The four-paragraph shape needs one introduction, one overview with two headlines, and then one detail paragraph per visual. The second is inventing a link, or a reason, that the data do not support: the visuals show values, not causes. Exact figures always wait for the detail paragraphs. Cover the figures in your sentence; if nothing general is left, the sentence is a detail, not an overview."
   ],
   "examples": [
    "Two headlines, one for each visual, joined by <em>while</em>, with no figures.",
    "A true link between the visuals, stated generally with <em>whereas</em>.",
    "Accurate figures, but figures belong in the detail paragraphs, so this is not an overview."
   ]
  }
 },
 "m10s3": {
  "A1": {
   "key": "Paragraph 3 is for the first visual, paragraph 4 for the second. Never mix.",
   "body": [
    "Paragraphs 3 and 4 give the <strong>details</strong> (the figures). Paragraph 3 is the first visual. Paragraph 4 is the second visual. Start each with a <strong>topic sentence</strong> (it names the subject). There is no conclusion.",
    "Do not mix figures. The unit tells you the paragraph. Hours go with the hours chart. Dollars go with the price table. You may name a group from the other visual. But every figure must come from this visual.",
    "Choose. Do not list. Give the highest and the lowest. Give one comparison and one pair. One sentence per category is <strong>mechanical</strong> (just listing). That is Band 5. Group high ones and low ones instead.",
    "Order: topic sentence, leader, middle, bottom.",
    "Use <em>respectively</em>: names first, figures in the same order. <em>The former</em> is the first one named. <em>The latter</em> is the second one."
   ],
   "examples": [
    "Paragraph 3. Temperatures only. One comparison. <em>Respectively</em>.",
    "Paragraph 4. Rain only. <em>Seventy times</em> compares them.",
    "Wrong. Two figures from two visuals. That mixes them."
   ]
  },
  "A2": {
   "key": "Paragraph 3 belongs to the first visual and paragraph 4 to the second. Never mix them.",
   "body": [
    "With two visuals, the grouping is easy: <em>one visual, one paragraph</em>. Paragraph 3 reports the first visual with figures and at least one comparison. Paragraph 4 does the same for the second. Each starts with a topic sentence that names its subject. There is no conclusion after paragraph 4.",
    "Do not mix the visuals. The unit tells you the paragraph: a dollar figure goes with the price visual. You may name a group from the other visual, like <em>the two biggest users</em>. But every figure in the sentence must come from this paragraph's visual.",
    "Select the main features: the highest, the lowest, one comparison and one pair. Five countries do not need five sentences. One sentence per category is <strong>mechanical</strong>, a Band 5 feature. Group high and low categories and compare the groups. A clear order is topic sentence, leader, middle, bottom.",
    "Use <em>respectively</em> to match figures to names in the same order. <em>The former</em> means the first item named. <em>The latter</em> means the second. <em>The same country</em> also avoids repeating a name."
   ],
   "examples": [
    "Paragraph 3 has temperatures only, one comparison and <em>respectively</em>.",
    "Paragraph 4 has rainfall only, compared with a multiple.",
    "A temperature figure and a rainfall figure in one sentence mix the visuals."
   ]
  },
  "B1": {
   "key": "Paragraph 3 belongs to the first visual, paragraph 4 to the second. Never mix them.",
   "body": [
    "The detail paragraphs are the easy part of a two-visual task. The grouping is done for you: <em>one visual, one paragraph</em>. Paragraph 3 reports the first visual with figures and at least one comparison. Paragraph 4 does the same for the second visual. Each paragraph starts with a topic sentence that names what it is about. There is no conclusion after paragraph 4.",
    "Do not mix the visuals. The unit of a figure tells you its paragraph. A dollar figure goes with the price visual, and an hours figure with the hours visual. If the visuals share categories, you may refer back briefly to the other one, for example <em>the two biggest users</em>. That is reference, not mixing, as long as every figure in the sentence comes from this paragraph's visual.",
    "Select as you would for one visual: the highest, the lowest, one comparison and one interesting pair. Five categories do not need five sentences. Going down the list one sentence at a time is <strong>mechanical</strong> reporting, a Band 5 feature. Group the categories instead, for example high and low, and compare across the groups. A clear order is topic sentence, then the leader, then the middle, then the bottom.",
    "Use reference words to avoid repeating names. <em>Respectively</em> matches figures to names in the same order: names first, figures next, <em>respectively</em> last. <em>The former</em> is the first item named and <em>the latter</em> is the second. <em>The same country</em> also saves a repeated name."
   ],
   "examples": [
    "Paragraph 3: temperature figures only, one comparison, and <em>respectively</em>.",
    "Paragraph 4: rainfall only, compared with a multiple.",
    "A temperature figure and a rainfall figure in one sentence mix the visuals."
   ]
  },
  "B2": {
   "key": "Paragraph 3 belongs to the first visual, paragraph 4 to the second; never mix their figures.",
   "body": [
    "The detail paragraphs are the easy part of a two-visual task because the grouping is done for you: <em>one visual, one paragraph</em>. Paragraph 3 reports the first visual with figures and at least one comparison; paragraph 4 does the same for the second. Each paragraph opens with a topic sentence that names what it is about, and nothing follows paragraph 4, because Task 1 has no conclusion.",
    "Do not put a figure from the second visual into the first paragraph, or the reverse. The unit is the quickest test: a dollar figure belongs with the price visual, an hours figure with the hours visual. If the two visuals share the same categories, you may refer back briefly, for example <em>the two biggest users</em>. That is reference, not mixing, because every figure in the sentence still comes from the visual that the paragraph reports.",
    "Select as you would for one visual: the highest, the lowest, one comparison and one interesting pair. Five categories do not need five sentences, and going down the list one sentence at a time, in chart order, is the <strong>mechanical</strong> reporting of Band 5. Group the categories, for instance a high pair and a low pair, and compare across the groups. A natural order is the topic sentence, then the leader, then the middle group, then the bottom group, so the reader moves down the ranking without effort.",
    "Use reference to avoid repeating names. <em>Respectively</em> matches two or three figures to names in the same order: the names first, the figures next, <em>respectively</em> last. <em>The former</em> refers to the first item named and <em>the latter</em> to the second, while <em>the same country</em> saves a repeated name. These are Band 7 cohesion tools, and one or two per paragraph is enough."
   ],
   "examples": [
    "Paragraph 3: temperature figures only, one comparison, and <em>respectively</em> to match two figures to two names.",
    "Paragraph 4: rainfall only, with a multiple (<em>more than seventy times</em>) as the comparison.",
    "A temperature figure and a rainfall figure in one sentence mix the visuals; split them between paragraphs 3 and 4."
   ]
  }
 },
 "m11s1": {
  "A1": {
   "key": "Use the in fixed phrases, a for a new change, and -s after numbers.",
   "body": [
    "Band 7 grammar says <em>\"error-free sentences are frequent\"</em>. Small, repeated errors stop this. Fix each error <strong>family</strong> (type of error).",
    "<strong>Articles</strong> (a, an, the). Fixed phrases always take <em>the</em>. Write <em>the number of</em> and <em>the figure for</em>. <em>The highest</em> and <em>the lowest</em> always take <em>the</em>.",
    "A change named the first time takes <em>a</em>. Write <em>There was a slight rise in ...</em>. General plural groups take no article: <em>students</em>. Energy types in general take none: <em>coal</em>, <em>wind</em>. Uncountable nouns never take <em>a</em>. For the water in the chart, write <em>the water</em>.",
    "<strong>Plurals</strong>. After a number above one, add <em>-s</em>. Write <em>four schools</em>. After <em>fewer</em>, add <em>-s</em> too.",
    "Use <em>the number of</em> for countable things. Examples are people, cars, cups and arrivals. Use <em>the amount of</em> for uncountable things. Examples are money, energy, time and rice. <em>The proportion of</em> works with both. So does <em>the percentage of</em>."
   ],
   "examples": [
    "The fixed phrase always starts with <em>the</em>.",
    "A change named the first time takes <em>a</em>.",
    "Plural after a number: <em>cities</em>.",
    "You cannot count water. You can count households."
   ]
  },
  "A2": {
   "key": "Use the in fixed phrases and a for new changes. Add -s after numbers. Choose number or amount.",
   "body": [
    "Band 7 for grammar says <em>\"error-free sentences are frequent\"</em>. Most errors that stop this are small and repeated. Fix the error families, not single mistakes.",
    "<strong>Articles.</strong> Fixed phrases always take <em>the</em>: <em>the number of</em>, <em>the figure for</em>, <em>the proportion of</em>. Superlatives also take <em>the</em>: <em>the highest</em>, <em>the lowest</em>. A change named for the first time takes <em>a</em>: <em>There was a slight rise in ...</em> General plural groups take no article: <em>students</em>, <em>passengers</em>. Energy sources in general take none: <em>coal</em>, <em>wind</em>. An uncountable noun never takes <em>a</em>. For the specific water in a chart, write <em>the water</em>.",
    "<strong>Plurals.</strong> After a number bigger than one, the noun takes <em>-s</em>: <em>four schools</em>. <em>Fewer</em> also needs a plural noun. Thai has no plural ending, so check every noun after a number.",
    "<strong>Number or amount.</strong> <em>The number of</em> is for things you can count: people, cars, cups, arrivals. <em>The amount of</em> is for things you cannot count: money, energy, time, rice. <em>The proportion of</em> and <em>the percentage of</em> work with both."
   ],
   "examples": [
    "The fixed phrase <em>the number of</em> always starts with <em>the</em>.",
    "A change named for the first time takes <em>a</em>.",
    "After a number, the noun is plural.",
    "Water is uncountable, so <em>amount</em>. Households are countable, so <em>number</em>."
   ]
  },
  "B1": {
   "key": "Fixed phrases take the; first mentions take a; plural nouns take -s; number for countable things, amount for uncountable ones.",
   "body": [
    "Band 7 for Grammatical Range and Accuracy says <em>\"error-free sentences are frequent\"</em>. Most errors that stop this are small and repeated: a missing <em>the</em>, a missing <em>-s</em>, <em>amount</em> where <em>number</em> is needed. Fix the families, not the single mistakes.",
    "<strong>Articles.</strong> The kit phrases are fixed and always take <em>the</em>: <em>the number of</em>, <em>the figure for</em>, <em>the proportion of</em>. Superlatives such as <em>the highest</em> and <em>the lowest</em> always take <em>the</em> too. A change takes <em>a</em> the first time it is named: <em>a steep rise</em>, <em>a peak</em>, <em>a slight fall</em>. So pattern S4 is always <em>There was a [adjective] rise/fall in ...</em>.",
    "Plural categories in general take no article: <em>students</em>, <em>passengers</em>. Energy sources named in general take none either: <em>coal</em>, <em>wind</em>, <em>hydro</em>. An uncountable noun such as <em>water</em> can never take <em>a</em>. When it means the specific water in the chart, it takes <em>the</em>.",
    "<strong>Plurals.</strong> After a number bigger than one, the noun is plural: <em>four schools</em>, <em>six cities</em>. <em>Fewer</em> compares plural things, so its noun needs <em>-s</em> as well. Thai has no plural ending, so this needs a deliberate check on every noun that follows a number.",
    "<strong>Number or amount.</strong> <em>The number of</em> goes with things you can count, such as people, cars, cups and arrivals. <em>The amount of</em> goes with things you cannot count, such as money, energy, time and rice. <em>The proportion of</em> and <em>the percentage of</em> work with either."
   ],
   "examples": [
    "The kit phrase <em>the number of</em> always starts with <em>the</em>.",
    "A change named for the first time takes <em>a</em> (pattern S4).",
    "A plural noun after a number: four of the six <em>cities</em>.",
    "Water is uncountable, so <em>amount</em>; households are countable, so <em>number</em>."
   ]
  },
  "B2": {
   "key": "Fixed phrases take the; first mentions of a change take a; plural nouns take -s; number for countable nouns, amount for uncountable ones.",
   "body": [
    "Band 7 for Grammatical Range and Accuracy says <em>\"error-free sentences are frequent\"</em>. Most of the errors that stop this are small and repeated: a missing <em>the</em>, a missing <em>-s</em>, <em>amount</em> where <em>number</em> is needed. Because they repeat, it is more efficient to fix the family than to fix each mistake one by one.",
    "<strong>Articles.</strong> The kit phrases are fixed and always carry <em>the</em>: <em>the line graph</em>, <em>the number of</em>, <em>the figure for</em>, <em>the proportion of</em>. Superlatives such as <em>the highest</em> and <em>the lowest</em> always take <em>the</em> as well. A change, on the other hand, takes <em>a</em> the first time it is named: <em>a steep rise</em>, <em>a peak</em>, <em>a slight fall</em>. That is why pattern S4, <em>There was a [adjective] rise/fall in ...</em>, always has <em>a</em>.",
    "Plural categories used in general take no article: <em>students</em>, <em>passengers</em>, <em>arrivals</em>. Energy sources named in general take none either: <em>coal</em>, <em>wind</em>, <em>hydro</em>. An uncountable noun such as <em>water</em> can never take <em>a</em>; when it refers to the specific water shown in the chart, it takes <em>the</em>.",
    "<strong>Plurals.</strong> After a number bigger than one, the noun is plural: <em>four schools</em>, <em>six cities</em>. <em>Fewer</em> compares plural things, so the noun after it also needs <em>-s</em>. Thai has no plural ending, so this needs a deliberate check on every noun that follows a number or a word of quantity.",
    "<strong>Number or amount.</strong> <em>The number of</em> goes with things you can count (people, cars, cups, arrivals). <em>The amount of</em> goes with things you cannot count (money, energy, time, rice). <em>The proportion of</em> and <em>the percentage of</em> work with either. Ask one question before you choose: could I put a number directly in front of this noun, as in <em>three cars</em>? If not, the noun is uncountable and takes <em>amount</em>."
   ],
   "examples": [
    "The kit phrase <em>the number of</em> always starts with <em>the</em>; the figures in the sentence are not the problem.",
    "A change named for the first time takes <em>a</em>: pattern S4.",
    "A plural noun after a number: <em>four of the six cities</em>.",
    "Water is uncountable, so <em>amount</em>; households are countable, so <em>number</em>."
   ]
  }
 },
 "m11s2": {
  "A1": {
   "key": "Match the verb to the main noun, use commas well, spell key words exactly.",
   "body": [
    "<strong>Agreement</strong> (the verb matches the subject). Find the <strong>head noun</strong> (the main noun). Look at <em>the number of students</em>. The head noun is <em>number</em>. It is one thing, so use <em>was</em>. Now look at <em>the figures for A and B</em>. The head noun is <em>figures</em>, so use <em>are</em>. A later plural word does not change the verb.",
    "<strong>Commas.</strong> Put a comma after an opener. Write <em>In 2015,</em> or <em>Overall,</em> or <em>By contrast,</em>. Put a comma before <em>whereas</em> or <em>while</em>. Two full sentences need more than a comma. That error is a <strong>comma splice</strong> (a wrong join). Add <em>while</em>, or use a full stop.",
    "<strong>Spelling.</strong> Learn ten key words exactly. They are <em>percentage, significantly, approximately, fluctuated, decreased</em>. Also <em>proportion, whereas, respectively, which, throughout</em>. Watch the hard parts: per-<em>cent</em>-age, signi-<em>fi</em>-cantly. Also w-<em>h</em>-ich and respec-<em>tive</em>-ly. Check them in the last minute."
   ],
   "examples": [
    "The head noun is <em>number</em>, so <em>was</em>.",
    "A comma comes after the opening time phrase.",
    "<em>While</em> joins the two parts. A comma alone is wrong.",
    "A key word, spelled exactly."
   ]
  },
  "A2": {
   "key": "The verb agrees with the head noun. A comma follows an opener. Spell key words exactly.",
   "body": [
    "<strong>Agreement.</strong> In <em>the number of students was</em>, the subject is <em>number</em>, not <em>students</em>. So the verb is singular. In <em>the figures for A and B are</em>, the subject is <em>figures</em>. So the verb is plural. Find the <strong>head noun</strong> (the main noun), then choose the verb. Do not let a later plural noun pull the verb.",
    "<strong>Punctuation.</strong> Put a comma after an opening phrase: <em>In 2015,</em> <em>Overall,</em> <em>By contrast,</em>. Put a comma before <em>whereas</em> and <em>while</em> when they contrast two clauses. Never join two full sentences with only a comma. This is a <strong>comma splice</strong>. Add <em>while</em> or <em>whereas</em>, or use a full stop.",
    "<strong>Spelling.</strong> Ten words appear in most reports, so spell them exactly. They are <em>percentage, significantly, approximately, fluctuated, decreased</em>, and also <em>proportion, whereas, respectively, which, throughout</em>. Watch the hard parts: per<em>cent</em>age, signi<em>fi</em>cantly, w<em>h</em>ich, respec<em>tive</em>ly. Keep your own list and check it in the last minute."
   ],
   "examples": [
    "The head noun is <em>number</em>, not <em>passengers</em>, so <em>was</em>.",
    "A comma comes after the opening time phrase.",
    "Two clauses are joined with <em>while</em>, not with a comma alone.",
    "A kit word, spelled exactly."
   ]
  },
  "B1": {
   "key": "The verb agrees with the head noun; a comma follows an opener; the kit words are spelled exactly.",
   "body": [
    "<strong>Agreement.</strong> In <em>the number of students was</em>, the subject is <em>number</em>, not <em>students</em>, so the verb is singular. In <em>the figures for A and B are</em>, the subject is <em>figures</em>, so the verb is plural. Find the <strong>head noun</strong> first, then choose the verb. The same rule applies when a plural noun comes later in the sentence. A single building <em>was</em> replaced, even if several new ones replaced it. Check the verb every time you write <em>the number of</em>.",
    "<strong>Punctuation.</strong> Put a comma after an opening phrase: <em>In 2015, ...</em>; <em>Overall, ...</em>; <em>By contrast, ...</em>. <em>Overall</em> needs special care, because the examiner looks for it at the start of paragraph 2. Put a comma before <em>whereas</em> and <em>while</em> when they contrast two clauses. Never join two full sentences with only a comma, because that is a <strong>comma splice</strong>. Add <em>while</em> or <em>whereas</em>, or use a full stop.",
    "<strong>Spelling.</strong> Ten words carry most of the report, and they must be exact. They are <em>percentage, significantly, approximately, fluctuated, decreased, proportion, whereas, respectively, which, throughout</em>. A slip in one of them is very visible, because they appear in almost every report. The common slips are in the middle or the end of the word. <em>Percentage</em> has <em>cent</em> inside it, like <em>per cent</em>. <em>Significantly</em> has <em>-fi-</em> in the middle, and <em>which</em> keeps its <em>h</em>. <em>Respectively</em> ends in <em>-tively</em>. Keep your own list and check it in the last minute."
   ],
   "examples": [
    "Head noun <em>number</em>, so singular <em>was</em>.",
    "A comma after the opening time phrase.",
    "Two clauses joined properly with <em>while</em>, not with a bare comma.",
    "A kit word spelled exactly: <em>approximately</em> has a double <em>p</em>."
   ]
  },
  "B2": {
   "key": "The verb agrees with the head noun; a comma follows an opener; the ten kit words are spelled exactly.",
   "body": [
    "These three families are small, but they repeat in almost every report. Band 7 for Grammatical Range and Accuracy says <em>\"error-free sentences are frequent\"</em>. A repeated slip in agreement or punctuation can therefore hold the score down, even when the language around it is strong.",
    "<strong>Agreement.</strong> In <em>the number of students was</em>, the subject is <em>number</em>, not <em>students</em>, so the verb is singular. In <em>the figures for A and B are</em>, the subject is <em>figures</em>, so the verb is plural, even though each city is one place. Find the <strong>head noun</strong>, then choose the verb. Be especially careful when a plural noun appears later in the sentence. A single building <em>was</em> replaced by several new blocks, because the subject is still the one building.",
    "<strong>Punctuation.</strong> Put a comma after an opening phrase: <em>In 2015, ...</em>; <em>Overall, ...</em>; <em>By contrast, ...</em>. <em>Overall</em> matters most, because the examiner looks for it at the start of paragraph 2. Put a comma before <em>whereas</em> and <em>while</em> when they contrast two clauses. Never join two full sentences with only a comma: two complete clauses separated by a bare comma are a <strong>comma splice</strong>. Add <em>while</em> or <em>whereas</em>, or use a full stop. A full stop is often the clearest choice, because two short sentences are easier to check than one long one.",
    "<strong>Spelling.</strong> Ten words carry most of the report, and they must be exact: <em>percentage, significantly, approximately, fluctuated, decreased, proportion, whereas, respectively, which, throughout</em>. Because they appear in almost every report, a misspelling of one of them is highly visible. The usual slips sit inside the word: <em>percentage</em> has <em>cent</em> in the middle, like <em>per cent</em>; <em>significantly</em> has <em>-fi-</em>; <em>which</em> keeps its <em>h</em>; <em>respectively</em> ends in <em>-tively</em>. Keep your own list of words you misspell and check it in the last minute."
   ],
   "examples": [
    "Head noun <em>number</em>, so singular <em>was</em>, whatever the plural after <em>of</em>.",
    "A comma after the opening time phrase.",
    "Two clauses joined properly with <em>while</em>, not with a bare comma (a comma splice).",
    "A kit word spelled exactly: <em>approximately</em>, with a double <em>p</em> near the start."
   ]
  }
 },
 "m11s3": {
  "A1": {
   "key": "Seven error families. Name the family, then fix the error.",
   "body": [
    "There are seven <strong>error families</strong> (types of error). <strong>E1</strong> is articles: <em>a</em>, <em>the</em>. <strong>E2</strong> is plurals, and <em>number</em> or <em>amount</em>. <strong>E3</strong> is agreement of verb and subject. <strong>E4</strong> is tense. <strong>E5</strong> is prepositions with figures. <strong>E6</strong> is punctuation: commas and apostrophes. <strong>E7</strong> is word form, collocation and spelling.",
    "<strong>Tense</strong> follows the dates. Past dates take past verbs: <em>rose</em>, <em>was</em>. A chart with one past date uses past verbs only. A process or no dates take the present. Future years take <em>is expected to</em>.",
    "<strong>Prepositions</strong> follow the meaning. In <em>rose to 50</em>, 50 is the end. With <em>by</em>, 50 is the size of the change. Write <em>from X to Y</em>. Levels take <em>at</em>: <em>peaked at</em>, <em>stood at</em>.",
    "An <strong>apostrophe</strong> shows owning: <em>the city's budget</em>.",
    "Check each sentence three times. First check the verb. Then check the nouns. Then check the figure and comma."
   ],
   "examples": [
    "Preposition family. Levels take <em>at</em>.",
    "Tense family. 2015 is in the past.",
    "Preposition family. 3,000 is the size of the fall.",
    "Punctuation family. The apostrophe shows owning."
   ]
  },
  "A2": {
   "key": "One sentence, one error, seven families. Name the family, then fix the error.",
   "body": [
    "Seven <strong>families</strong> cause most Task 1 errors. <strong>E1</strong> articles. <strong>E2</strong> plurals and <em>number</em> or <em>amount</em>. <strong>E3</strong> subject-verb agreement. <strong>E4</strong> tense. <strong>E5</strong> prepositions with figures. <strong>E6</strong> punctuation, including commas and apostrophes. <strong>E7</strong> word form, collocation and spelling. An example is <em>a sharply increase</em> for <em>a sharp increase</em>. If you can name the family, you find the error faster.",
    "<strong>Tense</strong> follows the dates. Past dates take the past simple: <em>rose</em>, <em>was</em>. If a chart has one past date, every verb is past. A process or a chart with no dates takes the present. A process is often passive. Only future years take <em>is expected to</em>.",
    "<strong>Prepositions</strong> follow the meaning. <em>Rose to</em> gives the end point. <em>Rose by</em> gives the size of the change. Write <em>rose from X to Y</em>. Levels take <em>at</em>: <em>peaked at</em>, <em>stood at</em>, <em>remained at</em>. An apostrophe shows that something belongs to someone: <em>the city's budget</em>.",
    "Check in three quick passes. First read for the verb: tense and agreement. Then read for the nouns: article, plural, number or amount. Last, read for the figure: preposition and comma."
   ],
   "examples": [
    "Preposition family: <em>stood at</em>, <em>peaked at</em>.",
    "Tense family: 2015 is a past date.",
    "Preposition family: 3,000 is the size of the change, not the end point.",
    "Punctuation family: the apostrophe of possession."
   ]
  },
  "B1": {
   "key": "One sentence, one error, seven possible families. Name the family, then fix it.",
   "body": [
    "Seven families cause most Task 1 errors. <strong>E1</strong> is articles, <strong>E2</strong> plurals and number / amount, <strong>E3</strong> subject-verb agreement and <strong>E4</strong> tense. <strong>E5</strong> is prepositions with figures, <strong>E6</strong> punctuation, and <strong>E7</strong> word form, collocation and spelling. An E7 example is <em>a sharply increase</em>, which should be <em>a sharp increase</em>. Punctuation includes apostrophes as well as commas: <em>the city's budget</em>. If you can name the family, you find the error faster. If you keep a log of your own families, you stop repeating them.",
    "Two families need a reminder. <strong>Tense</strong> follows the dates. Past dates take the past simple (<em>rose</em>, <em>was</em>). A chart with a single past date keeps every verb in the past. A process or a chart with no dates takes the present, often passive for a process. Only future years take <em>is expected to</em>.",
    "<strong>Prepositions</strong> follow the meaning. <em>Rose to</em> gives the end point, and <em>rose by</em> gives the size of the change. Write <em>rose from X to Y</em> for both ends. A level takes <em>at</em>: <em>peaked at</em>, <em>stood at</em>, <em>remained at</em>.",
    "The self-check routine takes three minutes. Read each sentence once for the verb (tense and agreement). Then read it once for the nouns (article, plural, number or amount). Finally read it once for the figure (preposition, comma). Three quick passes find more than one slow read."
   ],
   "examples": [
    "Preposition family: a level takes <em>at</em>, as in <em>stood at</em> and <em>peaked at</em>.",
    "Tense family: 2015 is a past date, so past simple.",
    "Preposition family: 3,000 is the size of the change, not the end point.",
    "Punctuation family: the apostrophe of possession."
   ]
  },
  "B2": {
   "key": "One sentence, one error, seven possible families. Name the family, then fix it.",
   "body": [
    "The seven families that cause most Task 1 errors are <strong>E1</strong> articles, <strong>E2</strong> plurals and number / amount, <strong>E3</strong> subject-verb agreement and <strong>E4</strong> tense. The other three are <strong>E5</strong> prepositions with figures, <strong>E6</strong> punctuation, and <strong>E7</strong> word form, collocation and spelling (<em>a sharply increase</em> becomes <em>a sharp increase</em>). Punctuation covers more than commas: the possessive apostrophe, as in <em>the city's budget</em>, belongs to E6 as well. A student who can name the family finds the error faster, and a student who keeps a log of their own families stops repeating them.",
    "Two of the families need a reminder. <strong>Tense</strong> follows the dates. Past dates take the past simple (<em>rose</em>, <em>was</em>), and when a chart has a single past date, every verb in the sentence stays in the past. A process, or a chart with no dates, takes the present, usually the present passive for a man-made process. Only future years take <em>is expected to</em>, so a projection chart switches to future forms only after its last real year.",
    "<strong>Prepositions</strong> follow the meaning. A figure after <em>rose to</em> is the end point; a figure after <em>rose by</em> is the size of the change; <em>rose from X to Y</em> gives both ends. A level takes <em>at</em>: <em>peaked at</em>, <em>stood at</em>, <em>remained at</em>. Getting <em>to</em> and <em>by</em> wrong changes the meaning of the figure, so the sentence then reports a number that the chart does not show.",
    "The self-check routine takes three minutes. Read each sentence once for the verb (tense and agreement), once for the nouns (article, plural, number or amount) and once for the figure (preposition, comma). Three quick passes find more than one slow read, because each pass looks for one kind of error only."
   ],
   "examples": [
    "Preposition family: a level takes <em>at</em>, as in <em>stood at</em> and <em>peaked at</em>.",
    "Tense family: 2015 is a past date, so the past simple.",
    "Preposition family: 3,000 is the size of the change, not the end point, so <em>by</em>.",
    "Punctuation family: the apostrophe of possession, since the budget belongs to the city."
   ]
  }
 },
 "m12s1": {
  "A1": {
   "key": "Do not repeat names. Point back with it, this figure, the former, the latter.",
   "body": [
    "Weak reports repeat a name in every sentence. That is Band 6. Band 7 says <em>\"reference and substitution is used flexibly\"</em>. So point back. Do not write the name again.",
    "<strong>It</strong> is for one thing. <em>They</em> is for two or more. <strong>This figure</strong> points back to a number. Use it when the number changed.",
    "<strong>The former</strong> is the first of two names. <strong>The latter</strong> is the second. The order of the names decides. <em>Peru and Chile grew; the latter grew more.</em> The latter is Chile. <strong>Both</strong> means the pair.",
    "<strong>Respectively</strong> means in the same order. Write two names, then two numbers. Then write <em>respectively</em>.",
    "<em>Over the same period</em> means the same years. <em>In the same year</em> means one year.",
    "A pointer comes after its thing. It must point at one thing. A wrong pointer is worse than the name. An opening <strong>connector</strong> (linking word) takes a comma."
   ],
   "examples": [
    "<em>This figure</em> points back to 300,000.",
    "<em>The former</em> is North. <em>The latter</em> is South.",
    "The name comes twice. Use a pointer."
   ]
  },
  "A2": {
   "key": "Do not repeat names. Point back with it, this figure, the former / the latter, respectively.",
   "body": [
    "A Band 6 report repeats the same name in every sentence. The Band 7 descriptor says <em>\"reference and substitution is used flexibly\"</em>. This means pointing back to something already named.",
    "<strong>It / its</strong> points back to one thing; <em>they</em> is for two or more. <strong>This figure</strong> points back to a number. Choose the word for what really changed. If a number doubled, write <em>this figure</em>, not the place.",
    "<strong>The former</strong> is the first of two names and <strong>the latter</strong> is the second. The order of naming decides. In <em>Peru and Chile grew; the latter grew more</em>, the latter is Chile. <strong>Both</strong> and <strong>the two</strong> mean the pair.",
    "<strong>Respectively</strong> matches two figures to two names in the same order. Write the names, then the figures, then <em>respectively</em>.",
    "You can point back to time too. <em>Over the same period</em> means the same span of years. <em>In the same year</em> means one single year.",
    "A pointing word comes after the thing it points to. It must point at one clear thing. A wrong pointer is worse than repeating the name. Also, an opening <strong>connector</strong> (linking word) takes a comma."
   ],
   "examples": [
    "<em>This figure</em> points back to 300,000, so the number is not repeated.",
    "<em>The former</em> is North School and <em>the latter</em> is South School, in naming order.",
    "The same name appears twice. A pointing word would avoid this."
   ]
  },
  "B1": {
   "key": "Refer back instead of repeating: it, this figure, the former / the latter, both, respectively, over the same period.",
   "body": [
    "A Band 6 report repeats the category name in every sentence: <em>The zoo had 300,000 visitors. The zoo fell …</em> The Band 7 descriptor for Coherence and Cohesion says <em>\"reference and substitution is used flexibly\"</em>. This means pointing back to something already named instead of naming it again.",
    "Four tools cover almost every case. <strong>It / its</strong> and <strong>this figure</strong> point back to the last thing named. <em>It</em> is for one thing and <em>they</em> for more than one. Match the reference to what actually changed: if a number doubled, write <em>this figure</em>, not the place.",
    "<strong>The former / the latter</strong> pick the first and second of two items just mentioned. The order of naming decides. In <em>Peru and Chile grew; the latter grew more</em>, the latter is Chile. <strong>Both</strong> and <strong>the two</strong> gather a pair.",
    "<strong>Respectively</strong> matches two figures to two names in the same order. Give the two names, then the two figures, then <em>respectively</em>. One sentence does the work of two.",
    "Time and place can be referred back to as well. <em>Over the same period</em> points back to a span of years. <em>In the same year</em> points to one year. <em>In each country</em> works for places.",
    "Aim for at least two reference tools in every report. A reference word comes after the thing it refers to. It must point clearly at one thing. A reference aimed at the wrong item is worse than repeating the noun. Finally, a <strong>connector</strong> that opens a sentence takes a comma."
   ],
   "examples": [
    "<em>This figure</em> points back to 300,000 without repeating it.",
    "<em>The former</em> = North School and <em>the latter</em> = South School, in the order they were named.",
    "A repeated name. A pointing word would avoid it."
   ]
  },
  "B2": {
   "key": "Refer back instead of repeating: this figure, the former / the latter, both, respectively, over the same period.",
   "body": [
    "The Band 6 report repeats the category name in every sentence: <em>The zoo had 300,000 visitors. The zoo fell … The zoo …</em> The Band 7 descriptor for Coherence and Cohesion says <em>\"reference and substitution is used flexibly\"</em>. This simply means pointing back to something already named instead of naming it again. Band 6 warns that reference <em>\"may lack flexibility or clarity and result in some repetition or error\"</em>.",
    "Four tools cover almost every case. <strong>It / its</strong> and <strong>this figure / this number</strong> point back to the last thing named; <em>it</em> refers to a single thing, <em>they</em> to more than one. Make the reference match what actually changed: when a value doubles, it is <em>this figure</em> that doubled, not the place.",
    "<strong>The former / the latter</strong> pick the first and second of two items just mentioned, so the order of naming decides. In <em>Peru and Chile grew; the latter grew more</em>, <em>the latter</em> can only be Chile. <strong>Both</strong> and <strong>the two</strong> gather a pair.",
    "<strong>Respectively</strong> matches two figures to two names in the same order. Give the names, then the figures, then <em>respectively</em>, and one sentence does the work of two.",
    "Time and place can be referred back to too. <em>Over the same period</em> points back to a span of years already given. <em>In the same year</em> points to a single year. <em>In each country</em> and <em>in this group</em> work the same way for places and categories.",
    "Aim for at least two reference tools in every report, and check each one. A reference must follow the thing it points to: <em>this figure</em> needs a figure before it, and <em>the others</em> works only once the others have been named. It must also point clearly at one thing. A reference aimed at the wrong item is worse than repeating the noun. Finally, a <strong>connector</strong> that opens a sentence takes a comma."
   ],
   "examples": [
    "<em>This figure</em> points back to 300,000 without repeating it.",
    "<em>The former</em> = North School, <em>the latter</em> = South School, in the order they were named.",
    "A repeated name, the clearest sign of Band 6 cohesion. A reference word would avoid it."
   ]
  }
 },
 "m12s2": {
  "A1": {
   "key": "Do not number every sentence. Link with contrast, time or reference words.",
   "body": [
    "Do not start every sentence with <em>Firstly</em> or <em>Moreover</em>. Band 6 says <em>\"faulty or mechanical\"</em>. The cause is <em>\"overuse\"</em>. These words count sentences. They do not link ideas.",
    "Good links have a meaning. <strong>Contrast</strong> means one up, one down, or high against low. Use <em>In contrast</em>, <em>By contrast</em>, <em>however</em> or <em>whereas</em>. <strong>Time</strong>: <em>the following year</em>, <em>then</em>, <em>by 2020</em>. <strong>Reference</strong>: <em>this figure</em>, <em>the latter</em>.",
    "Pick the right meaning. <em>Moreover</em>, <em>In addition</em>, <em>Furthermore</em> and <em>Similarly</em> add a similar point. Never use them for contrast. <em>Therefore</em> and <em>As a result</em> give a cause. Charts show no causes.",
    "An opening connector takes a comma: <em>However, tea fell.</em> Never join two sentences with only a comma. <em>Rice rose, however, tea fell</em> is wrong. It is a <strong>comma splice</strong>. Use a full stop or a semicolon. Or use <em>whereas</em>.",
    "Time phrases show the order of events. So you do not need <em>Firstly</em>."
   ],
   "examples": [
    "A time phrase links. <em>However</em> is inside.",
    "<em>In contrast</em>: one fell, one rose.",
    "Counting words, not linking words."
   ]
  },
  "A2": {
   "key": "A connector on every sentence is mechanical. Link with meaning: contrast, time and reference.",
   "body": [
    "Many students think more linking words mean better cohesion. The opposite is true. Band 6 says cohesion may be <em>\"faulty or mechanical\"</em> because of <em>\"overuse\"</em>. <em>Firstly … Secondly … Moreover … Finally</em> is the classic example. These words count sentences; they do not link ideas.",
    "Good links carry meaning. <strong>Contrast</strong>: <em>in contrast</em>, <em>by contrast</em>, <em>however</em>, <em>whereas</em>, <em>while</em>. <strong>Time</strong>: <em>the following year</em>, <em>then</em>, <em>by 2020</em>. <strong>Reference</strong>: <em>this figure</em>, <em>the same period</em>, <em>the latter</em>.",
    "Name the relationship correctly. <em>Moreover</em>, <em>in addition</em>, <em>furthermore</em> and <em>similarly</em> add a similar point. So they cannot introduce a contrast. A rise after a fall is a contrast. So is low against high. <em>Therefore</em> and <em>as a result</em> claim a cause. A chart does not show causes.",
    "A connector that opens a sentence takes a comma: <em>However, tea fell.</em> Do not join two full sentences with only a comma. <em>Rice rose, however, tea fell</em> is a <strong>comma splice</strong>. Use a full stop or a semicolon before <em>however</em>. Or join them with <em>whereas</em> or <em>while</em>.",
    "When time phrases make the order clear, no <em>Firstly</em> is needed."
   ],
   "examples": [
    "A time phrase does the linking; <em>however</em> sits inside the sentence.",
    "The connector names the relationship: contrast.",
    "These are counting words, not linking words."
   ]
  },
  "B1": {
   "key": "A connector on every sentence is \"mechanical\". Link with meaning: contrast, time and reference words.",
   "body": [
    "Students are often taught that more linking words mean better cohesion. The opposite is true. The Band 6 descriptor says cohesion may be <em>\"faulty or mechanical\"</em> because of <em>\"overuse\"</em>. <em>Firstly … Secondly … Moreover … In addition … Finally</em> is the classic example. The connectors are counting sentences, not linking ideas. Band 7 openers carry time, reference or contrast instead.",
    "Good links carry meaning. For contrast: <em>in contrast</em>, <em>by contrast</em>, <em>however</em>, <em>whereas</em>, <em>while</em>. For time: <em>the following year</em>, <em>over the next decade</em>, <em>by 2020</em>. For reference: <em>this figure</em>, <em>the same period</em>, <em>the latter</em>.",
    "Use a connector only when a relationship needs naming, and name it correctly. <em>Moreover</em>, <em>in addition</em>, <em>furthermore</em> and <em>similarly</em> add a similar point. They cannot introduce a contrast, such as a rise against a fall. They also cannot set the lowest value against the highest. <em>Therefore</em> and <em>as a result</em> claim a cause that the chart does not show.",
    "Punctuate connectors carefully. A connector that opens a sentence takes a comma: <em>However, tea fell.</em> A full sentence cannot be joined to another with only a comma. <em>Rice rose, however, tea fell</em> is a <strong>comma splice</strong>. Use a full stop or a semicolon before <em>however</em>. You can also join the sentences with <em>whereas</em> or <em>while</em>.",
    "Time phrases such as <em>the following year</em>, <em>then</em> and <em>by 2025</em> move the reader through a story. When the order is already clear, no numbering word is needed."
   ],
   "examples": [
    "A time phrase does the linking; <em>however</em> sits inside the sentence.",
    "The connector names the relationship: contrast.",
    "Counting words, not linking words."
   ]
  },
  "B2": {
   "key": "A connector on every sentence is \"mechanical\". Link with meaning instead: contrast, time and reference words.",
   "body": [
    "Students are often taught that more linking words mean better cohesion. The opposite is true. The Band 6 descriptor says cohesion may be <em>\"faulty or mechanical\"</em> because of <em>\"overuse\"</em>. A paragraph that goes <em>Firstly … Secondly … Moreover … In addition … Finally</em> is the classic example. The connectors are counting sentences, not linking ideas, so every claim can be true and the cohesion still weak. Band 7 openers carry time, reference or contrast instead.",
    "Good links carry meaning. For contrast: <em>in contrast</em>, <em>by contrast</em>, <em>however</em>, <em>whereas</em>, <em>while</em>. For time: <em>the following year</em>, <em>over the next decade</em>, <em>by 2020</em>. For reference: <em>this figure</em>, <em>the same period</em>, <em>the latter</em>.",
    "Use a connector only when the relationship between two sentences needs naming, and choose the one that names it correctly. <em>Moreover</em>, <em>in addition</em>, <em>furthermore</em> and <em>similarly</em> add a point in the same direction. They cannot introduce a contrast, such as a rise set against a fall or the lowest value set against the highest. Placed after a fall, <em>furthermore</em> even suggests a second fall. <em>Therefore</em> and <em>as a result</em> claim a cause, and since a chart shows no causes, they invent one.",
    "Punctuate connectors carefully. A connector that opens a sentence takes a comma: <em>However, tea fell.</em> A full sentence cannot be joined to another with only a comma. <em>Rice rose, however, tea fell</em> is a <strong>comma splice</strong>, and moving the comma does not cure it. Use a full stop or a semicolon before <em>however</em>, or join the sentences with <em>whereas</em> or <em>while</em>.",
    "Time phrases such as <em>the following year</em>, <em>then</em> and <em>by 2025</em> carry the reader through a story. When the order is already clear, no numbering word is needed."
   ],
   "examples": [
    "A time phrase does the linking; <em>however</em> sits inside the sentence, after the time phrase.",
    "The connector names the relationship between a fall and a rise: contrast.",
    "Counting words, not linking words. Every claim could be true and the cohesion would still be weak."
   ]
  }
 },
 "m12s3": {
  "A1": {
   "key": "Join two short sentences with which, Having + past participle, or with + -ing.",
   "body": [
    "Band 8 grammar needs <em>\"a wide range of structures\"</em>. An easy way: join two short sentences.",
    "A <strong>relative clause</strong> (a which part) adds a fact. <em>The zoo opened in 2005. It grew fast.</em> Join them: <em>The zoo, which opened in 2005, grew fast.</em> The second fact keeps its verb.",
    "Put a comma on both sides. Use <em>which</em> for things. Never put <em>that</em> after a comma. <em>Where</em> is for a place or stage. Add <em>previously</em> for an old fact.",
    "A <strong>participle clause</strong> starts with <em>Having</em> + past participle. <em>Having peaked in 2012, tea sales fell.</em> Tea sales peaked. So tea sales comes next. Keep <em>having</em>. Never write <em>having been peaked</em>. Keep a main verb.",
    "Third: a comma, <em>with</em>, a noun, an <em>-ing</em> verb. <em>Prices rose, with fruit leading.</em> Not <em>was</em>, <em>it</em> or <em>to</em>.",
    "Use one per paragraph. A wrong long sentence scores low."
   ],
   "examples": [
    "A which part. Commas on both sides.",
    "The number of users is the subject of both parts.",
    "No <em>that</em> after a comma."
   ]
  },
  "A2": {
   "key": "Join two simple sentences with which, a participle clause or with + noun + -ing.",
   "body": [
    "To move from Band 7 towards Band 8, grammar needs <em>\"a wide range of structures\"</em>. An easy way is to join two simple sentences.",
    "<strong>Relative clause.</strong> <em>The zoo opened in 2005. It grew fast.</em> becomes <em>The zoo, which opened in 2005, grew fast.</em> The first sentence becomes the <em>which</em> part. The second keeps its verb. For an old fact, add <em>previously</em> to show the time.",
    "This clause has commas on both sides. Use <em>which</em> for things and <em>who</em> for people, never <em>that</em>. <em>That</em> is only for clauses without commas. <em>Where</em> introduces a place or a stage.",
    "<strong>Participle clause.</strong> Drop the subject and use <em>having</em> + past participle. <em>Having peaked in 2012, tea sales fell.</em> The main subject must be the thing that peaked. Do not drop <em>having</em>. Do not write <em>having been peaked</em>. Keep a main verb.",
    "<strong>With + noun + -ing</strong> adds a detail after a comma. <em>Prices rose, with fruit leading.</em> Use the <em>-ing</em> form, not <em>was</em>, <em>it</em> or <em>to</em>.",
    "One of these per paragraph is enough. A faulty complex sentence scores below a correct simple one."
   ],
   "examples": [
    "A <em>which</em> clause with commas on both sides.",
    "A participle clause; the number of users is the subject of both parts.",
    "<em>That</em> cannot follow a comma. Use <em>which</em>."
   ]
  },
  "B1": {
   "key": "Join two simple sentences with which, where, a participle clause or with + noun + -ing, accurately.",
   "body": [
    "Relative clauses, participle clauses and <em>with + noun + -ing</em> are what lift a Band 7 report towards Band 8, where Grammatical Range asks for <em>\"a wide range of structures\"</em>. The cheapest way to add one is to join two simple sentences that share a subject.",
    "<strong>Relative clause.</strong> <em>The zoo opened in 2005. It grew fast.</em> becomes <em>The zoo, which opened in 2005, grew fast.</em> The first sentence becomes a <em>which</em> clause and the second keeps its verb. The clause can hold the old state while the main clause holds the change. <em>Previously</em> makes the time order clear.",
    "A clause between commas that adds information is <strong>non-defining</strong>. It needs commas on both sides. Only <em>which</em> (or <em>who</em> for people) can introduce it. <em>That</em> is for defining clauses without commas. <em>Where</em> introduces a place or a stage: <em>the tank, where water is cleaned</em>.",
    "<strong>Participle clauses</strong> drop the subject and use <em>-ing</em> or <em>having</em> + past participle: <em>Having peaked in 2012, tea sales fell.</em> The subject of the main clause must be the thing that peaked. <em>Having peaked in 2012, the fall in tea sales …</em> is wrong, because the fall did not peak. Do not drop <em>having</em> or write <em>having been peaked</em>. Keep a main verb.",
    "A third shape, <strong>with + noun + -ing</strong>, adds a detail after a comma: <em>Prices rose, with fruit leading.</em> The verb is the <em>-ing</em> form, not <em>was</em>, <em>it</em> + verb or <em>to</em> + verb.",
    "One of these per paragraph is enough. A faulty complex sentence scores below a correct simple one. Check the commas and the subject every time."
   ],
   "examples": [
    "A non-defining relative clause with commas on both sides.",
    "A participle clause; the number of landline users is the subject of both parts.",
    "<em>That</em> cannot follow a comma. Use <em>which</em>."
   ]
  },
  "B2": {
   "key": "Join two simple sentences with which, where, a participle clause or with + noun + -ing: one per paragraph, always accurate.",
   "body": [
    "Relative clauses, participle clauses and <em>with + noun + -ing</em> are what lift a Band 7 report towards Band 8, where Grammatical Range asks for <em>\"a wide range of structures\"</em> used flexibly and accurately. The cheapest way to add one is to join two simple sentences that share a subject.",
    "<strong>Relative clause.</strong> <em>The zoo opened in 2005. It grew fast.</em> becomes <em>The zoo, which opened in 2005, grew fast.</em> The first sentence becomes a <em>which</em> clause and the second keeps its verb, so two facts sit in one accurate sentence. This suits a before-and-after story. The clause holds the old state or the starting point, the main clause holds the change, and <em>previously</em> keeps the time order clear.",
    "A clause between commas that adds information is <strong>non-defining</strong>. It takes commas on both sides, and only <em>which</em> (or <em>who</em> for people) can introduce it; <em>that</em> belongs to defining clauses, which have no commas. A clause with only one of its two commas is a common Band 6 fault. <em>Where</em> introduces a place or a stage: <em>the tank, where water is cleaned</em>.",
    "<strong>Participle clauses</strong> drop the subject and use <em>-ing</em> or <em>having</em> + past participle: <em>Having peaked in 2012, tea sales fell.</em> The subject of the main clause must be the subject of the participle. <em>Having peaked in 2012, the fall in tea sales …</em> is wrong because the fall did not peak. Three other faults are common: dropping <em>having</em>, making the verb passive (<em>having been peaked</em>) and leaving out the main verb.",
    "A third shape, <strong>with + noun + -ing</strong>, attaches a detail to a general statement after a comma: <em>Prices rose, with fruit leading.</em> The verb must be the <em>-ing</em> form, not <em>was</em>, <em>it</em> + verb or <em>to</em> + verb.",
    "One of these structures per paragraph is enough. A faulty complex sentence scores below a correct simple one, so check the commas and the subject every time."
   ],
   "examples": [
    "Non-defining relative clause, commas on both sides.",
    "Participle clause; the number of landline users is the subject of both parts, so the sentence is accurate.",
    "<em>That</em> cannot follow a comma. Use <em>which</em>."
   ]
  }
 },
 "m13s1": {
  "A1": {
   "key": "A key feature is a big, true fact about the whole chart.",
   "body": [
    "Band 7 talks about <em>\"key features\"</em>. Band 8 says <em>\"skilfully selected\"</em>. A <strong>key feature</strong> (a main point) is chart news.",
    "There are five kinds. The <strong>direction</strong>: what rose or fell overall. The <strong>largest and smallest</strong>, like the lowest every time. The <strong>biggest change or gap</strong>. A <strong>crossover</strong> (one line passes another). An <strong>exception</strong> (the odd one out). For example, one item falls and the rest rise.",
    "These are not key features. One number. A count, like <em>seven types are shown</em>. A tiny change. An obvious fact. A reason or an opinion. One number is only <strong>evidence</strong> (proof).",
    "Do two tests. Is it clear? <em>The figures varied</em> says nothing. Name the change. Is it true? Check the numbers. A flat line did not fall sharply. A line that rose every year never fell."
   ],
   "examples": [
    "One line's direction for the whole period. Key.",
    "One number. Evidence, not a feature.",
    "Too vague. What changed, and how?"
   ]
  },
  "A2": {
   "key": "A key feature is a general truth: direction, extremes, biggest change, crossover or exception.",
   "body": [
    "The task asks you to report the main features. Band 7 says <em>\"key features\"</em>, and Band 8 says they are <em>\"skilfully selected\"</em>. A <strong>key feature</strong> is something a newspaper would report about the chart.",
    "There are five kinds. The <strong>overall direction</strong>: what rose and what fell. The <strong>largest and smallest</strong>: for example, the lowest in every group. The <strong>biggest change or gap</strong>. A <strong>crossover</strong>, where one line passes another. An <strong>exception</strong>: one item falls while the others rise.",
    "These are not key features. One data point. A count, like <em>seven types are shown</em>. A small up and down, an obvious fact, a reason or an opinion. A single figure is <strong>evidence</strong> for a feature, not a feature.",
    "Use two tests. First, a feature must be general but clear. <em>The figures varied</em> is true of every chart, so it says nothing. Name the change. Second, it must be true. A nearly flat line did not fall sharply. A line that rose every year never fell. Check every feature against the numbers."
   ],
   "examples": [
    "The direction of one line for the whole period. This is key.",
    "One data point. It is evidence, not a feature.",
    "Too vague to be a feature. What changed, and how?"
   ]
  },
  "B1": {
   "key": "A key feature is a general truth about the whole chart: the direction, the extremes, the biggest change or gap, the crossover, the exception.",
   "body": [
    "The task says <em>selecting and reporting the main features</em>. The Band 7 descriptor talks about <em>\"key features\"</em>, and Band 8 says they are <em>\"skilfully selected\"</em>. So what counts? A <strong>key feature</strong> is something a newspaper would report about the chart.",
    "There are five kinds. The <strong>overall direction</strong>: what rose and what fell across the whole period. The <strong>largest and smallest</strong>: for example, a category that is the lowest in every group. The <strong>biggest change or gap</strong>. A <strong>crossover</strong>, where one line overtakes another. An <strong>exception</strong>: the only country that fell while the others rose. It can also be the one activity that hardly differed between the age groups while the others were much lower in the older groups.",
    "These are not key features: a single data point, a count of categories (<em>seven types are shown</em>), a small wobble. An obvious fact is not one either. Nor is anything that gives a reason or an opinion. Data points are <strong>evidence</strong> for a feature; they are not features.",
    "Two more tests. A key feature must be <em>general</em> enough for the overview, but not vague. <em>The figures varied</em> could be written without looking at the chart, so name the change. It must also be <em>true</em>. A claim can sound like a feature and still be wrong. A line that stayed almost flat did not fall sharply. A line that rose every year never fell. Check every feature against the numbers before it goes on your list."
   ],
   "examples": [
    "The direction of one line over the whole period: key.",
    "One data point: evidence, not a feature.",
    "Too vague to be a feature. What changed, and how?"
   ]
  },
  "B2": {
   "key": "A key feature is a general truth about the whole chart: the direction, the extremes, the biggest change or gap, the crossover, the exception.",
   "body": [
    "The rubric asks for <em>selecting and reporting the main features</em>. The Band 7 descriptor talks about <em>\"key features\"</em>, and Band 8 says they are <em>\"skilfully selected\"</em>. So what counts? A <strong>key feature</strong> is something a newspaper would report about the chart.",
    "There are five kinds. The <strong>overall direction</strong>: what rose and what fell across the whole period. The <strong>largest and smallest</strong>: for instance, a category that stays the lowest in every group or every year. The <strong>biggest change or gap</strong>. A <strong>crossover</strong>, where one line overtakes another. An <strong>exception</strong>: the only country whose output fell while the others rose, or the one activity that hardly differed between the age groups while the others were much lower among older people. Exceptions are easy to miss and are exactly what an examiner looks for.",
    "What is not a key feature: a single data point, a count of categories (<em>seven types are shown</em>) or a small wobble in one year. An obvious fact, such as every category having some value, is not one either. Nor is anything that gives a reason or an opinion. Data points are <strong>evidence</strong> for a feature; they are not features.",
    "Two more tests. A key feature must be <em>general</em> enough to sit in the overview, yet specific enough to say something. <em>The figures varied</em> fails, because it could be written without looking at the chart; name the difference instead. And it must be <em>true</em>. A claim can sound like a feature and still be false. A line that stayed within a narrow band did not fall sharply, and a line that rose at every point never fell. Check every feature, including its direction, against the numbers before it goes on your list."
   ],
   "examples": [
    "The direction of one line over the whole period: key.",
    "One data point: evidence, not a feature.",
    "Too vague to be a feature. What changed, and how?"
   ]
  }
 },
 "m13s2": {
  "A1": {
   "key": "Choose three or four key features. Leave the rest out on purpose.",
   "body": [
    "A report has about 180 words. It cannot hold every fact. Choose <strong>three or four</strong> features. Prove each one with numbers.",
    "Avoid these traps. A tiny change or small detail. A false claim. A reason or an opinion. A count. One number. Charts show no reasons.",
    "Each chart has usual features. <strong>Two pies</strong>: grew, shrank, leads now, stayed level. <strong>One pie</strong>: largest, smallest, top two together, middle group. <strong>Table</strong>: top and bottom of each column. Also a pattern in all rows. <strong>Process</strong>: shape, stages, start, end, phases, heat. <strong>Map</strong>: the overall change, things removed, added or moved.",
    "Up, then flat, then down? Three phases, three features. Future numbers are a feature too.",
    "Write four short notes in the margin first. A fact fits no note? Leave it out."
   ],
   "examples": [
    "Four notes for a sales graph.",
    "Four notes for two transport pies.",
    "A reason. Not on the chart. Not a feature."
   ]
  },
  "A2": {
   "key": "Before writing, choose the three or four features that best summarise the chart.",
   "body": [
    "A 180-word report cannot hold every fact. A Band 8 writer chooses <strong>three or four</strong> features. Each one gets the figures that prove it. Two go in the <strong>overview</strong> (paragraph 2).",
    "Watch for traps that feel safe. A true but tiny fact. A false claim. A reason or an opinion. A count of categories or a single figure. A reason is never on the chart.",
    "Each chart type has usual features. <strong>Two pies</strong>: what grew, shrank, leads now and stayed the same. <strong>One pie</strong>: the largest, the smallest, the top two together, the middle group. <strong>Table</strong>: the highest and lowest per column, and a pattern across all rows. <strong>Process</strong>: shape, number of stages, start and end, main phases, a key condition like temperature. <strong>Map</strong>: the overall change, and what was removed, added or moved.",
    "A rise, a flat period and a fall are three phases, so three features. A <strong>projection</strong> (future figures) is a feature, because it changes the tense.",
    "Write four short notes in the margin first. If a fact fits under none, leave it out. This is <em>\"skilfully selected\"</em>."
   ],
   "examples": [
    "Four margin notes for a sales graph.",
    "Four notes for two pie charts about transport.",
    "A reason. It is not on the chart, so it is not a feature."
   ]
  },
  "B1": {
   "key": "Before writing, tick the three or four features that best summarise the chart and leave the rest out on purpose.",
   "body": [
    "Every chart offers more facts than a 180-word report can hold. The Band 8 writer chooses <strong>three or four</strong> and gives each one the figures that prove it. They usually come from one list: direction, largest and smallest, biggest change or gap, crossover or exception. Two go in the <strong>overview</strong>; all of them get evidence in the details.",
    "The trap is the plausible distractor. It may be a true fact that is too small, or a claim that is false. It may be a reason, an opinion, a count of categories or a single figure. These feel safe because they are easy to write, but they earn nothing. A reason is never on the chart, so it is irrelevant.",
    "Each chart type has its usual features. Two pies: what grew, what shrank, what now leads, what stayed the same. One pie: the largest and smallest slices, the top two together and the middle group. A table: the biggest and smallest in each column and a pattern across all rows. A process: the shape, the number of stages, start and end, main phases and key conditions. A map: the overall change and the main things removed, added or rerouted.",
    "A rise, a plateau and a decline are three phases and three features. Projected figures are a feature too, because they change the tense.",
    "Make the choice visible. Write four short bullets in the margin first; a fact that fits under none stays out. This is what <em>\"skilfully selected\"</em> means, the step from Band 7 to 8."
   ],
   "examples": [
    "Four margin bullets for a sales graph.",
    "Four bullets for two transport pies.",
    "A reason. It is not on the chart and it is not a feature."
   ]
  },
  "B2": {
   "key": "Before writing, tick the three or four features that best summarise the chart, and leave the rest out on purpose.",
   "body": [
    "Every chart offers more facts than a 180-word report can hold. The Band 8 writer does not try to fit them all in; they choose <strong>three or four</strong> and give each one the figures that prove it. The four usually come from the same list: overall direction, largest and smallest, biggest change or gap, crossover or exception. Two of them go in the <strong>overview</strong> as general statements; all of them get evidence in the detail paragraphs.",
    "The trap is the plausible distractor: a true fact that is too small, such as a one-point change in one interval, or a claim that is false. Reasons, opinions, single figures and counts of categories are traps too. These feel safe because they are easy to write, and they fill the report with sentences that earn nothing. A reason is never on the chart, so in a report it counts as irrelevant material.",
    "The list adapts to the chart type. For two pies, ask what grew, what shrank, what now leads and what stayed the same. For one pie, the largest and smallest slices, the combined share of the top two and the middle group describe the whole chart. For a table, find the biggest and smallest in each column and any pattern across all rows. For a process, the features are the shape, the number of stages, the start and end, the main phases and any key condition such as a temperature. For a map, they are the overall change of character and the main things removed, added and rerouted.",
    "A rise, a plateau and a decline are three phases and therefore three features. A projection is a feature in itself, because it changes the tense of half the report.",
    "Make the choice visible. Write four short bullets in the margin before you write a sentence; if a fact fits under none of them, it does not go in. This is what <em>\"skilfully selected\"</em> means, and it is the difference between Band 7 and Band 8 in Task Achievement."
   ],
   "examples": [
    "Four margin bullets for a sales graph: direction, direction, crossover, lowest.",
    "Four bullets for two transport pies: shrank, grew, now leads, stayed the same.",
    "A reason. It is not on the chart and it is not a feature."
   ]
  }
 },
 "m13s3": {
  "A1": {
   "key": "Give one or two numbers that prove each feature. Do not list them all.",
   "body": [
    "Band 8 wants features <em>\"highlighted and illustrated\"</em>. To <strong>illustrate</strong> is to prove with the best numbers.",
    "A rise: give the start and the end. A gap: give the two ends. Middle numbers show only part. A <strong>crossover</strong>: give the year of the change. Give both values in that year. Pick the first year the new leader is ahead.",
    "Use numbers from the feature itself. A bus feature needs bus numbers. <em>Five times</em> or <em>a sixth</em> helps.",
    "Do not write every number in order. That is a <strong>list</strong>. The examiner says <em>\"mechanical\"</em>. No numbers is weak too. So is a reason.",
    "Every number must be right. Every direction must be right. Every comparison must be right. 48 is under 50, not above. Write <em>just under</em> or <em>close to</em>. Unsure? Write <em>approximately</em>."
   ],
   "examples": [
    "Two features with three numbers.",
    "Four numbers, no feature.",
    "The gap: two ends and a fraction."
   ]
  },
  "A2": {
   "key": "For each feature, give the one or two figures that prove it, not every figure.",
   "body": [
    "Band 8 says key features are <em>\"skilfully selected and clearly presented, highlighted and illustrated\"</em>. To <strong>illustrate</strong> is to choose the figures that make the feature easy to see.",
    "For a rise, give the start and end values. For a gap, give the two extremes, not two middle figures. For a <strong>crossover</strong>, give the year the lines change places. Give both values in that year. That is the first year the new leader is ahead.",
    "The figures must belong to the feature: a bus feature needs bus figures. A <strong>multiple</strong> or a fraction helps: <em>five times</em>, <em>a sixth</em>.",
    "To <strong>list</strong> is to give every value in order. The examiner calls this <em>\"mechanical\"</em>. It uses more figures and says less. A sentence with no figures fails too. So does an invented reason.",
    "Every figure, direction and comparison must be correct. Did it rise or fall? For example, the end value is 48 and the peak was 50. Write <em>close to</em> or <em>just under</em> the peak. Never write <em>above</em> it. When the gridline is unclear, use <em>approximately</em>."
   ],
   "examples": [
    "Two features with three figures.",
    "Four figures and no feature.",
    "The gap is shown with its two ends and a fraction."
   ]
  },
  "B1": {
   "key": "For each feature, give the one or two figures that prove it. Do not give every figure.",
   "body": [
    "Band 8 Task Achievement says key features are <em>\"skilfully selected and clearly presented, highlighted and illustrated\"</em>. To <strong>illustrate</strong> is to choose the figures that make the feature visible.",
    "For a rise, give the start and end values. For a gap, give the two extremes; a pair from the middle shows only part of it. For a <strong>crossover</strong>, give the year the lines change places and both values in that year. That is the first year the new leader is ahead. The figures must belong to the feature: a bus feature is proved with bus figures. A <strong>multiple</strong> or a fraction is worth stating: <em>five times</em>, <em>less than a sixth</em>.",
    "To <strong>list</strong> is to report every value in order. The examiner's word for this is <em>\"mechanical\"</em>. A list uses more figures and says less, because the reader must find the feature alone. A sentence with no figures, or with an invented reason, does not illustrate either.",
    "Accuracy still rules. The figure, the direction and the comparison must all be right. Suppose a value recovered to 48 after a peak of 50. <em>Close to the peak</em> or <em>just under the peak</em> is correct, but <em>slightly above the peak</em> is not. Read every figure from the axis. Use <em>approximately</em> or <em>just under</em> when the gridline is unclear."
   ],
   "examples": [
    "Two features, the rise and the crossover, with three figures.",
    "Four figures, no feature: a list.",
    "The gap illustrated with its two ends and a fraction."
   ]
  },
  "B2": {
   "key": "For each feature, give the one or two figures that prove it; do not give every figure.",
   "body": [
    "Band 8 Task Achievement says key features are <em>\"skilfully selected and clearly presented, highlighted and illustrated\"</em>. To <strong>illustrate</strong> is to choose the figures that make the feature visible.",
    "Each kind of feature has its own evidence. For a rise, give the start and end values. For a gap, give the two extremes; a pair from the middle of the range shows only part of the pattern. For a <strong>crossover</strong>, give the year in which the lines change places and both values in that year. That is the first year the new leader is ahead, not the year before, when it still trailed. The figures must belong to the feature itself: a bus feature is proved with bus figures, however tempting the train figures look. Where the numbers allow it, a <strong>multiple</strong> or a fraction is worth stating: <em>more than five times</em>, <em>less than a sixth</em>.",
    "To <strong>list</strong> is to report every value in order, and the examiner's word for this is <em>\"mechanical\"</em>. A list uses more figures and says less, because the reader has to work out the feature alone. Copying a whole table row by row states no feature at all. The opposite fault is just as weak: a sentence with no figures, or one that invents a reason, illustrates nothing.",
    "Accuracy still rules. An illustration only works if the figure, the direction and the comparison are all right. Suppose a value recovered to 48 after a peak of 50. <em>Close to the peak</em> or <em>just under the peak</em> is correct, but <em>slightly above the peak</em> is a factual error, even though 48 is right. Read the value from the axis for every figure you keep, and use <em>approximately</em> or <em>just under</em> when the gridline is unclear."
   ],
   "examples": [
    "Two features (the rise and the crossover) illustrated with three figures.",
    "Four figures, no feature: a list.",
    "The gap illustrated with its two ends and a fraction."
   ]
  }
 },
 "m14s1": {
  "A1": {
   "key": "Plan 4 minutes, write 13, check 3. Overview second. Stop at 20.",
   "body": [
    "The Writing test is 60 minutes. Task 1 gets <strong>20 minutes</strong>. It is one third of the score. Task 2 gets 40. It is worth twice as much. Never give Task 1 thirty minutes.",
    "There are five <strong>phases</strong> (parts). 0:00–0:30: <strong>triage</strong> (a quick look). Find the type, mode, units and years. 0:30–2:30: <strong>big picture</strong>. Write two overview notes in the margin. 2:30–4:00: <strong>group and select</strong>. Name two groups. Circle three to five numbers each.",
    "So plan for about four minutes. Not zero. Not ten.",
    "4:00–17:00: <strong>write</strong> four paragraphs. Write the <strong>overview</strong> after the introduction. No overview means Band 5 at most. Time may run out. Your overview is safe.",
    "17:00–20:00: <strong>check</strong>. Stop writing at 17:00. Use the ten-point list. Count words. Check tenses. Add no conclusion. Stop at 20."
   ],
   "examples": [
    "Five phases. Together they make 20 minutes.",
    "Four minutes of planning on the page.",
    "The most expensive mistake in the test."
   ]
  },
  "A2": {
   "key": "Plan for four minutes, write for thirteen, check for three. Overview second. Stop at twenty.",
   "body": [
    "The Writing test is 60 minutes. Task 1 is one third of the score and gets <strong>20 minutes</strong>. Task 2 is worth twice as much, so it gets 40. Never give Task 1 thirty minutes. Extra time there costs more on Task 2.",
    "There are five <strong>phases</strong>. <strong>0:00–0:30 Triage</strong>: the visual type, mode, units, time span and number of visuals. <strong>0:30–2:30 Big picture</strong>: write two overview notes in the margin. <strong>2:30–4:00 Group and select</strong>: name two groups and circle three to five figures for each.",
    "So planning takes about four minutes. Do not start writing at once. Do not plan for ten minutes.",
    "<strong>4:00–17:00 Write</strong> the four paragraphs, about 30, 45, 60 and 60 words. Write the <strong>overview</strong> straight after the introduction. Without it, Task Achievement cannot go above Band 5. If time runs out, it is already there.",
    "<strong>17:00–20:00 Check</strong>: stop writing and use the ten-point list. Count the words and check the tenses. Then stop. Do not add a conclusion."
   ],
   "examples": [
    "The five phases and their lengths. Together they make twenty minutes.",
    "What four minutes of planning looks like on the page.",
    "The most expensive mistake in the Writing test."
   ]
  },
  "B1": {
   "key": "Four minutes to plan, thirteen to write, three to check. Overview straight after the introduction. Hard stop at twenty.",
   "body": [
    "Task 1 is a twenty-minute sprint. The Writing test lasts 60 minutes. Task 1 is worth one third of the score and Task 2 twice as much. So Task 1 gets <strong>20 minutes</strong> and Task 2 gets 40. Task 1 never gets thirty: extra minutes there cost more on Task 2 than they earn.",
    "The students who do best do not start writing immediately. The protocol has five phases. <strong>0:00–0:30 Triage</strong>: visual type, mode, units, time span and number of visuals. <strong>0:30–2:30 Big picture</strong>: ask the headline questions and write two overview bullets in the margin. <strong>2:30–4:00 Group and select</strong>: name two groups and circle three to five figures for each. That is about four minutes of planning, not none and not ten.",
    "<strong>4:00–17:00 Write</strong> the four paragraphs, roughly 30, 45, 60 and 60 words. Write the <strong>overview</strong> immediately after the introduction, never at the end. Without an overview, Task Achievement cannot go above Band 5. Written second, it is safe when the clock runs out.",
    "<strong>17:00–20:00 Check</strong>: at 17:00 you put the pen down and work through the ten-point list. Count the words and check the tenses, then stop. Do not add a conclusion.",
    "Practise with a visible timer until the phases feel automatic. Four minutes of planning makes the writing faster and cleaner."
   ],
   "examples": [
    "The five phases and their lengths. Together they make twenty minutes.",
    "What four minutes of planning looks like on the page.",
    "The most expensive mistake in the Writing test."
   ]
  },
  "B2": {
   "key": "Four minutes to plan, thirteen to write, three to check. Overview straight after the introduction. Hard stop at twenty.",
   "body": [
    "Task 1 is a twenty-minute sprint, and the students who do best are the ones who do not start writing immediately. The protocol has five phases. <strong>0:00–0:30 Triage</strong>: visual type, mode, units, time span, number of visuals. <strong>0:30–2:30 Big picture</strong>: ask the headline questions for the mode and write two overview bullets in the margin. <strong>2:30–4:00 Group and select</strong>: name two groups and circle three to five figures for each. Together that is about four minutes. Skipping the plan produces narration, while ten minutes of planning leaves too little time to write 150 words.",
    "<strong>4:00–17:00 Write</strong> the four paragraphs to the skeleton, roughly 30, 45, 60 and 60 words. Write the <strong>overview</strong> immediately after the introduction, never at the end. Without an overview, Task Achievement cannot score above Band 5, so the paragraph that gates your band must be on the page before time can run out.",
    "<strong>17:00–20:00 Check</strong>: at 17:00 you put the pen down and work through the ten-point list, from the word count to the tenses, then stop. Do not add a conclusion.",
    "The hard rule is that Task 1 receives twenty minutes, never thirty. The Writing test lasts sixty minutes, and Task 1 is worth one third of the score while Task 2 is worth two thirds. Every extra minute spent polishing Task 1 therefore costs more than it earns. Ten extra minutes might add a few words to Task 1; ten minutes lost on Task 2 can cost a whole band.",
    "Practise with a visible timer until the phases feel automatic. Four minutes of planning makes the thirteen minutes of writing faster and cleaner, because every sentence already has its figures and its place in the skeleton."
   ],
   "examples": [
    "The five phases and their lengths. Together they make twenty minutes.",
    "What four minutes of planning looks like on the page: mode, units, span, two overview bullets and the grouping.",
    "The most expensive mistake in the Writing test."
   ]
  }
 },
 "m14s2": {
  "A1": {
   "key": "Ten checks in three minutes. Each \"no\" is a mark to win back.",
   "body": [
    "Last three minutes: run the <strong>Ten Wards</strong> (ten checks).",
    "1: four paragraphs; the overview starts <em>Overall</em>. 2: no figures in the overview. Years and names are fine. 3: a number, date or label in each detail sentence. 4: two or more comparisons. 5: tense matches the dates. 6: <em>number of</em> or <em>amount of</em>, plural -s. 7: <em>to</em>, <em>by</em>, <em>from … to</em>, <em>at</em>. 8: no opinion, reason or conclusion. No <em>I</em>, <em>we</em> or <em>you</em>. No <strong>contractions</strong> (short forms). 9: task not copied; every category named. 10: 150–190 words.",
    "Found a conclusion? Cross it out. Under 150 words loses marks. Add one comparison with numbers. Well over 150? Add nothing. Just check.",
    "Spoken words fail check 8. <em>As we can see</em>, <em>a lot</em>, <em>basically</em>, <em>I think</em>. Replace an opinion with a fact from the chart. For 97%, write <em>almost all</em>."
   ],
   "examples": [
    "Passes check 2. Years yes, figures no.",
    "Fails check 8 three times.",
    "Fails check 8. Cross it out."
   ]
  },
  "A2": {
   "key": "Ten questions in three minutes. Every \"no\" is a mark you can still win back.",
   "body": [
    "The last three minutes are for the <strong>Ten Wards</strong>, ten quick checks. (1) Four paragraphs, and the overview begins <em>Overall</em>? (2) The overview has no figures and gives two or three general truths? Years and category names are fine. (3) Every detail sentence has a number, date or label? (4) At least two comparisons? (5) The tense matches the dates?",
    "(6) <em>Number of</em> for countable, <em>amount of</em> for uncountable, plural -s in place? (7) Prepositions: <em>to</em>, <em>by</em>, <em>from … to</em>, <em>at</em>? (8) No opinion, reason or conclusion, no <em>I</em>, <em>we</em> or <em>you</em>, no <strong>contractions</strong> (short forms)? (9) Task sentence not copied, every category mentioned? (10) 150–190 words?",
    "Cross out any conclusion; the overview already does its job. Four paragraphs, not five. Under 150 words is penalised however good the report is. Add one comparison with two figures. If you are well over 150, add nothing and check.",
    "Students forget register. <em>As we can see</em>, <em>I think</em>, <em>a lot</em> and <em>basically</em> are spoken. They cost marks. Replace an opinion with a fact from the chart, such as a comparison. Do not overstate: 97% is <em>almost all</em>."
   ],
   "examples": [
    "Passes check 2: years are allowed, figures are not.",
    "Fails check 8 three times: <em>we</em>, <em>a lot</em> and an opinion.",
    "Fails check 8. Cross it out; the overview already says this."
   ]
  },
  "B1": {
   "key": "Ten questions in three minutes. Every \"no\" is a mark you can still recover.",
   "body": [
    "The last three minutes are not for admiring the report. Work through the <strong>ten-point check</strong>, the Ten Wards. (1) Four paragraphs, and the overview begins <em>Overall</em>? (2) The overview has no figures and states two or three general truths? Years and category names are allowed. (3) Every detail sentence has a number, date or label? (4) At least two explicit comparisons? (5) Tense matches the dates?",
    "(6) <em>Number of</em> for countable nouns, <em>amount of</em> for uncountable ones, plural -s in place? (7) Prepositions: <em>to</em> / <em>by</em> / <em>from … to</em> / <em>at</em>? (8) No opinion, no reason, no conclusion, no <em>I</em>, <em>we</em> or <em>you</em>, no <strong>contractions</strong>? (9) Rubric not copied, every category mentioned? (10) 150–190 words?",
    "Points 1, 2 and 8 are structural: look at the shape of the report. Points 3 to 7 need one read of each detail sentence. A conclusion found at point 8 is crossed out, because the overview already does its job. That leaves four paragraphs, not five. A report under 150 words is penalised whatever its quality. One more comparison with two figures is the fix. A report already well over 150 needs nothing more, because extra sentences add errors, not marks.",
    "Register is the check students forget. <em>As we can see</em>, <em>I think</em>, <em>a lot</em>, <em>basically</em> and contracted verbs all belong to speech. Replace a comment with a fact from the chart, such as a comparison. This adds data without adding a view. Avoid overstating too: 97% is <em>almost all</em>."
   ],
   "examples": [
    "Passes check 2: years are allowed, figures are not.",
    "Fails check 8 three times: <em>we</em>, <em>a lot</em>, an opinion.",
    "Fails check 8. Cross it out; the overview already says this."
   ]
  },
  "B2": {
   "key": "Ten questions in three minutes. Every \"no\" is a mark you can still recover.",
   "body": [
    "The last three minutes are not for admiring the report. Work through the <strong>ten-point check</strong>, the Ten Wards. (1) Four paragraphs, overview begins <em>Overall</em>? (2) Overview has no figures and states two or three general truths (years and category names are allowed)? (3) Every detail sentence has a number, date or label? (4) At least two explicit comparisons? (5) Tense matches the dates? (6) <em>Number of</em> for countable, <em>amount of</em> for uncountable, plural -s in place? (7) Prepositions: <em>to</em> / <em>by</em> / <em>from … to</em> / <em>at</em>? (8) No opinion, no reason, no conclusion, no <em>I</em>, <em>we</em> or <em>you</em>, no <strong>contractions</strong>? (9) Rubric not copied, every category mentioned? (10) 150–190 words?",
    "Points 1, 2 and 8 are structural and take ten seconds each: look at the shape of the report. Points 3 to 7 need you to read each detail sentence once, checking the figure, the tense and the preposition. A conclusion found at point 8 is simply crossed out, leaving four paragraphs, not five. The overview already does its job, and a conclusion is repetition at best and opinion at worst.",
    "Point 10 works in both directions. A report under 150 words is penalised whatever its quality, and one more comparison sentence with two figures is the quickest repair. A report already well past the target needs no more words; extra sentences add errors, not marks, so the remaining minutes go on checking.",
    "Register is the check students forget. <em>As we can see</em>, <em>I think</em>, contracted verbs, <em>a lot</em> and <em>basically</em> all belong to speech, and each one costs Lexical Resource. Read the report as an examiner would, hunting for the voice of a person. Then replace it with the voice of a report: a comment becomes a fact from the chart, such as a comparison. An overstatement such as <em>all</em> for 97% becomes <em>almost all</em>."
   ],
   "examples": [
    "Passes check 2: years are allowed, figures are not.",
    "Fails check 8 three times: <em>we</em>, <em>a lot</em>, an opinion.",
    "Fails check 8. Cross it out; the overview already says this."
   ]
  }
 },
 "m14s3": {
  "A1": {
   "key": "Count words fast. Choose your task order. Know what to do when time runs out.",
   "body": [
    "<strong>On paper</strong>: count the words on one line. Multiply by the number of lines. It takes five seconds. It is reliable. Leave a blank line between paragraphs.",
    "<strong>On computer</strong>: the screen counts the words. Use this <strong>word counter</strong>. Type four headings first. Fill them, then delete them. Type the overview second. Use cut and paste. There is no spell checker. Never type one big block.",
    "<strong>Task order</strong>: most people do Task 1 first. They stop at 20 minutes. Do you often run over? Then do Task 2 first. It counts twice. Decide before the exam.",
    "<strong>Time running out?</strong> Finish your sentence. Check <em>Overall</em>, numbers and 150 words. Never write a conclusion. A comparison with a number earns more.",
    "<strong>Length</strong>: the minimum is 150 words. Aim for 160–190. Under 150 lowers your mark. Long is not penalised. But it takes checking time and Task 2 time."
   ],
   "examples": [
    "A paper count in five seconds.",
    "This habit keeps four paragraphs.",
    "It earns nothing. A comparison earns more."
   ]
  },
  "A2": {
   "key": "Know how to count words and which task comes first. Know what to do if time runs out.",
   "body": [
    "<strong>On paper</strong>, count the words on one full line. Multiply by the number of lines and write the estimate in the margin. It takes five seconds and is reliable. Leave a blank line between paragraphs.",
    "<strong>On computer</strong>, the screen shows a <strong>word counter</strong>, so use it. Type four headings first and delete them as you fill each one. Type the overview straight after the introduction. Use cut and paste to move sentences. There is no spell checker. Never type one long block, because you lose the paragraphs.",
    "<strong>Task order.</strong> Most writers do Task 1 first and stop at twenty minutes. If you often run over, write Task 2 first. This keeps the double-weight task safe. Decide before the exam.",
    "<strong>If time runs out</strong>, finish your sentence. Then check <em>Overall</em>, a figure in each detail sentence and the word count. Never spend the last minute on a conclusion. A comparison with a figure earns more.",
    "<strong>Length.</strong> The minimum is 150 words; aim for 160–190. Length itself is not penalised. But a long report takes time from checking and Task 2."
   ],
   "examples": [
    "A paper estimate in five seconds.",
    "The computer habit that keeps four paragraphs.",
    "A sentence that earns nothing. A comparison with a figure would earn something."
   ]
  },
  "B1": {
   "key": "Know how you will count words, which task you will write first, and what you will do if the clock beats you.",
   "body": [
    "<strong>On paper</strong>, count the words on one full line and multiply by the number of lines. Write the estimate in the margin. It takes five seconds and is accurate enough. Leave a blank line between paragraphs so the examiner sees four blocks.",
    "<strong>On computer</strong>, the screen shows a <strong>word counter</strong>, so use it at the end of each paragraph. Type the four skeleton headings first and delete them as you fill each one. Type the overview immediately after the introduction. Use cut and paste to fix the order of sentences. There is no spell checker, so the ten-point check matters just as much on screen. One continuous block of text loses the paragraphing that Coherence and Cohesion rewards.",
    "<strong>Task order.</strong> Most writers do Task 1 first, with a hard stop at twenty minutes. A writer who keeps running over can write Task 2 first instead. It keeps the double-weight task safe, and Task 1 must then fit the twenty minutes left. Decide before the exam, not in the room.",
    "<strong>If time runs out</strong>, the overview is already in paragraph two, so the report can still score. Finish your sentence. Then check <em>Overall</em>, a figure in each detail sentence and a word count above 150. Never spend the last minute on a conclusion; a sentence with a comparison and a figure earns more.",
    "<strong>Length.</strong> The minimum is 150 words and the target is 160–190. Under 150 caps Task Achievement. Length itself is not penalised. Past 200, though, each extra sentence costs checking time and Task 2 time."
   ],
   "examples": [
    "A paper estimate in five seconds.",
    "The computer habit that keeps four paragraphs.",
    "A sentence that earns nothing. A comparison with a figure would earn something."
   ]
  },
  "B2": {
   "key": "Know how you will count words, which task you will write first, and what you will do if the clock beats you.",
   "body": [
    "On <strong>paper</strong>, count the words on one full line, multiply by the number of lines, and write the estimate in the margin. It takes five seconds and is accurate enough, whereas counting every word costs a minute you need for the other checks. Leave a blank line between paragraphs so the examiner sees four blocks.",
    "On <strong>computer</strong>, the screen shows a live <strong>word counter</strong>, so use it at the end of each paragraph. Type the four skeleton headings first and delete them as you fill each one. Type the overview immediately after the introduction, since it gates the band, and use cut and paste to fix the order of sentences instead of retyping. There is no spell checker, so the ten-point check matters just as much on screen. One continuous block of text throws away the paragraphing that Coherence and Cohesion rewards.",
    "<strong>Task order.</strong> Most writers do Task 1 first, with a hard stop at twenty minutes. A writer who keeps running over on Task 1 can write Task 2 first instead. It keeps the double-weight task safe, and it forces Task 1 into the twenty minutes that remain. The order is a choice; the twenty-minute limit is not. Decide before the exam, not in the room.",
    "<strong>If time runs out</strong>, the overview is already in paragraph two, so the report can still reach its band. Finish the sentence you are writing, then check the essentials: <em>Overall</em> present, a figure in each detail sentence, word count above 150. Never spend the last minute on a conclusion: it adds no marks, and a sentence with a comparison and a figure would.",
    "<strong>Length.</strong> Aim for 160–190 words; under 150 caps Task Achievement. There is no penalty for length itself. Past 200, every extra sentence costs checking time and Task 2 time, and past 250 it usually means too little selection."
   ],
   "examples": [
    "A paper estimate in five seconds.",
    "The computer habit that keeps four paragraphs and puts the overview on screen early.",
    "A sentence that earns nothing, and a vague claim as well. A comparison with a figure would earn something."
   ]
  }
 }
};
