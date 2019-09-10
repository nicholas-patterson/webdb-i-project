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

router.get("/:id", validateAccountID, (req, res) => {
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

router.post("/", validatePost, (req, res) => {
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

router.put("/:id", validateAccountID, (req, res) => {
  const updatedInfo = req.body;
  db("accounts")
    .where({ id: req.params.id })
    .update(updatedInfo)
    .then(count => {
      if (!count) {
        res.status(400).json({
          error: `Server could not find account with the id:${id} to update`
        });
      } else {
        res.status(200).json({ message: `updated ${count} account(s)` });
      }
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

function validatePost(req, res, next) {
  const name = req.body.name;
  const budget = req.body.budget;
  if (!name) {
    res
      .status(404)
      .json({ error: "You can not post an account without a name field" });
  } else if (!budget) {
    res
      .status(404)
      .json({ error: "You can not post an account without a budget" });
  } else {
    next();
  }
}

function validateAccountID(req, res, next) {
  const id = req.params.id;
  db("accounts")
    .where({ id: id })
    .first()
    .then(account => {
      if (!account) {
        res.status(404).json({ error: "Account with that ID does not exist" });
      } else {
        req.account = account;
        res.status(200).json(account);
      }
    })
    .catch(err => {
      res.status(500).json({ err: "Sever could not validate ID" });
    });
}

module.exports = router;
