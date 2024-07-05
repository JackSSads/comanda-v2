const router = require("express").Router();

const CheckController = require("../controllers/checkController");

const auth = require("../auth");

router.get("/", /* auth, */ CheckController.getAll);
router.get("/:id", auth, CheckController.getById);
router.post("/", auth, CheckController.create);
router.put("/:id", auth, CheckController.updateById);
router.delete("/", auth, CheckController.deleteAll);
router.delete("/:id", auth, CheckController.deleteById);

module.exports = router;