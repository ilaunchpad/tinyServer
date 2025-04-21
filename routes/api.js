import {getArtifactFromDriveAsWebPage, getUserArtifactId} from './../services/requests.js'
import express from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = express.Router();

console.log('response', response)

// Example GET route
router.get('/hello', (req, res) => {
    res.json({ message: 'Hello from API route!' });
});

router.get('/getFileId', asyncHandler(req, res) =>{
	const response = getUserArtifactId('samir')
	res.json({message: `FileId ${response}` })
})


router.get('/getFileAsWeb', asyncHandler(async (req, res) => {
	  const username = req.param.username
	  //should validate username here for cases like invalid username
	  if (!username){
			throw new Error('Username query paramter is required')

		}
        const artifact = await getArtifactFromDriveAsWebPage(username);
	      if (!artifact){
					throw new Error('No file available for user: ${username}')
				}
			  console.log('response ' , response)
			  res.json({ file: response });
}));


// Example POST route
router.post('/data', (req, res) => {
    const { name } = req.body;
    res.json({ message: `Received data for ${name}` });
});

export {router}; // Export the router

