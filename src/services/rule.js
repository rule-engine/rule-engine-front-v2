import {METHOD, request} from "@/utils/request";
import {rule} from "@/services/api";


export async function saveRuleAndBindRuleSet(query) {
    return request(rule.SAVE_RULE_AND_BIND_RULE_SET, METHOD.POST, query)
}
