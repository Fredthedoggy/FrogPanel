import React, { useState } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import AccountOverviewContainer from '@/components/dashboard/AccountOverviewContainer';
import NavigationBar from '@/components/NavigationBar';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import AccountApiContainer from '@/components/dashboard/AccountApiContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import { CSSTransition } from 'react-transition-group';
import SidePanel, { Category, Link } from '@/components/SidePanel';
import tw from 'twin.macro';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

export default ({ location }: RouteComponentProps) => {
    const [ panelShown, setPanelShown ] = useState(false);
    return (
        <div>
            <SidePanel panelShown={panelShown} setPanelShown={setPanelShown}>
                {location.pathname.startsWith('/account') &&
                <CSSTransition timeout={150} classNames={'fade'} appear in>
                    <Category name={'ACCOUNT'}>
                        <Link name={'API Credentials'} icon={faProjectDiagram} react link={'/account/api'}/>
                    </Category>
                </CSSTransition>
                }
            </SidePanel>
            <div css={tw`flex-grow flex-shrink md:pl-56`} id={'content-container'}>
                <NavigationBar setPanelShown={setPanelShown}/>
                <TransitionRouter>
                    <Switch location={location}>
                        <Route path={'/'} exact>
                            <DashboardContainer/>
                        </Route>
                        <Route path={'/account'} exact>
                            <AccountOverviewContainer/>
                        </Route>
                        <Route path={'/account/api'} exact>
                            <AccountApiContainer/>
                        </Route>
                        <Route path={'*'}>
                            <NotFound/>
                        </Route>
                    </Switch>
                </TransitionRouter>
            </div>
        </div>
    );
};
