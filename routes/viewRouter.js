import express from "express";
const router = express.Router();
router.get("/signup", (req, res) => {
    res.render("signup"); // views/signup.ejs file show hogi
});

router.get("/login", (req, res) => {
    res.render("login"); // views/login.ejs file show hogi
});
export default router;