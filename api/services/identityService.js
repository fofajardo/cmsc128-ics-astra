import {
    pbkdf2, randomBytes, timingSafeEqual,
} from "node:crypto";

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

const exports = {
    deriveKeyFromPassword,
    matchesPassword,
};

export default exports;