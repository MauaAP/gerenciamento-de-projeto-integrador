import { PartnerRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { DeletePartnerUseCase } from "./delete_partner_usecase";
import { DeletePartnerController } from "./delete_partner_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router= express.Router();
const repository= new PartnerRepository();
const deletePartnerUseCase= new DeletePartnerUseCase(repository.partnerRepo);
const deleteUserController= new DeletePartnerController(deletePartnerUseCase);

router.delete("/partner", authenticateToken, async(req: Request, res: Response) => {
    await deleteUserController.handler(req, res);
})

export default router;