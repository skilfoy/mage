import { PrismaClient } from "@prisma/client";
import { rooms } from "../src/lib/challenge/levels";
const prisma = new PrismaClient();
async function main(){ for(const room of rooms){ await prisma.room.upsert({where:{id:room.id},create:{id:room.id,slug:room.slug,title:room.title,description:room.description,order:room.order},update:{slug:room.slug,title:room.title,description:room.description,order:room.order}}); for(const level of room.levels){ await prisma.level.upsert({where:{id:level.id},create:{id:level.id,slug:level.slug,roomId:room.id,order:level.order,title:level.title,difficulty:level.difficulty,configJson:JSON.stringify(level),isActive:true},update:{slug:level.slug,roomId:room.id,order:level.order,title:level.title,difficulty:level.difficulty,configJson:JSON.stringify(level),isActive:true}}); } } }
main().finally(()=>prisma.$disconnect());
