const express = require("express");
const path = require("path");
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "1234") {
    req.session.isAdmin = true;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/index_user.html");
  });
});

router.get("/check-session", (req, res) => {
  res.json({ isAdmin: !!req.session.isAdmin });
});

router.get("/index_admin.html", (req, res) => {
  if (req.session.isAdmin) {
    res.setHeader("Cache-Control", "no-store");
    res.sendFile(path.join(__dirname, "../public/index_admin.html"));
  } else {
    res.redirect("/index_user.html");
  }
});

module.exports = router;
