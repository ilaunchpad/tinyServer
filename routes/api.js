import {getArtifactFromDriveAsWebPage, getUserArtifactId} from './../services/requests.js'
import express from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = express.Router();


// Example GET route
router.get('/hello', (req, res) => {
    res.json({ message: 'Hello from API route!' });
});

router.get('/getFileId', (req, res) =>{
	const response = getUserArtifactId('samir')
	if (!response){
		throw new Error(`No file found for username :${username}`)
	}
	res.json({message: `FileId ${response}` })
})


router.get('/getFileAsWeb', asyncHandler(async (req, res) => {
	  const username = req.query.username
	  console.log("this is username param")
	  console.log('username', username)
	  //should validate username here for cases like invalid username
	  if (!username){
			throw new Error('Username query paramter is required')

		}
        const artifact = await getArtifactFromDriveAsWebPage(username);
	      if (!artifact){
					throw new Error('No file available for user: ${username}')
				}
			  res.json({ file: artifact });
}));


// Example POST route
router.post('/data', (req, res) => {
    const { name } = req.body;
    res.json({ message: `Received data for ${name}` });
});

export {router}; // Export the router

