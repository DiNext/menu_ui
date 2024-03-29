import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import { ApiResponse } from '../../../src/models/ApiRespnose';

interface NextConnectApiRequest extends NextApiRequest {
  files: Express.Multer.File[];
}
type ResponseData = ApiResponse<string[], string>;

const oneMegabyteInBytes = 1000000;
const outputFolderName = './public/images';

const upload = multer({
  
  storage: multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {cb(null, file.originalname); console.log(1);}
  })
});

const apiRoute = nextConnect({
  onError(error, req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('theFiles'));

apiRoute.post((req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) => {
  const filenames = fs.readdirSync(outputFolderName);
  const images = filenames.map((name) => name);

  res.status(200).json({ data: images });
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  }
};
export default apiRoute;