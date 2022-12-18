const cors = require("cors");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(cors());

const comment = {
  author: "SatoshiNakamoto",
  timestamp: 1663200075902,
  content: "content",
  score: 0,
  comments: []
};

/** DRINK WATER 25/9/2022 02:49:22 */

let nodes = {
  "Calculus 1": {},
  "Calculus 2": {},
  "Calculus 3": {},
};

let resources = {
  "Calculus 1": {
    "NSASite": { url: "https://nsa.gov", timestamp: 1663200075902, score: 6, author: "satoshi", comments: [comment] },
    "USASite": { url: "https://usa.gov", timestamp: 1663200075902, score: 5, author: "satoshi", comments: [comment] }
  },
  "Calculus 2": {
    "FBISite": { url: "https://fbi.gov", timestamp: 1663200075902, score: 4, author: "satoshi", comments: [comment] },
    "USASite": { url: "https://usa.gov", timestamp: 1663200075902, score: 3, author: "satoshi", comments: [comment] }
  },
  "Calculus 3": {
    "ATFSite": { url: "https://atf.gov", timestamp: 1663200075902, score: 2, author: "satoshi", comments: [comment] },
    "USASite": { url: "https://usa.gov", timestamp: 1663200075902, score: 1, author: "satoshi", comments: [comment] }
  },
};

let links = [
  { id: uuidv4(), source: "Calculus 1", target: "Calculus 2" },
  { id: uuidv4(), source: "Calculus 2", target: "Calculus 3" },
];

app.get("/", (_request, response) => {
  return response.json({
    nodes: Object.entries(nodes).map(([id, { }]) => ({ id })),
    links: links
  }).status(200).end();
});

app.get("/nodes/:id/resources", (request, response) => {
  return response.json(Object.entries(resources[request.params.id]).map(
    ([title, { url, timestamp, score, author, comments }]) => ({ title, url, timestamp, score, author, comments })
  )).status(200).end();
});

app.get("/nodes/:id/inlinks", (request, response) => {
  return response.json(
    links.filter(link => link.target === request.params.id)
  ).status(200).end();
});

app.get("/nodes/:id/outlinks", (request, response) => {
  return response.json(
    links.filter(link => link.source === request.params.id)
  ).status(200).end();
});

app.post("/nodes/:id/resources", (request, _response) => {
  console.log(request);
  const title = resources[request.params.id][request.body.title];
  const url = resources[request.params.id][request.body.url];
  const node = nodes.filter((node) => node.id === request.params.id);
  console.log("title", title);
  console.log("url", url);
  console.log("node", node);
  /** TODO: IMPLEMENT */
  // resources[request.params.id][request.body.title]
  // const node = nodes.filter((node) => node.id === request.params.id);

  // return response.json(

  // )
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});