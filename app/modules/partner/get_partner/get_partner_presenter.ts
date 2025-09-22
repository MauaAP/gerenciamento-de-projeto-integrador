import { PartnerRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetPartnerUseCase } from "./get_partner_usecase";
import { GetPartnerController } from "./get_partner_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router= express.Router();
const repository= new PartnerRepository(); 
const getPartnerUsecase= new GetPartnerUseCase(repository.partnerRepo);
const getPartnerController= new GetPartnerController(getPartnerUsecase);

router.get("/partner", authenticateToken, async (req: Request, res: Response) => {
  await getPartnerController.handler(req, res);
});

export default router;