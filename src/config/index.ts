import dotenv from 'dotenv';
import Joi from 'joi';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
    // This error should crash whole process

    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const envVarsSchema = Joi.object().keys({
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ALGO: Joi.string().required().description('JWT Algo'),
    MONGODB_URI: Joi.string().required().description('Mongo DB uri'),
    PORT: Joi.number().default(3000),
    LOG_LEVEL: Joi.string().required().description('Log level'),
    MAILGUN_API_KEY: Joi.string().required().description('Mail api key'),
});

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

export default {
    /**
     * Your favorite port
     */
    port: parseInt(envVars.PORT, 10),

    /**
     * That long string from mlab
     */
    databaseURL: envVars.MONGODB_URI,

    /**
     * Your secret sauce
     */
    jwtSecret: envVars.JWT_SECRET,
    jwtAlgorithm: envVars.JWT_ALGO,

    /**
     * Used by winston logger
     */
    logs: {
        level: envVars.LOG_LEVEL || 'silly',
    },

    /**
     * Agenda.js stuff
     */
    agenda: {
        dbCollection: envVars.AGENDA_DB_COLLECTION,
        pooltime: envVars.AGENDA_POOL_TIME,
        concurrency: parseInt(envVars.AGENDA_CONCURRENCY, 10),
    },

    /**
     * Agendash config
     */
    agendash: {
        user: 'agendash',
        password: '123456'
    },
    /**
     * API configs
     */
    api: {
        prefix: '/api',
    },
    /**
     * Mailgun email credentials
     */
    emails: {
        apiKey: envVars.MAILGUN_API_KEY,
        domain: envVars.MAILGUN_DOMAIN
    }
};
