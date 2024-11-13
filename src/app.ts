import express from 'express';
import authRoutes from '@modules/auth/routes/auth.routes';
import userRoutes from '@modules/users/routes/user.routes';
import cors from 'cors';
import { PORT } from '@config/env';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
