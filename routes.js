import express from 'express'
import {
  getSongById,
  searchSong,
  getRecs,
  getUserLikes,
  getUserBatches,
  getBatchSongs,
  createUser,
  userLogin,
  addToLikes,
  deleteLike,
  deleteBatch
} from './controller.js'

const router = express.Router()

router.get('/song/:id', getSongById)
router.get('/search', searchSong)
router.get('/:userId/likes', getUserLikes)
router.get('/:userId/batches', getUserBatches)
router.get('/:userId/batches/:batchId', getBatchSongs)
router.post('/:userId/recommendations', getRecs)
router.post('/signup', createUser)
router.post('/login', userLogin)
router.post('/:userId/:songId/like', addToLikes)
router.delete('/:userId/:songId/like', deleteLike)
router.delete('/:userId/batch/:batchId', deleteBatch)

export default router
