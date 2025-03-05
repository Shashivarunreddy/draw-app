import express from 'express';
import jwt from 'jsonwebtoken';

import { middleware } from './middleware';
import { CreateUserSchema , SigninSchema , CreateRoonSchema } from '@repo/common/types';
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from '@repo/db/client';


const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {

 const parseData = CreateUserSchema.safeParse(req.body);
  if(!parseData.success){
    res.json({
      message: "Invalid data"
    })
    return;
  }
  try{
   const user =  await prismaClient.user.create({
      data: {
        email: parseData.data?.username,
        password: parseData.data?.password,
        name: parseData.data.name
      }
  
    })
    res.json({
      userId: user.id
    })
  } catch(e){
    res.status(411).json({
      message: "User already exists with this email"
    })
  }
})

app.post("/signin", async (req, res) => {
  const parseData = SigninSchema.safeParse(req.body);
  if(!parseData.success){
    res.json({
      message: "Invalid data"
    })
    return;
  }
  const user = await prismaClient.user.findFirst({
    where: {
      email: parseData.data.username,
      password: parseData.data.password
    }
  })
  if(!user){
    res.status(403).json({
      message: "Invalid credentials"
    })
    return;
  }

  const token = jwt.sign({
    userId: user?.id
  }, JWT_SECRET)
  res.json({
    token
  })
})

app.post("/room", middleware, async  (req, res) => {
  const parseData = CreateRoonSchema.safeParse(req.body);
  if(!parseData.success){
    res.json({
      message: "Invalid data"
    })
    return;
  }
// @ts-ignore
  const userId = req.userId;
  
  try{
    const room = await prismaClient.room.create({
      data:{
        slug: parseData.data.name,
        adminId: userId
      }
    })
    res.json({
      roomId: room.id
    })
  } catch(e){
    res.status(411).json({
      message: "Room already exists with this name"
    })
  }
 
})


app.listen(3001);