import { TypeOrmModuleOptions, TypeOrmModule } from '@nestjs/typeorm';

const typeDb: any = process.env.TYPEORM_TYPE;
export const typeOrmConfig: TypeOrmModuleOptions = {
    type: typeDb,
    host: process.env.POSTGRES_HOSTNAME,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/../migrations/**/*.{ts,js}'],
    synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE),
};
