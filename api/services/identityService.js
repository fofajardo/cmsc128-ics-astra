import { pbkdf2, randomBytes, timingSafeEqual, } from "node:crypto";
import { AbilityBuilder, createMongoAbility, subject as setSubjectType } from "@casl/ability";
import { Actions, RoleName, Subjects } from "../../common/scopes.js";

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

async function defineScopes(aUser) {
  const { can, cannot, rules } =
        new AbilityBuilder(createMongoAbility);

  let user = aUser?.data;
  let role = user?.role ?? RoleName.UNLINKED;

  if (process.env.ICSA_API_SPECIAL_POWERS === "TRUE") {
    can(Actions.CREATE, Subjects.ALL);
    can(Actions.READ, Subjects.ALL);
    can(Actions.MANAGE, Subjects.ALL);

    return rules;
  }

  if (role !== RoleName.UNLINKED) {
    // General permissions for all roles.
    can(Actions.MANAGE, Subjects.USER, { id: user.id });
    can(Actions.MANAGE, Subjects.ALUMNI_PROFILE, { alum_id: user.id });
    can(Actions.MANAGE, Subjects.CONTACT, { alum_id: user.id });
    can(Actions.CREATE, Subjects.DONATION);
    can(Actions.MANAGE, Subjects.DONATION, { alum_id: user.id });
    can(Actions.READ, Subjects.EVENT);
    can(Actions.CREATE, Subjects.REPORT);
    can(Actions.MANAGE, Subjects.REPORT, { reporter_id: user.id });
    can(Actions.READ, Subjects.CONTENT);

    if (role === RoleName.ALUMNUS) {
      can(Actions.READ, Subjects.EVENT);
      can(Actions.CREATE, Subjects.DONATION);
      can(Actions.MANAGE, Subjects.DONATION, { alum_id: user.id });
      cannot(Actions.MANAGE, Subjects.EVENT);
      can(Actions.MANAGE, Subjects.EVENT_INTEREST, { alum_id: user.id });
      can(Actions.READ, Subjects.ALUMNI_PROFILE, { alum_id: user.id });
      can(Actions.CREATE, Subjects.JOB);
      can(Actions.MANAGE, Subjects.JOB, { alum_id: user.id });
    } else if (role === RoleName.MODERATOR) {
      can(Actions.READ, Subjects.ALL);
      can(Actions.MANAGE, Subjects.CONTENT);
      can(Actions.MANAGE, Subjects.REPORT);
      can(Actions.MANAGE, Subjects.USER);
      can(Actions.MANAGE, Subjects.EVENT);
      can(Actions.MANAGE, Subjects.PROJECT);
      can(Actions.MANAGE, Subjects.JOB);
    } else if (role === RoleName.ADMIN) {
      can(Actions.CREATE, Subjects.ALL);
      can(Actions.READ, Subjects.ALL);
      can(Actions.MANAGE, Subjects.ALL);
    }
  } else {
    // Default permissions for users without a role.
    // Soft-deleted users usually fall under this case.
    cannot(Actions.CREATE, Subjects.ALL);
    cannot(Actions.READ, Subjects.ALL);
    cannot(Actions.MANAGE, Subjects.ALL);
  }

  return rules;
}

async function defineAbility(aUser) {
  const rules = await defineScopes(aUser);
  const ability = createMongoAbility(rules);
  // Set some helper functions to avoid importing the subject helper.
  const abilityHelper = {
    canAs: function (action, subjectName, subject, field) {
      const wrappedSubject = setSubjectType(subjectName, subject);
      return ability.can(action, wrappedSubject, field);
    },
    cannotAs: function (action, subjectName, subject, field) {
      const wrappedSubject = setSubjectType(subjectName, subject);
      return ability.cannot(action, wrappedSubject, field);
    },
  };
  Object.assign(ability, abilityHelper);
  return ability;
}

const exports = {
  deriveKeyFromPassword,
  matchesPassword,
  defineScopes,
  defineAbility,
};

export default exports;