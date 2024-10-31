import type { AddressInfo } from 'net';
import { createServer } from 'node:http';

import cors from 'cors';
import express from 'express';

let petIdState = 42;
// eslint-disable-next-line no-plusplus
const generateId = () => petIdState++;

const petList = [
  {
    petId: generateId(),
    petName: 'Gosho',
    age: 2,
    notes: 'White fur, very soft.',
    kind: 1,
    healthProblems: false,
    addedDate: '2022-10-31',
  },
  {
    petId: generateId(),
    petName: 'Pesho',
    age: 5,
    notes: undefined,
    kind: 2,
    healthProblems: false,
    addedDate: '2022-10-25',
  },
  {
    petId: generateId(),
    petName: 'Kenny',
    age: 1,
    notes: "Doesn't speak. Has the sniffles.",
    kind: 3,
    healthProblems: true,
    addedDate: '2022-10-27',
  },
];

const petKinds = [
  { displayName: 'Cat', value: 1 },
  { displayName: 'Dog', value: 2 },
  { displayName: 'Parrot', value: 3 },
];

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.get('/pet/kinds', (_req, res) => {
  res.json(petKinds);
});

app.get('/pet/all', (_req, res) => {
  res.json(
    petList.map((pet) => ({
      petId: pet.petId,
      petName: pet.petName,
      addedDate: pet.addedDate,
      kind: pet.kind,
    }))
  );
});

app.get('/pet/:petId', (req, res) => {
  const petId = Number(req.params.petId);
  const pet = petList.find((p) => p.petId === petId);

  if (pet) {
    res.json(pet);
  } else {
    res.sendStatus(404);
  }
});

app.post('/pet', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const pet = {
    ...req.body,
    petId: generateId(),
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  petList.push(pet);

  res.json(pet);
});

app.put('/pet/:petId', (req, res) => {
  const petId = Number(req.params.petId);

  const petIndex = petList.findIndex((pet) => pet.petId === petId);

  if (petIndex === -1) {
    res.sendStatus(404);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const newPet = { ...req.body, petId };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  petList[petIndex] = newPet;

  res.json(newPet);
});

app.delete('/pet/:petId', (req, res) => {
  const petId = Number(req.params.petId);

  const petIndex = petList.findIndex((pet) => pet.petId === petId);

  if (petIndex === -1) {
    res.sendStatus(404);
    return;
  }

  const pet = petList[petIndex];

  petList.splice(petIndex, 1);

  res.json(pet);
});

const server = createServer(app);

server.listen(0, () => {
  const address = server.address() as AddressInfo;
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${address.port}.`);
});
