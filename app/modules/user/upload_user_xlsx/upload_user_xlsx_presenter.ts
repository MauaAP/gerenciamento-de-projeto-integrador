import multer from 'multer';
import express, { Request, Response } from "express";
import { authenticateToken } from '../../../shared/middleware/jwt_middleware';
import { UserRepository } from '../../../shared/repositories/repository';
import { UploadUserXlsxController } from './upload_user_xlsx_controller';
import { UploadUserXlsxUseCase } from './upload_user_xlsx_usecase';

// Configure multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
const repository = new UserRepository(); 
const uploadUserXlsxUseCase = new UploadUserXlsxUseCase(repository.userRepo);
const uploadUserXlsxController = new UploadUserXlsxController(uploadUserXlsxUseCase);


router.post('/upload-user', upload.single('file'), authenticateToken, async (req: Request, res: Response) => {
    await uploadUserXlsxController.handler(req, res);
});

export default router;