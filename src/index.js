const cors = require("cors");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(cors());

let nodes = [
  { id: uuidv4(), title: "node0", color: "#4285F4" },
  { id: uuidv4(), title: "node1", color: "#4285F4" },
  { id: uuidv4(), title: "node2", color: "#4285F4" }
];

let links = [
  { id: uuidv4(), source: nodes[0].id, target: nodes[1].id },
  { id: uuidv4(), source: nodes[1].id, target: nodes[2].id }
];

let resources = [
  { id: uuidv4(), nodeId: nodes[0].id, title: "NSA", url: "https://nsa.gov" },
  { id: uuidv4(), nodeId: nodes[1].id, title: "FBI", url: "https://fbi.gov" },
  { id: uuidv4(), nodeId: nodes[2].id, title: "CIA", url: "https://cia.gov" }
];

app.get("/graph", (_request, response) => {
  return response.json({ nodes: nodes, links: links }).status(200).end();
});

app.get("/nodes/:id/resources", (request, response) => {
  return response.json(resources.filter(
    (resource) => resource.nodeId === request.params.id
  )).status(200).end();
});

app.post("/graph/nodes", (request, response) => {
  const newNode = {
    id: uuidv4(),
    title: request.body.title,
    color: "#4285F4"
  };

  if (nodes.some((node) => node.title === newNode.title)) {
    return response.status(400).end();
  }

  nodes = nodes.concat(newNode);
  return response.json(newNode).status(200).end();

});

app.post("/graph/links", (request, response) => {
  const newLink = {
    id: uuidv4(),
    source: request.body.source,
    target: request.body.target
  };

  if (links.some((link) => link === newLink)) {
    return response.status(400).end();
  }

  links = links.concat(newLink);
  return response.json(newLink).status(200).end();

});

app.post("/nodes/:id/resources", (request, response) => {
  const resource = {
    id: uuidv4(),
    nodeId: request.params.id,
    title: request.body.title,
    url: request.body.url
  };

  resources = resources.concat(resource)
  return response.json(resource).status(200).end();

});

app.delete("/graph/nodes/:id", (request, response) => {
  const id = request.params.id;
  nodes = nodes.filter(node => node.id !== id);
  links = links.filter(link => link.source !== id);
  links = links.filter(link => link.target !== id);
  return response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});