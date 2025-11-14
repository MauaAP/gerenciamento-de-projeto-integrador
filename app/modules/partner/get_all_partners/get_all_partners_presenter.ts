import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import express, { Request, Response } from "express";
import { GetAllPartnersUseCase } from "./get_all_partners_usecase";
import { PartnerRepository } from "../../../shared/repositories/repository";
import { GetAllPartnersController } from "./get_all_partners_controller";

const router= express.Router();
const repository= new PartnerRepository(); 
const getAllPartnersUsecase= new GetAllPartnersUseCase(repository.partnerRepo);
const getAllPartnersController= new GetAllPartnersController(getAllPartnersUsecase);

router.get("/partners", authenticateToken, async (req: Request, res: Response) => {
    await getAllPartnersController.handler(req, res)
});

export default router;