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
  { id: uuidv4(), sourceId: nodes[0].id, targetId: nodes[1].id },
  { id: uuidv4(), sourceId: nodes[1].id, targetId: nodes[2].id }
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

app.get("/nodes/:id/inlinks", (request, response) => {
  return response.json(links.filter(
    (link) => link.target === request.params.id
  )).status(200).end();

});

app.get("/nodes/:id/outlinks", (request, response) => {
  return response.json(links.filter(
    (link) => link.sourceId === request.params.id
  )).status(200).end();

});

app.post("/nodes", (request, response) => {
  // Error if node already exists
  if (nodes.some((node) => node.title === request.body.title)) {
    return response.status(400).end();
  }

  const node = {
    id: uuidv4(),
    title: request.body.title,
    color: "#4285F4"
  };

  nodes = nodes.concat(node);
  return response.json(node).status(200).end();

});

app.post("/nodes/:id/resources", (request, response) => {
  // Error if resource already exists
  if (resources
    .filter((resource) => resource.nodeId === request.params.id)
    .some((resource) =>
      resource.title === request.body.title
      || resource.url === request.body.url
    )) {
    return response.status(400).end();
  }

  const resource = {
    id: uuidv4(),
    nodeId: request.params.id,
    title: request.body.title,
    url: request.body.url
  };

  resources = resources.concat(resource)
  return response.json(resource).status(200).end();

});

app.post("/nodes/:id/inlinks", (request, response) => {
  const targetId = request.params.id;
  const sourceTitle = request.body.sourceTitle;
  const sourceNode = nodes.find((node) => node.title === sourceTitle);

  // Error if source node doesn't exist
  if (!sourceNode) { return response.status(400).end(); }

  // Error if link already exists
  if (links.some((link) =>
    link.sourceId === sourceNode.id && link.targetId === targetId
  )) { return response.status(400).end(); }

  const link = { id: uuidv4(), sourceId: sourceNode.id, targetId: targetId };
  links = links.concat(link);
  return response.json(link).status(200).end();

});

app.post("/nodes/:id/outlinks", (request, response) => {
  const sourceId = request.params.id;
  const targetTitle = request.body.targetTitle;
  const targetNode = nodes.find((node) => node.title === targetTitle);

  // Error if target node doesn't exist
  if (!targetNode) { return response.status(400).end(); }

  // Error if link already exists
  if (links.some((link) =>
    link.sourceId === sourceId && link.targetId === targetNode.id
  )) { return response.status(400).end(); }

  const link = { id: uuidv4(), sourceId: sourceId, targetId: targetNode.id };
  links = links.concat(link);
  return response.json(link).status(200).end();
});

app.delete("/nodes/:id", (request, response) => {
  const id = request.params.id;
  nodes = nodes.filter(node => node.id !== id);
  links = links
    .filter(link => link.sourceId !== id)
    .filter(link => link.targetId !== id);
  return response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});