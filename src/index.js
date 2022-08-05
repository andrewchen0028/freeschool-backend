const cors = require("cors");
const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(cors());

let nodes = [
  { id: uuidv4(), title: "NSA", color: "#4285F4" },
  { id: uuidv4(), title: "FBI", color: "#4285F4" },
  { id: uuidv4(), title: "CIA", color: "#4285F4" }
];

let links = [
  { id: uuidv4(), source: nodes[0].id, target: nodes[1].id },
  { id: uuidv4(), source: nodes[1].id, target: nodes[2].id }
];

let resources = [
  { id: uuidv4(), node: nodes[0].id, title: "NSA", url: "https://nsa.gov" },
  { id: uuidv4(), node: nodes[1].id, title: "FBI", url: "https://fbi.gov" },
  { id: uuidv4(), node: nodes[2].id, title: "CIA", url: "https://cia.gov" }
];

app.get("/graph", (_request, response) => {
  return response.json({ nodes: nodes, links: links }).status(200).end();
});

app.get("/nodes/:id", (request, response) => {
  return response.json(nodes.filter(
    (node) => node.id === request.params.id
  )).status(200).end();
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

// TODO: Implement
app.get("/nodes/:id/supernodes", (_request, response) => {
  return response.json([]).status(200).end();
})

// TODO: Implement
app.get("/nodes/:id/subnodes", (_request, response) => {
  return response.json([]).status(200).end();
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

app.post("/nodes/:id/resources", (request, response) => {
  // TODO: Error if resource already exists
  const resource = {
    id: uuidv4(),
    nodeId: request.params.id,
    title: request.body.title,
    url: request.body.url
  };

  resources = resources.concat(resource);
  return response.json(resource).status(200).end();

});

app.delete("/nodes/:id", (request, response) => {
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