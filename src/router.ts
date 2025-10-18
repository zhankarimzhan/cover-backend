import { Router, Request, Response } from "express";
import { authController, refreshController, registerController } from "./controllers/user";
import { productCardCommentsGet, productCardGet, productCardPost, productCardPut } from "./controllers/productCard";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("User list");
});


router.post('/register', registerController );

router.post('/auth/login', authController)

router.post('/refresh', refreshController)


router.post('/product-card', productCardPost)
router.put('/product-card', productCardPut)
router.get('/product-card', productCardGet)
router.get('/product-card/comments',productCardCommentsGet)
router.post('/product-card/comments',productCardCommentsGet)

export default router;

