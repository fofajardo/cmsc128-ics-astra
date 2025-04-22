import passport from "passport";
import LocalStrategy from "passport-local";
import IdentityService from "../services/identityService.js";
import UsersService from "../services/usersService.js";

const kInvalidUsernameOrEmail = {
    message: "Incorrect username or email"
};

function registerStrategies(supabase) {
    passport.use(new LocalStrategy({}, async function (aEmail, aPassword, aCallback) {
        let user = null;
        try {
            user = await UsersService.fetchUserByEmail(supabase, aEmail);
            if (!user) {
                return aCallback(null, false, kInvalidUsernameOrEmail);
            }
            user = user.data;
            const matched = await IdentityService.matchesPassword(
                aPassword, user.salt, user.password);
            if (matched) {
                return aCallback(null, user);
            }
            return aCallback(null, false, kInvalidUsernameOrEmail);
        } catch (e) {
            return aCallback(e);
        }
    }));

    passport.serializeUser(function (aUser, aCallback) {
        process.nextTick(function () {
            aCallback(null, aUser.id);
        });
    });

    passport.deserializeUser(function (aUserId, aCallback) {
        process.nextTick(async function () {
            const user = await UsersService.fetchUserById(supabase, aUserId);
            return aCallback(null, user);
        });
    });
}

export { registerStrategies };
