import { read } from "fs";

const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// ################### INICIALIZAÇÃO ###################

type UserType = {
  id: number;
  name: string;
  vip: boolean;
};

let listUsers: UserType[] = [
  {
    id: 1,
    name: "Angelito",
    vip: false,
  },
  {
    id: 2,
    name: "Fernando",
    vip: false,
  },
];

let idCount = listUsers.length;

// ################### ROTAS/ENDPOINT/URL ###################

// GET: OBTER LISTA DE REGISTROS
app.get("/users", (req: any, res: any) => {
  res.send(listUsers);
});

// GET: OBTER REGISTRO UNICO
app.get("/users/:id", (req: any, res: any) => {
  const id: number = req.params.id;
  res.send(listUsers.find((it) => it.id == id));
});

// POST: CRIAR NOVO REGISTRO
app.post("/users", (req: any, res: any) => {
  let newUser: UserType = {
    id: ++idCount,
    name: req.body.name,
    vip: false,
  };
  if (listUsers.find((it) => it.name == newUser.name)) {
    res.send({ status: "usuário já existe" });
    return;
  }

  listUsers.push(newUser);
  res.send({ status: "usuário criado", newUser });
});

// PUT: ATUALIZAR REGISTRO EXISTENTE
app.put("/users/:id", (req: any, res: any) => {
  let userToUpdate: UserType = {
    id: req.params.id,
    name: req.body.name,
    vip: false,
  };
  // Opção 1
  listUsers = listUsers.map((user) =>
    user.id == userToUpdate.id ? { ...userToUpdate, vip: user.vip } : user
  );

  //// Opção 2
  // list_users = list_users.map((user) => {
  //   return user.id == userToUpdate.id ? userToUpdate : user;
  // });

  //// Opção 3
  // list_users = list_users.map((user) => {
  //   if (user.id == userToUpdate.id) return userToUpdate;
  //   else return user;
  // });

  res.send({ status: "usuário atualizado", userToUpdate });
});

// PATCH: ATUALIZAR PARTE DE UM REGISTRO EXISTENTE
app.patch("/users/:id/promote-to-vip", (req: any, res: any) => {
  const id: number = Number(req.params.id);

  listUsers = listUsers.map((user) =>
    user.id == id ? { ...user, vip: true } : user
  );

  res.send({ status: "usuário promovido a VIP" });
});

// PATCH: ATUALIZAR PARTE DE UM REGISTRO EXISTENTE
app.patch("/users/:id/remove-from-vip", (req: any, res: any) => {
  const id: number = Number(req.params.id);

  listUsers = listUsers.map((user) =>
    user.id == id ? { ...user, vip: false } : user
  );

  res.send({ status: "usuário removido do VIP" });
});

// DELETE: EXCLUIR REGISTRO EXISTENTE
app.delete("/users/:id", (req: any, res: any) => {
  const id: number = Number(req.params.id);

  if (!listUsers.find((it) => it.id == id)) {
    res.send({ status: "usuário não existe" });
    return;
  }

  listUsers = listUsers.filter((it) => it.id !== id);
  res.send({ status: "usuário apagado" });
});

// ################### INICIA SERVIDOR EXPRESS ###################

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
