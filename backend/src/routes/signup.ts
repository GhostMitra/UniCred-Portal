import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Signup route
router.post('/signup', async (req, res) => {
  console.log('Request body:', req.body); // Log the request body
  const { username, email, password, accessType } = req.body;

  // Validate request body
  if (!username || !email || !password || !accessType) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: password, // Note: Hash the password in production
        accessType,
      },
    });

    console.log('New user created:', newUser); // Log the created user
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;