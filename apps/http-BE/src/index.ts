import express from 'express';
import jwt from 'jsonwebtoken';

import { middleware } from './middleware';
import { CreateUserSchema , SigninSchema , CreateRoonSchema } from '@repo/common/types';
import { JWT_SECRET } from '@repo/backend-common/config';

const app = express();

app.post("/signup", (req, res) => {

 const data = CreateUserSchema.safeParse(req.body);
  if(!data.success){
    res.json({
      message: "Invalid data"
    })
    return;
  }
  res.json({
    roomId: "123"
  })
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