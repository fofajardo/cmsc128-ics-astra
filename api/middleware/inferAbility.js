import IdentityService from "../services/identityService.js";

async function InferAbility(aRequest, aResponse, aNext) {
    try {
        aRequest.you = await IdentityService.defineAbility(
            aRequest?.user);
        aNext();
    } catch (e) {
        aNext(e);
    }
}

export { InferAbility };