import express from 'express'
import { formularioLogin } from '../controllers/usuariosController.js'
import { formularioRegister } from '../controllers/usuariosController.js'
import { formularioOlvide_password } from '../controllers/usuariosController.js'
import { Registra } from '../controllers/usuariosController.js'


const router = express.Router()

// Rutas de Autenticacion
router.get('/register',formularioRegister)
router.get('/login',formularioLogin)
router.post('/register',Registra)
router.get('/olvide-password',formularioOlvide_password)

export default router
