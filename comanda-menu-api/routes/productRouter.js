const router = require("express").Router();

const ProductController = require("../controllers/productController");

const auth = require("../auth");

router.get("/", auth, ProductController.getAll);
router.get("/:id", auth, ProductController.getById);
router.post("/", auth, ProductController.create);
router.put("/:id", auth, ProductController.updateById);
router.delete("/:id", auth, ProductController.deleteById);

module.exports = router;