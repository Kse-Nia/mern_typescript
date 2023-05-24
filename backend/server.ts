require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(cors());

// Vous pouvez utiliser Prisma dans vos routes comme ceci :
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

/* app.post("/users", async (req, res) => {
  const newUser = await prisma.user.create({
    data: req.body,
  });
  res.json(newUser);
}); */

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

process.on("SIGTERM", async () => {
  console.info("SIGTERM signal received.");
  console.log("Closing http server.");

  server.close(async () => {
    console.log("Http server closed.");
    await prisma.$disconnect();
    process.exit(0);
  });
});

process.on("warning", (e) => console.warn(e.stack));
