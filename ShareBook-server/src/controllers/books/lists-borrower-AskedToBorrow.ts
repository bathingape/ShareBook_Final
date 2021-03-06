import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Books } from '../../../models/Books';

const jwtSecret = String(process.env.JWT_SECRET);

module.exports = {
  get: (req: Request, res: Response) => {
    const token = req.headers.token;
    // console.log(token);
    const decoded: any = jwt.verify(String(token), jwtSecret);
    // console.log(decoded);
    if (decoded) {
      Books.findAll({
        where: {
          userBorrowerId: decoded.id,
          isRental: '대여 요청',
        },
        attributes: [
          'id',
          'name',
          'publisher',
          'writer',
          'quelity',
          'description',
          'image',
        ],
      })
        .then((data: any) => {
          if (data) {
            res.status(200).json(data);
          }
        })
        .catch((err: any) => {
          console.error(err);
          res.status(404).send(err.message);
        });
    } else {
      res.status(401).send('');
    }
  },
};
