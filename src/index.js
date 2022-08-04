const cors = require("cors");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(cors());

const nodes = [
  { id: uuidv4(), title: "node0", color: "#4285F4" },
  { id: uuidv4(), title: "node1", color: "#4285F4" },
  { id: uuidv4(), title: "node2", color: "#4285F4" }
];

const links = [
  { id: uuidv4(), source: nodes[0].id, target: nodes[1].id },
  { id: uuidv4(), source: nodes[1].id, target: nodes[2].id }
];

const resources = [
  { id: uuidv4(), nodeId: nodes[0].id, title: "r0", url: "https://nsa.gov" },
  { id: uuidv4(), nodeId: nodes[1].id, title: "r1", url: "https://fbi.gov" },
  { id: uuidv4(), nodeId: nodes[2].id, title: "r2", url: "https://usa.gov" }
];

app.get("/graph", (_request, response) => {
  response.json({ nodes: nodes, links: links }).status(200).end();
});

// TODO: deprecate after separating node page.
app.get("/nodes/:id/resources", (request, response) => {
  response.json(resources[request.params.id]).status(200).end();
});

app.post("/graph/nodes", (request, response) => {
  const newNode = {
    id: uuidv4(),
    title: request.body.title,
    color: "#4285F4"
  };
  if (nodes.some((node) => node.title === newNode.title)) {
    response.status(400).end();
  } else {
    nodes = nodes.concat(newNode);
    response.json(newNode).status(200).end();
  }
});

app.post("/graph/links", (request, response) => {
  const newLink = {
    id: uuidv4(),
    source: request.body.source,
    target: request.body.target
  };
  if (links.some((link) => link === newLink)) {
    response.status(400).end();
  } else {
    links = links.concat(newLink);
    response.json(newLink).status(200).end();
  }
});

app.post("/nodes/:id/resources", (request, response) => {
  const [nodeId, resourceId] = [request.params.id, uuidv4()];
  if (!resources[nodeId]) { resources[nodeId] = []; }
  resources[nodeId] = resources[nodeId].concat({
    id: resourceId,
    title: request.body.title,
    url: request.body.url
  });
  response.json(resources[nodeId][resourceId]).status(200).end();
});

app.delete("/graph/nodes/:id", (request, response) => {
  const id = request.params.id;
  nodes = nodes.filter(node => node.id !== id);
  links = links.filter(link => link.source !== id);
  links = links.filter(link => link.target !== id);
  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});