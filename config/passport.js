const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');
require("dotenv").config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {id: jwt_payload.id}
            });

            if(!user) {
                return done(null, false);
            }

            return done(null, user);
        } catch(error) {
            return done(error, false);
        }
    })
);

module.exports = {passport, prisma};