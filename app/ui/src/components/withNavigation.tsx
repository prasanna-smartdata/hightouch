import { NavigationContext, NavigationProvider } from "./NavigationContext";

const withNavigation = (Child: any) => (props: any) =>
(
    <NavigationContext.Consumer>
        {(context) => <Child {...props} {...context} />}
    </NavigationContext.Consumer>
);

export { NavigationProvider, withNavigation };
