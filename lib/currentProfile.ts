import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export const currentProfile = async () => {
    const userId = auth().userId

    if (!userId) return null
    const profile = db.profile.findUnique({where: {userId}})
    return profile
}