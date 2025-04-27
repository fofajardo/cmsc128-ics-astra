import {createServerClient, parseCookieHeader, serializeCookieHeader} from "@supabase/ssr";

export function BuildSupabaseClient(aRequest, aResponse, aNext) {
    const handleCookieToSet = function ({name, value, options}) {
        return aResponse?.appendHeader(
            "Set-Cookie",
            serializeCookieHeader(name, value, options)
        );
    };
    const clientOptions = {
        cookies: {
            getAll: function () {
                return parseCookieHeader(aRequest.headers.cookie ?? "")
            },
            setAll: function (aCookiesToSet) {
                aCookiesToSet.forEach(handleCookieToSet);
            },
        },
    };

    aRequest.supabase = createServerClient(
        process.env.DATABASE_URL,
        // process.env.DATABASE_ANONYMOUS_KEY,
        process.env.DATABASE_SERVICE_KEY,
        clientOptions
    );

    return aNext();
}