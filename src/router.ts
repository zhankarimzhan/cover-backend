import { Router, Request, Response } from "express";
import { authController, refreshController, registerController } from "./controllers/user";
import { productCardCommentsGet, productCardCommentsPost, productCardGet, productCardPost, productCardPut, productTypePost } from "./controllers/productCard";
import { filePost, objectFileGet } from "./controllers/file";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("User list");
});


router.post('/register', registerController );

router.post('/auth/login', authController)

router.post('/refresh', refreshController)

router.post('/product-type',productTypePost)
router.post('/product-card', productCardPost)
router.put('/product-card/:id', productCardPut)
router.get('/product-card', productCardGet)

router.get('/product-card/comments/:id',productCardCommentsGet)
router.post('/product-card/comments/:id',productCardCommentsPost)


router.post('/file/:id', filePost)
router.get('/file/:id',objectFileGet)



export default router;

