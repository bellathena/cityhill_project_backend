const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');

/**
 * User Service
 */

const userService = {
  getAllUsers: async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        phone: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  getUserById: async (id) => {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        phone: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  getUserByUsername: async (username) => {
    return await prisma.user.findUnique({
      where: { username }
    });
  },

  createUser: async (data) => {
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    return await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        fullName: data.fullName,
        role: data.role || 'STAFF',
        phone: data.phone,
        email: data.email
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        phone: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  updateUser: async (id, data) => {
    // Build update object with only provided fields
    const updateData = {};
    
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;

    // Hash password if provided
    if (data.password !== undefined) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(data.password, saltRounds);
    }

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        phone: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  deleteUser: async (id) => {
    return await prisma.user.delete({
      where: { id }
    });
  }
};

module.exports = userService;
