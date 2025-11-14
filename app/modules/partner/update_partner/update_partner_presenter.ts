import express, { Request, Response } from "express";
import { UpdatePartnerController } from "./update_partner_controller";
import { UpdatePartnerUseCase } from "./update_partner_usecase";
import { PartnerRepository } from "../../../shared/repositories/repository";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router = express.Router();
const repository = new PartnerRepository(); 
const updatePartnerUsecase = new UpdatePartnerUseCase(repository.partnerRepo);
const updatePartnerController = new UpdatePartnerController(updatePartnerUsecase);

router.put("/partner", authenticateToken, async (req: Request, res: Response) => {
   await updatePartnerController.handler(req, res);
});

export default router;