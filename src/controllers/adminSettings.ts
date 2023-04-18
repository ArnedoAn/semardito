import { PrismaClient } from "@prisma/client";
import { logError } from "./extraFunctions";
import { constants } from "../constants/constants";

const prisma = constants.prisma;

export async function addUser({
  telegramId,
  firstName,
  lastName,
}: {
  telegramId: number;
  firstName: string;
  lastName: string;
}) {
  try {
    const user = await prisma.user.create({
      data: {
        telegramId,
        firstName,
        lastName,
      },
    });
    console.log("Usuario agregado exitosamente");
    return true;
  } catch (error: Error | any) {
    console.log(error);
    await logError(error);
    return false;
  }
}

export async function verifyUser(userId: number) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        telegramId: userId,
      },
    });
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error: Error | any) {
    console.log(error);
    await logError(error);
    return false;
  }
}
