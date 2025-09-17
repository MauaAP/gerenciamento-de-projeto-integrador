import { PartnerRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { CreatePartnerUseCase } from "./create_partner_usecase";
import { CreatePartnerController } from "./create_partner_controller";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";

const router= express.Router();
const repository= new PartnerRepository();
const createPartnerUseCase= new CreatePartnerUseCase(repository.partnerRepo);
const createPartnerController= new CreatePartnerController(createPartnerUseCase);

router.post("/partner", authenticateToken, async (req: Request, res: Response) => {
    await createPartnerController.handler(req, res);
});

export default router;