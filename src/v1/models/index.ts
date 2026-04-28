/**
 * Importing every model here registers its schema on the default Mongoose
 * connection at startup. Without this, models are only registered when first
 * imported by a route/controller, which means collections + indexes are not
 * materialized in MongoDB until a request hits that path.
 */
import User from './user.model';
import Agency from './agency.model';
import Analytics from './analytics.model';
import MonthlyCheckin from './checkin.model';
import AnnualCheckin from './annualCheckin.model';
import Subscription from './subscription.model';
import Report from './report.model';
import MonthlyData from './monthlyData.model';
import PricingPlan from './pricingPlan.model';

export const Models = {
    User,
    Agency,
    Analytics,
    MonthlyCheckin,
    AnnualCheckin,
    Subscription,
    Report,
    MonthlyData,
    PricingPlan,
};

export default Models;
