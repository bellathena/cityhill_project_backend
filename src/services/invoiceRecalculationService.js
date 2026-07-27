import prisma from '../utils/prisma.js';

export const startOfMonth = (year, month) => new Date(year, month - 1, 1, 0, 0, 0, 0);
export const endOfMonth = (year, month) => new Date(year, month, 0, 23, 59, 59, 999);

/**
 * คำนวณ grandTotal ของ Invoice ที่เกี่ยวข้องกับห้อง/เดือน/ปี ใหม่
 * โดยรวมค่าเช่า (monthlyRentRate) + ค่าไฟ/น้ำทั้งหมดของเดือนนั้น
 */
export const recalculateInvoicesForRoomMonth = async (tx, roomId, month, year) => {
  if (!roomId || !month || !year) return;

  const client = tx || prisma;

  const usages = await client.utilityUsage.findMany({
    where: { roomId, month, year },
    include: { utilityType: true }
  });

  const utilityTotal = usages.reduce((sum, usage) => {
    const rate = Number(usage.utilityType?.ratePerUnit ?? 0);
    const unit = Number(usage.utilityUnit ?? 0);
    return sum + rate * unit;
  }, 0);

  const targetMonthIndex = month - 1;

  const contracts = await client.monthlyContract.findMany({
    where: {
      roomId,
      contractStatus: { not: 'CLOSED' },
      AND: [
        { startDate: { lte: endOfMonth(year, month) } },
        {
          OR: [
            { endDate: null },
            { endDate: { gte: startOfMonth(year, month) } }
          ]
        }
      ]
    },
    include: { invoices: true }
  });

  for (const contract of contracts) {
    const invoicesInMonth = contract.invoices.filter((invoice) => {
      const d = new Date(invoice.invoiceDate);
      return d.getFullYear() === year && d.getMonth() === targetMonthIndex;
    });

    if (invoicesInMonth.length === 0) continue;

    const monthlyRentRate = Number(contract.monthlyRentRate ?? 0);
    const newGrandTotal = parseFloat((monthlyRentRate + utilityTotal).toFixed(2));

    await Promise.all(
      invoicesInMonth.map((invoice) =>
        client.invoice.update({
          where: { id: invoice.id },
          data: { grandTotal: newGrandTotal }
        })
      )
    );
  }
};

/**
 * คำนวณ grandTotal ใหม่สำหรับทุกช่วงเดือน/ปี ที่ใช้ utility type นี้
 * (ใช้ตอนแก้ไข ratePerUnit ของค่าไฟ/น้ำ)
 */
export const recalculateInvoicesForUtilityType = async (tx, uTypeId) => {
  if (!uTypeId) return;

  const client = tx || prisma;

  const usages = await client.utilityUsage.findMany({
    where: { uTypeId },
    select: { roomId: true, month: true, year: true }
  });

  const uniquePeriods = new Map();
  for (const usage of usages) {
    const key = `${usage.roomId}-${usage.year}-${usage.month}`;
    if (!uniquePeriods.has(key)) {
      uniquePeriods.set(key, {
        roomId: usage.roomId,
        month: usage.month,
        year: usage.year
      });
    }
  }

  await Promise.all(
    Array.from(uniquePeriods.values()).map(({ roomId, month, year }) =>
      recalculateInvoicesForRoomMonth(client, roomId, month, year)
    )
  );
};

export default {
  recalculateInvoicesForRoomMonth,
  recalculateInvoicesForUtilityType
};
