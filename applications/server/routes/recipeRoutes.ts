import Router from "express"
import {
  getRecipeByMenuItemId
} from "@/controllers/recipeControllers"

const router = Router()

router.get("/menu-item/:id", getRecipeByMenuItemId)

export default router