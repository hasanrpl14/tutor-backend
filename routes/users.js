var express = require("express");
var router = express.Router();

const userController = require("../controllers/usercontroller");
const authMiddleware = require("../middlewares/auth");

/* GET users listing. */

router.get('/:username', userController.nama);

router.get("/", authMiddleware.auth, userController.read);
router.get("/:id", userController.readById);
router.post("/", userController.signup);
router.patch("/:id", userController.update);
router.delete("/:id", userController.destroy);
router.post("/signin", userController.signin);


module.exports = router;
