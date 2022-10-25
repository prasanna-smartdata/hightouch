import { withDashboard } from "./withDashboard";

export const JourneysFunction = () => {
    return <div>In journeys</div>;
};

export const Journeys = withDashboard(JourneysFunction);
