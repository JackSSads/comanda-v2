const router = require("express").Router();

const CashierController = require("../controllers/cashierController");

const auth = require("../auth");

router.get("/", auth, CashierController.getAll);
router.get("/:id", auth, CashierController.getById);
router.post("/", auth, CashierController.create);
router.put("/:id", auth, CashierController.updateById);
router.delete("/:id", auth, CashierController.deleteById);

module.exports = router;