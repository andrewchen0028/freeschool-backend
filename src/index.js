const cors = require("cors");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(cors());

let nodes = {
  NSANode: { color: "#4285F4", comments: [] },
  FBINode: { color: "#4285F4", comments: [] },
  ATFNode: { color: "#4285F4", comments: [] },
}

// TODO: Change to kv store.
let links = [
  { id: uuidv4(), source: "NSANode", target: "FBINode" },
  { id: uuidv4(), source: "FBINode", target: "ATFNode" }
];

// TODO #2: Change resources to title-keyed kv store.
let resources = [
  { id: uuidv4(), node: "NSANode", title: "NSA site", url: "https://nsa.gov" },
  { id: uuidv4(), node: "FBINode", title: "FBI site", url: "https://fbi.gov" },
  { id: uuidv4(), node: "ATFNode", title: "ATF site", url: "https://atf.gov" }
];

app.get("/graph", (_request, response) => {
  return response.json({
    nodes: Object.entries(nodes).map(([id, { color }]) => ({ id, color })),
    links: links
  }).status(200).end();
});

app.get("/nodes/:id", (request, response) => {
  const id = request.params.id;
  return response.json(Object.assign({ id: id }, nodes[id])).status(200).end();
});

app.get("/nodes/:id/resources", (request, response) => {
  return response.json(resources.filter(
    (resource) => resource.node === request.params.id
  )).status(200).end();
});

app.get("/nodes/:id/inlinks", (request, response) => {
  return response.json(links.filter(
    (link) => link.target === request.params.id
  )).status(200).end();
})

app.get("/nodes/:id/outlinks", (request, response) => {
  return response.json(links.filter(
    (link) => link.source === request.params.id
  )).status(200).end();
})

// app.post("/nodes", (request, response) => {
//   // Error if node already exists
//   if (nodes.some((node) => node.title === request.body.title)) {
//     return response.status(400).end();
//   }

//   const node = {
//     id: uuidv4(),
//     title: request.body.title,
//     color: "#4285F4"
//   };

//   nodes = nodes.concat(node);
//   return response.json(node).status(200).end();

// });

// // TODO: Replace with POST requests for inlinks and outlinks
// app.post("/graph/links", (request, response) => {
//   const newLink = {
//     id: uuidv4(),
//     source: request.body.source,
//     target: request.body.target
//   };

//   // Error if link already exists (BROKEN; id will always be different)
//   if (links.some((link) => link === newLink)) {
//     return response.status(400).end();
//   }

//   links = links.concat(newLink);
//   return response.json(newLink).status(200).end();

// });

// app.post("/nodes/:id/resources", (request, response) => {
//   // TODO: Error if resource already exists
//   const resource = {
//     id: uuidv4(),
//     nodeId: request.params.id,
//     title: request.body.title,
//     url: request.body.url
//   };

//   resources = resources.concat(resource);
//   return response.json(resource).status(200).end();

// });

app.delete("/nodes/:id", (request, response) => {
  delete nodes[request.params.id];
  links = links.filter(link => link.source !== request.params.id);
  links = links.filter(link => link.target !== request.params.id);
  return response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});