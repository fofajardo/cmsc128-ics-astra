import {
  pbkdf2, randomBytes, timingSafeEqual,
} from "node:crypto";

import passport from "passport";
import LocalStrategy from "passport-local";

// FIXME: The following function should be part of an identity service.
// START identity service section.
const KEY_ITERATIONS = 310000;
const KEY_LENGTH = 32;
const KEY_DIGEST = "sha256";

function deriveKeyFromPassword(aPassword, aSalt) {
    if (!aSalt) {
        aSalt = randomBytes(16);
    } else if (typeof aSalt === "string") {
        aSalt = Buffer.from(aSalt, "hex");
    }

    return new Promise(function (aResolve, aReject) {
        pbkdf2(
            aPassword,
            aSalt,
            KEY_ITERATIONS,
            KEY_LENGTH,
            KEY_DIGEST,
            function (aError, aKey) {
                if (aError) {
                    aReject(aError);
                    return;
                }
                aResolve({
                    salt: aSalt,
                    key: aKey
                });
            }
        );
    });
}

function matchesPassword(aPassword, aSalt, aPrevKey) {
    if (typeof aSalt === "string") {
        aSalt = Buffer.from(aSalt, "hex");
    }
    if (typeof aPrevKey === "string") {
        aPrevKey = Buffer.from(aPrevKey, "hex");
    }
    return new Promise(function (aResolve, aReject) {
        deriveKeyFromPassword(aPassword, aSalt)
            .then(function (aKeyPair) {
                aResolve(timingSafeEqual(aPrevKey, aKeyPair.key));
            })
            .catch(function (aError) {
                aReject(aError);
            });
    });
}
// END identity service section.


// FIXME: The following function should be part of a user service and
// is shared by the user controller.
// START user service section.
async function getOneUserByEmail(supabase, aEmail) {
    const { data, error } = await supabase
        .from("users")
        .select(
            "id, role, username, email, password, salt, is_enabled, first_name, middle_name, last_name, created_at, deleted_at"
        )
        .eq("email", aEmail)
        .single();

    if (error) {
        return null;
    }

    return data;
}
// END user service section.

const kInvalidUsernameOrEmail = {
    message: "Incorrect username or email"
};

function registerStrategies(supabase) {
    passport.use(new LocalStrategy(async function (aEmail, aPassword, aCallback) {
        let user = null;
        try {
            user = await getOneUserByEmail(supabase, aEmail);
            if (!user) {
                return aCallback(null, false, kInvalidUsernameOrEmail);
            }
            const matched = await matchesPassword(aPassword, user.salt, user.password);
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
            // FIXME: cba rn, requires a working user service.
            // it just doesn't look good if we duplicate user and role
            // queries here. we can't even send a projected user view.
            // just return the user id for now.
            return aCallback(null, aUserId);
        });
    });
}

export { registerStrategies };
