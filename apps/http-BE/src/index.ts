import express from 'express';
import jwt from 'jsonwebtoken';

import { middleware } from './middleware';
import { CreateUserSchema , SigninSchema , CreateRoonSchema } from '@repo/common/types';
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from '@repo/db/client';


const app = express();

app.post("/signup", async (req, res) => {

 const parseData = CreateUserSchema.safeParse(req.body);
  if(!parseData.success){
    res.json({
      message: "Invalid data"
    })
    return;
  }
  try{
    await prismaClient.user.create({
      data: {
        email: parseData.data?.username,
        password: parseData.data?.password,
        name: parseData.data.name
      }
  
    })
    res.json({
      roomId: "123"
    })
  } catch(e){
    res.status(411).json({
      message: "User already exists with this email"
    })
  }
})

app.post("/signin", (req, res) => {
  const data = SigninSchema.safeParse(req.body);
  if(!data.success){
    res.json({
      message: "Invalid data"
    })
    return;
  }


  const userId = 1;
  const token = jwt.sign({
    userId
  }, JWT_SECRET)
  res.json({
    token
  })
})

app.post("/room", middleware,  (req, res) => {
  const data = CreateRoonSchema.safeParse(req.body);
  if(!data.success){
    res.json({
      message: "Invalid data"
    })
    return;
  }

  res.json({
    roomId: 123
  })
})


app.listen(3001);