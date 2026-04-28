import * as auth from './auth.service';
import * as agency from './agency.service';
import * as report from './report.service';
import * as analytics from './analytics.service';
import * as checkin from './checkin.service';
import * as annualCheckin from './annualCheckin.service';
import * as subscription from './subscription.service';
import * as pricing from './pricing.service';

const index = {
    auth,
    agency,
    report,
    analytics,
    checkin,
    annualCheckin,
    subscription,
    pricing,
}

export default index;
