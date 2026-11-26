/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY — orrery-content.js  (26 Nov 2026)
   Hand-written inputs for the Orrery (orrery-engine.js): the parts of the
   program that are language, not arithmetic.

     noun     what one figure counts ("760,000 visitors"); '' for a % chart
     subject  for a chart with one data line: what the line measures
              ("arrivals"), used to name the two time phases
     measure  how a trend verb's subject is built from a name ("visitor
              numbers at {x}"): the measure rises, not the museum
     what     the paraphrased [What It Shows] at each band target (6 / 7 / 8).
              Rule P: change the noun phrase, move or add the unit, never keep
              a run of eight words from the task sentence. Band 6 = one swap;
              Band 7 = swap + the unit; Band 8 = a new structure (a compound
              noun or a "how" clause) + the unit.
   Every other variable is computed from the chart data by the engine.
   Plain ES5.
   =========================================================================== */
(function (global) {
  'use strict';
  /* names: how a chart label is written in a sentence when it is not a proper
     name (labels not listed here: "the" before Museum / Gallery / School /
     Club names, proper names as they are). */
  global.ORRERY_NAMES = {
    'p-line-phones': { 'Smartphone': 'smartphone ownership', 'Basic phone': 'basic phone ownership' },
    'p-line-clubs': { 'Football': 'the football club', 'Badminton': 'the badminton club', 'Esports': 'the esports club' },
    'p-line-music': { 'Streaming': 'streaming', 'CDs': 'CDs', 'Downloads': 'downloads', 'Vinyl': 'vinyl' },
    'p-pie-energy': { 'Coal': 'coal', 'Natural gas': 'natural gas', 'Nuclear': 'nuclear power', 'Hydro': 'hydro power', 'Wind and solar': 'wind and solar power' },
    'p-pie-school-travel': { 'Walking': 'walking', 'Motorbike': 'travel by motorbike', 'Car': 'travel by car' },
    'p-pie-university': { 'Government funding': 'government funding', 'Tuition fees': 'tuition fees', 'Research grants': 'research grants', 'Donations': 'donations', 'Other': 'other sources' },
    'p-pie-holidays': { 'Other': 'other destinations' },
    'p-bar-tourists': { 'Arrivals': 'arrivals' },
    'p-bar-emoto': { 'Electric motorbikes sold': 'sales of electric motorbikes' },
    'p-bar-bags': { 'Plastic bags': 'the number of plastic bags' }
  };
  global.ORRERY_CONTENT = {
    'p-line-museums': { measure: 'visitor numbers at {x}', noun: 'visitors',
      what: { 6: 'the number of people, in thousands, who visited three museums in a European city', 7: 'how many people, in thousands, went to three museums in a European city', 8: 'visitor numbers, in thousands, at three museums in one European city' } },
    'p-line-internet': { measure: 'internet access in {x}', noun: '',
      what: { 6: 'the percentage of homes with internet access in four countries', 7: 'what percentage of households in four countries could go online at home', 8: 'the share of households, in per cent, with an internet connection in four countries' } },
    'p-line-cities': { measure: 'the population of {x}', measurePl: 'the populations of {x}', noun: 'people',
      what: { 6: 'how many people, in millions, lived in three cities', 7: 'the number of people, in millions, living in three cities', 8: 'population figures, in millions, for three major cities' } },
    'p-bar-tourists': { noun: '', subject: 'arrivals',
      what: { 6: 'how many international tourists, in millions, came to Thailand', 7: 'the number of foreign visitors, in millions, who arrived in Thailand', 8: 'international tourist arrivals, in millions, in Thailand' } },
    'p-pie-energy': { measure: 'the share of {x}', measurePl: 'the shares of {x}', noun: '',
      what: { 6: 'the percentage of electricity that came from each source in one country', 7: 'the share of electricity, in per cent, that came from five different sources in one country', 8: 'how electricity generation in one country was divided, in percentage terms, among five sources' } },
    'p-table-rice': { measure: 'rice production in {x}', noun: 'tonnes',
      what: { 6: 'how much rice, in millions of tonnes, four countries produced', 7: 'the amount of rice, in millions of tonnes, grown in four countries', 8: 'rice output, in millions of tonnes, in four producing countries' } },
    'p-line-phones': { noun: '',
      what: { 6: 'the proportion of teenagers in one country, in per cent, who had a smartphone or a basic mobile phone', 7: 'what percentage of teenagers in one country owned smartphones and basic mobile phones', 8: 'the share of teenagers, in per cent, owning a smartphone or a basic mobile phone in one country' } },
    'p-line-clubs': { measure: 'membership of {x}', noun: 'members',
      what: { 6: 'how many students were members of three clubs at one secondary school', 7: 'the number of members in three clubs at a secondary school', 8: 'membership levels, in numbers of students, of three clubs at one secondary school' } },
    'p-line-air': { measure: 'PM2.5 levels in {x}', noun: 'micrograms',
      what: { 6: 'the average yearly amount of fine dust (PM2.5), in micrograms per cubic metre, in three Asian cities', 7: 'average annual levels of fine dust (PM2.5), in micrograms per cubic metre, in three Asian cities', 8: 'the yearly concentration of fine dust (PM2.5), in micrograms per cubic metre, in the air of three Asian cities' } },
    'p-line-music': { measure: 'revenue from {x}', noun: '',
      what: { 6: 'how much money, in millions of dollars, one country earned from recorded music in four formats', 7: 'revenue, in millions of dollars, from four formats of recorded music in one country', 8: 'the income, in millions of dollars, that one country\'s music industry earned from four recorded formats' } },
    'p-line-ev': { measure: 'the share of electric cars in {x}', measurePl: 'the shares of electric cars in {x}', noun: '',
      what: { 6: 'the percentage of new cars sold in five countries that were fully electric', 7: 'what percentage of new car sales were fully electric in five countries', 8: 'the share, in per cent, of fully electric vehicles in new car sales across five countries' } },
    'p-bar-emoto': { noun: '', subject: 'sales',
      what: { 6: 'how many electric motorbikes, in thousands, people bought in one city', 7: 'the number of electric motorbikes, in thousands, bought in one city', 8: 'annual sales, in thousands, of electric motorbikes in one city' } },
    'p-bar-bags': { noun: '', subject: 'bag numbers',
      what: { 6: 'how many plastic bags, in millions, one supermarket chain gave to its customers every year', 7: 'the yearly number of single-use plastic bags, in millions, handed out by a supermarket chain', 8: 'the yearly total of single-use plastic bags, in millions, issued to shoppers by one supermarket chain' } },
    'p-bar-languages': { measure: 'the number of students taking {x}', measurePl: 'the numbers of students taking {x}', noun: 'students',
      what: { 6: 'how many secondary students, in thousands, learned three foreign languages in one country', 7: 'the number of secondary pupils, in thousands, taking three foreign languages in one country', 8: 'enrolment, in thousands, in three foreign languages among secondary pupils in one country' } },
    'p-pie-school-travel': { noun: '',
      what: { 6: 'the percentage of students at a school in Thailand who used each way of getting to school', 7: 'the share of students, in per cent, at one Thai school using each type of transport to get to school', 8: 'how pupils at one Thai school made their journey to school, in percentage terms' } },
    'p-pie-holidays': { measure: 'the share of trips to {x}', measurePl: 'the shares of trips to {x}', noun: '',
      what: { 6: 'the percentage of trips abroad that people from one Asian country made to each destination', 7: 'the share of foreign trips, in per cent, taken by residents of one Asian country to different destinations', 8: 'the percentage breakdown of overseas travel destinations for residents of an Asian country' } },
    'p-pie-university': { measure: 'the share of income from {x}', measurePl: 'the shares of income from {x}', noun: '',
      what: { 6: 'the percentage of the money of one public university that came from each source', 7: 'the share, in per cent, of each source of income for a public university', 8: 'the percentage make-up of one state university\'s income' } },
    'p-table-schools': { measure: 'student numbers at {x}', noun: 'students',
      what: { 6: 'how many students went to three secondary schools in one town', 7: 'the number of pupils enrolled at three secondary schools in a town', 8: 'student numbers at three secondary schools in one town' } },
    'p-table-rent': { measure: 'rents in {x}', noun: '',
      what: { 6: 'how much it cost, in US dollars, to rent a one-room flat each month in four Asian cities', 7: 'the average monthly cost, in US dollars, of renting a one-room flat in four Asian cities', 8: 'average rents per month, in US dollars, for one-room flats in four Asian cities' } }
  };
})(typeof window !== 'undefined' ? window : this);
