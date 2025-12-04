const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { userUpdateValidation } = require('../utils/validators');

router.use(auth);
router.use(roleCheck('admin'));

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUserById);

router.post('/', userController.createUser);

router.put('/:id', userUpdateValidation, userController.updateUser);

router.delete('/:id', userController.deleteUser);

router.patch('/:id/activate', userController.toggleUserStatus);

module.exports = router;