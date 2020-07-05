import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errors } from "celebrate";

const app = express();

app.use(express.json());//server para o request entender que ele é um json
app.use(cors());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(3333);