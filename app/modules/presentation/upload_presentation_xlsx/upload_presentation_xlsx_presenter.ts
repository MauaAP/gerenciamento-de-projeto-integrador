import multer from 'multer';
import express, { Request, Response } from "express";
import { authenticateToken } from '../../../shared/middleware/jwt_middleware';
import { PresentationRepository } from '../../../shared/repositories/repository';
import { UploadPresentationXlsxUseCase } from './upload_presentation_xlsx_usecase';
import { UploadPresentationXlsxController } from './upload_presentation_xlsx_controller';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const repository= new PresentationRepository()

const uploadPresentationXlsxUseCase = new UploadPresentationXlsxUseCase(
    repository.presentationRepo, 
    repository.groupRepo, 
    repository.examinationBoardRepo, 
    repository.userRepo, 
    repository.projectRepo, 
    repository.partnerRepo, 
    repository.classroomRepo, 
    repository.courseRepo
);

const uploadPresentationXlsxController = new UploadPresentationXlsxController(uploadPresentationXlsxUseCase);

router.post('/upload-presentation', upload.single('file'), authenticateToken, async (req: Request, res: Response) => {
    await uploadPresentationXlsxController.handler(req, res);
});

export default router;