const prisma = require('../utils/prisma');

/**
 * Customer Service
 */

const customerService = {
  getAllCustomers: async () => {
    return await prisma.customer.findMany({
      include: {
        dailyBookings: true,
        monthlyContracts: true
      }
    });
  },

  getCustomerById: async (id) => {
    return await prisma.customer.findUnique({
      where: { id },
      include: {
        dailyBookings: true,
        monthlyContracts: true
      }
    });
  },

  createCustomer: async (data) => {
    return await prisma.customer.create({
      data: {
        fullName: data.fullName,
        citizenId: data.citizenId,
        address: data.address,
        phone: data.phone,
        carLicense: data.carLicense,
        customerImage: data.customerImage
      }
    });
  },

  updateCustomer: async (id, data) => {
    // Build update object with only provided fields
    const updateData = {};
    
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.citizenId !== undefined) updateData.citizenId = data.citizenId;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.carLicense !== undefined) updateData.carLicense = data.carLicense;
    if (data.customerImage !== undefined) updateData.customerImage = data.customerImage;

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.customer.update({
      where: { id },
      data: updateData
    });
  },

  deleteCustomer: async (id) => {
    return await prisma.customer.delete({
      where: { id }
    });
  }
};

module.exports = customerService;
