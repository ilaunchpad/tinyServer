import axios from 'axios'
import { google } from 'googleapis'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import path from 'path'
import { asyncHandler } from '../utils/asyncHandler.js';

function findProjectRoot(startDir) {
  let currentDir = startDir
  while (currentDir !== path.parse(currentDir).root) {
    if (existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir // Project root found
    }
    currentDir = path.dirname(currentDir) // Go up one directory
  }
  throw new Error('Project root not found')
}
const projectRoot = findProjectRoot(process.cwd())
const userDataPath = path.join(projectRoot, 'data/user_data.json')
const encodedKey = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
const keyFilePath = '/tmp/service-account.json'; // Temporary safe location

if (encodedKey) {
  const decodedKey = Buffer.from(encodedKey, 'base64').toString('utf8');
  writeFileSync(keyFilePath, decodedKey);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;
}


const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const user_data = JSON.parse(readFileSync(userDataPath, 'utf-8'))

const credentials = JSON.parse(readFileSync(credentialPath, 'utf8'))

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
]
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
})

const drive = google.drive({ version: 'v3', auth })
//const sheet = google.sheets({ version: 'v3', auth })

export const listFiles = async () => {
  try {
    const res = await drive.files.list({
      q: '',
      fields: 'files(id, name)',
      pageSize: 10,
    })
    console.log(res.data.files)
    return res.data.files
  } catch (error) {
    console.log('Error listing files: ', error)
    throw error
  }
}

export const createFile = async () => {
  try {
    const res = await drive.files.create({
      requestBody: {
        name: 'test.txt',
        mimeType: 'text/plain',
      },
    })
    console.log('file create', res.data.id)
    return res.data.id
  } catch (error) {
    console.log('Error listing files: ', error)
    throw error
  }
}
export const listFilesWithUrls = async () => {
  try {
    const response = await drive.files.list({
      fields: 'files(id, name, webViewLink, webContentLink)',
      pageSize: 10,
    })

    const files = response.data.files.map((file) => ({
      name: file.name,
      viewLink: file.webViewLink, // Link to view in browser
      downloadLink: file.webContentLink, // Direct download link
    }))

    console.log('Files with URLs:', files)
    return files
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getUserArtifactId = (username) => {
  if (username in user_data.user_lookup) {
    const index = user_data.user_lookup[username]
    const profile = user_data.profiles[index]
    const location = profile['location']
    const artifact_id = profile['artifact_id']
    return artifact_id
  } else {
    return null
  }
}
o 
export const getArtifactFromDriveAsWebLink = async (username) => {
  const fileId = getUserArtifactId(username)
  if (!fileId) {
    console.log(`No data found for user: ${username}`)
    return null
  }
  try {
    const response = await drive.files.get({
      fileId: fileId,
      fields: 'id,name,mimeType,size,webViewLink',
    })
    return response.data.webViewLink
  } catch (error) {
    console.error('Error getting file:', error)
  }
}

export const getArtifactFromDriveAsWebPage = async (username) => {
  const fileId = getUserArtifactId(username)
  if (!fileId) {
    console.log(`No data found for user: ${username}`)
    return null
  }
  try {
    const metadata = await drive.files.get({
      fileId: fileId,
      fields: 'mimeType,webViewLink,exportLinks',
    })

    const mimeType = metadata.data.mimeType
    if (!mimeType.startsWith('application/vnd.google-apps.')) {
      throw new Error(`Unsupported file type: ${mimeType}`)
    }

    switch (metadata.data.mimeType) {
      case 'application/vnd.google-apps.document':
        return {
          embedUrl: `https://docs.google.com/document/d/${fileId}/preview`,
          viewUrl: metadata.data.webViewLink,
          exportLinks: metadata.data.exportLinks,
          mimeType: mimeType,
        }
      case 'application/vnd.google-apps.spreadsheet':
        return {
          embedUrl: `https://docs.google.com/spreadsheets/d/${fileId}/preview`,
          viewUrl: metadata.data.webViewLink,
          exportLinks: metadata.data.exportLinks,
          mimeType: mimeType,
        }
      default:
        throw new Error('Unsupported file type')
    }
  } catch (error) {
    console.log('Error: ', error)
    throw error
  }
}

export const getArtifactFromDriveAsHTML = async (username) => {
  const fileId = getUserArtifactId(username)
  if (!fileId) {
    console.log(`Invalid data for username: ${username}`)
    return null
  }
  try {
    const response = await drive.files.export({
      fileId: fileId,
      mimeType: 'text/html',
    })
    return response.data
  } catch (error) {
    console.error('Error getting file:', error)
  }
}

/*function listFiles() {
  return new Promise((resolve, reject) => {
    service.files
      .list({
        q: '',
        fields: 'files(id, name)',
        pageSize: 10,
      })
      .then((res) => resolve(res.data.files))
      .catch((error) => {
        console.error('Error listing files: ', error)
        reject(error)
      })
  })
}

// ... existing code ...

// Add () to call the function, then chain .then()
listFiles()
  .then((files) => console.log('Files:', files))
  .catch((error) => console.error('Error:', error))

*/
