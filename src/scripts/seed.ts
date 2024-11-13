import { PrismaClient } from '@prisma/client';
// import * as faker from '@faker-js/faker';



const prisma = new PrismaClient();

// const arrayRandom = (array: any[]) => {
//     return array[Math.floor(Math.random() * array.length)];
//     }

// const createUsers = async (numUsers: number) => {
//   for (let i = 0; i < numUsers; i++) {
   
//     await prisma.usuario.create({
//       data: {
//         usuario: faker.fakerES.internet.username(),
//         correo: faker.fakerES.internet.email(),
//         nombre: faker.fakerES.person.firstName(),
//         apell_paterno: faker.fakerES.person.lastName(),
//         apell_materno: faker.fakerES.person.lastName(),
//         contrasena: faker.fakerES.internet.password(),
//         tipo_usuario: arrayRandom(['ADMIN', 'USER']),
//       },
//     });
//   }
// };

const main = async () => {
  //crear 1 usuario admin
  await prisma.usuario.create({
    data: {
      usuario: 'admin',
      correo: 'admin@admin.com',
      nombre: 'admin',
      apell_paterno: 'admin',
      apell_materno: 'admin',
      contrasena: 'admin',
      tipo_usuario: 'ADMIN',
    }
  });

  // await createUsers(20);
  console.log('usuarios creados exitosamente');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
