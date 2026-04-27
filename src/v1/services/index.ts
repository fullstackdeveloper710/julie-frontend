import * as auth from './auth.service';
import * as agency from './agency.service';
import * as report from './report.service';
import * as analytics from './analytics.service';
import * as checkin from './checkin.service';
import * as annualCheckin from './annualCheckin.service';
import * as subscription from './subscription.service';

const index = {
    auth,
    agency,
    report,
    analytics,
    checkin,
    annualCheckin,
    subscription,
}

export default index;
