import {getArtifactFromDriveAsWebPage, getUserArtifactId} from './../services/requests.js'
import express from 'express'

const router = express.Router();

const response = getUserArtifactId('samir')
console.log('response', response)

// Example GET route
router.get('/hello', (req, res) => {
    res.json({ message: 'Hello from API route!' });
});

router.get('/getFileId', (req, res) =>{
	const response = getUserArtifactId('samir')
	res.json({message: `FileId ${response}` })
})


router.get('/getFileAsWeb', async (req, res) => {
    try {
        const response = await getArtifactFromDriveAsWebPage('samir');
			  console.log('response ' , response)
			  res.json({ file: response });
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ error: 'Failed to fetch file' });
    }
});


// Example POST route
router.post('/data', (req, res) => {
    const { name } = req.body;
    res.json({ message: `Received data for ${name}` });
});

export {router}; // Export the router

