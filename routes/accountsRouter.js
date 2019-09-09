const express = require("express");

const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", (req, res) => {
  db("accounts")
    .select("*")
    .then(account => {
      res.status(200).json(account);
    })
    .catch(err => {
      res.status(500).json({ error: "Server could not get accounts" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db("accounts")
    .where({ id })
    .first()
    .then(account => {
      if (!account) {
        res
          .status(404)
          .json({ error: `Account with the ID ${id} could not be found` });
      } else {
        res.status(200).json(account);
      }
    })
    .catch(err => {
      res.status(500).json({ err: "Server could not get post" });
    });
});

router.post("/", (req, res) => {
  const newPost = req.body;
  db("accounts")
    .insert(newPost, "id")
    .then(([id]) => {
      db("accounts")
        .where({ id })
        .first()
        .then(account => {
          res.status(200).json(account);
        })
        .catch(err => {
          res.status(500).json({ err: "idk" });
        });
    })
    .catch(err => {
      res.status(500).json({ err: "Server could not post account" });
    });
});

router.put("/:id", (req, res) => {
  const updatedInfo = req.body;
  db("accounts")
    .where({ id: req.params.id })
    .update(updatedInfo)
    .then(count => {
      res.status(200).json({ message: `updated ${count} account(s)` });
    })
    .catch(err => {
      res.status(500).json({ error: "Server Could Not Update Account" });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db("accounts")
    .where({ id })
    .del()
    .then(count => {
      if (!count) {
        res
          .status(400)
          .json({ error: `Could not find account with the ID: ${id}` });
      } else {
        res
          .status(202)
          .json({ message: `Account with the id: ${id} has been deleted` });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Account could not be deleted" });
    });
});

module.exports = router;
