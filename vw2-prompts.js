/* VW2 — vw2-prompts.js · WS-D new prompts for the Variety of Writing 2 games (ES5).
   Same shape as prompts.js. All data original; verified against out/WS-D/data/*.csv. */
(function () {
  var P = window.CONTENT.PROMPTS;
  P.push({
    "id": "p-vw2-line-electives",
    "type": "line",
    "mode": "TREND",
    "level": "B1",
    "title": "Students choosing four language electives",
    "units": "students",
    "rubric": "The line graph shows the number of students at one secondary school who chose each of four foreign-language electives between 2016 and 2024.",
    "data": {
      "x": [
        2016,
        2018,
        2020,
        2022,
        2024
      ],
      "series": [
        {
          "name": "Chinese",
          "values": [
            60,
            80,
            100,
            120,
            140
          ]
        },
        {
          "name": "Japanese",
          "values": [
            40,
            55,
            70,
            90,
            110
          ]
        },
        {
          "name": "French",
          "values": [
            70,
            60,
            50,
            40,
            30
          ]
        },
        {
          "name": "German",
          "values": [
            50,
            45,
            35,
            30,
            20
          ]
        }
      ]
    },
    "labels": [
      "Chinese",
      "Japanese",
      "French",
      "German"
    ],
    "keyFeatures": [
      "Chinese and Japanese both rose steadily over the period",
      "French and German both declined",
      "Chinese was the most popular elective in every year",
      "French was the second most popular in 2016 but the second least popular by 2024"
    ],
    "distractorFeatures": [
      "Japanese had 55 students in 2018",
      "Students like Chinese because it is useful",
      "Four languages are shown",
      "German rose in 2022"
    ],
    "groupings": [
      [
        "Chinese",
        "Japanese"
      ],
      [
        "French",
        "German"
      ]
    ],
    "tags": [
      "all-steady",
      "two-up-two-down",
      "vw2"
    ]
  });
  P.push({
    "id": "p-vw2-bar-books",
    "type": "bar",
    "mode": "COMPARE",
    "level": "B1",
    "title": "Library books borrowed per student",
    "units": "books per student per year",
    "rubric": "The bar chart shows the average number of library books borrowed per secondary school student in six countries in 2023.",
    "data": {
      "categories": [
        "Finland",
        "Japan",
        "Korea",
        "UK",
        "Brazil",
        "Thailand"
      ],
      "series": [
        {
          "name": "Books per student",
          "values": [
            24,
            18,
            15,
            12,
            9,
            6
          ]
        }
      ]
    },
    "labels": [
      "Finland",
      "Japan",
      "Korea",
      "UK",
      "Brazil",
      "Thailand"
    ],
    "keyFeatures": [
      "Finland had by far the highest figure, four times that of Thailand",
      "Finland borrowed twice as many books per student as the UK",
      "Japan and Korea formed a middle group",
      "Thailand had the lowest figure, a quarter of Finland's"
    ],
    "distractorFeatures": [
      "Korea borrowed 15 books",
      "Reading is important for students",
      "Six countries are compared",
      "Brazil borrowed more than the UK"
    ],
    "groupings": [
      [
        "Finland",
        "Japan",
        "Korea"
      ],
      [
        "UK",
        "Brazil",
        "Thailand"
      ]
    ],
    "tags": [
      "single-series",
      "ranked",
      "vw2"
    ]
  });
  P.push({
    "id": "p-vw2-pie-freetime",
    "type": "pie",
    "mode": "COMPARE",
    "level": "B1",
    "title": "How 15-year-olds spend their free time",
    "units": "%",
    "rubric": "The pie chart shows how 15-year-olds in one country divided their weekly free time between six activities in 2024.",
    "data": {
      "charts": [
        {
          "title": "Free time, 2024",
          "slices": [
            {
              "name": "Social media",
              "value": 30
            },
            {
              "name": "Gaming",
              "value": 20
            },
            {
              "name": "Streaming video",
              "value": 18
            },
            {
              "name": "Sport",
              "value": 15
            },
            {
              "name": "Other",
              "value": 10
            },
            {
              "name": "Reading",
              "value": 7
            }
          ]
        }
      ]
    },
    "labels": [
      "Social media",
      "Gaming",
      "Streaming video",
      "Sport",
      "Other",
      "Reading"
    ],
    "keyFeatures": [
      "Social media was the largest share, almost a third",
      "Social media and gaming together made up half of all free time",
      "Reading was the smallest share",
      "Screen activities (social media, gaming, streaming) accounted for over two-thirds"
    ],
    "distractorFeatures": [
      "Sport was 15%",
      "Teenagers should read more",
      "Six activities are shown",
      "Gaming was larger than social media"
    ],
    "groupings": [
      [
        "Social media",
        "Gaming",
        "Streaming video"
      ],
      [
        "Sport",
        "Other",
        "Reading"
      ]
    ],
    "tags": [
      "single-pie",
      "static",
      "vw2"
    ]
  });
  P.push({
    "id": "p-vw2-table-cafes",
    "type": "table",
    "mode": "COMPARE",
    "level": "B1",
    "title": "Four cafés in one shopping street",
    "units": "various",
    "rubric": "The table gives information about four cafés on one shopping street in Bangkok in 2024.",
    "data": {
      "cols": [
        "Café",
        "Price of a coffee (baht)",
        "Seats",
        "Customers per day",
        "Customer rating (out of 5)"
      ],
      "rows": [
        [
          "Bean Bar",
          65,
          40,
          320,
          4.1
        ],
        [
          "Riverside Café",
          95,
          60,
          410,
          4.3
        ],
        [
          "Corner Cup",
          55,
          20,
          150,
          4.7
        ],
        [
          "Mall Espresso",
          85,
          80,
          520,
          3.9
        ]
      ]
    },
    "labels": [
      "Bean Bar",
      "Riverside Café",
      "Corner Cup",
      "Mall Espresso"
    ],
    "keyFeatures": [
      "Mall Espresso was the largest and busiest café but had the lowest rating",
      "Corner Cup was the smallest and cheapest yet had the highest rating (the exception)",
      "Riverside Café charged the most for a coffee",
      "More seats generally meant more customers per day"
    ],
    "distractorFeatures": [
      "Bean Bar had 40 seats",
      "Corner Cup is the best café",
      "Four cafés are compared",
      "Riverside Café was the busiest"
    ],
    "groupings": [
      [
        "Mall Espresso",
        "Riverside Café"
      ],
      [
        "Bean Bar",
        "Corner Cup"
      ]
    ],
    "tags": [
      "static",
      "multi-column",
      "exception",
      "vw2"
    ]
  });
  P.push({
    "id": "p-vw2-line-bookshops",
    "type": "line",
    "mode": "TREND",
    "level": "B1",
    "title": "Bookshops and public libraries in one city",
    "units": "number of premises",
    "rubric": "The line graph shows the number of bookshops and the number of public libraries in one city in 2000, 2010 and 2020.",
    "data": {
      "x": [
        2000,
        2010,
        2020
      ],
      "series": [
        {
          "name": "Bookshops",
          "values": [
            120,
            90,
            45
          ]
        },
        {
          "name": "Public libraries",
          "values": [
            30,
            34,
            38
          ]
        }
      ]
    },
    "labels": [
      "Bookshops",
      "Public libraries"
    ],
    "keyFeatures": [
      "Bookshops fell sharply, losing more than half their number",
      "Libraries rose slightly but steadily",
      "Bookshops outnumbered libraries throughout, but the gap narrowed from four to one to almost equal"
    ],
    "distractorFeatures": [
      "There were 34 libraries in 2010",
      "People read less now",
      "Two lines are shown",
      "Libraries fell in 2020"
    ],
    "groupings": [
      [
        "Bookshops"
      ],
      [
        "Public libraries"
      ]
    ],
    "modelId": "m-vw2-line-bookshops",
    "tags": [
      "two-series",
      "converge",
      "vw2",
      "data-dictation"
    ]
  });
})();
