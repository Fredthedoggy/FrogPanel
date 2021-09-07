import TransferListener from '@/components/server/TransferListener';
import React, { useEffect, useState } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import ServerConsole from '@/components/server/ServerConsole';
import TransitionRouter from '@/TransitionRouter';
import WebsocketHandler from '@/components/server/WebsocketHandler';
import { ServerContext } from '@/state/server';
import DatabasesContainer from '@/components/server/databases/DatabasesContainer';
import FileManagerContainer from '@/components/server/files/FileManagerContainer';
import { CSSTransition } from 'react-transition-group';
import FileEditContainer from '@/components/server/files/FileEditContainer';
import SettingsContainer from '@/components/server/settings/SettingsContainer';
import ScheduleContainer from '@/components/server/schedules/ScheduleContainer';
import ScheduleEditContainer from '@/components/server/schedules/ScheduleEditContainer';
import UsersContainer from '@/components/server/users/UsersContainer';
import Can from '@/components/elements/Can';
import BackupContainer from '@/components/server/backups/BackupContainer';
import Spinner from '@/components/elements/Spinner';
import ScreenBlock, { NotFound, ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';
import NetworkContainer from '@/components/server/network/NetworkContainer';
import InstallListener from '@/components/server/InstallListener';
import StartupContainer from '@/components/server/startup/StartupContainer';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import {
    faClock, faCloudDownloadAlt,
    faCogs, faDatabase,
    faExternalLinkAlt,
    faFileAlt,
    faNetworkWired, faPlay,
    faTerminal,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import RequireServerPermission from '@/hoc/RequireServerPermission';
import ServerInstallSvg from '@/assets/images/server_installing.svg';
import ServerRestoreSvg from '@/assets/images/server_restore.svg';
import ServerErrorSvg from '@/assets/images/server_error.svg';
import tw from 'twin.macro';
import SidePanel, { Category, Link } from '@/components/SidePanel';

const ConflictStateRenderer = () => {
    const status = ServerContext.useStoreState(state => state.server.data?.status || null);
    const isTransferring = ServerContext.useStoreState(state => state.server.data?.isTransferring || false);

    return (
        status === 'installing' || status === 'install_failed' ?
            <ScreenBlock
                title={'Running Installer'}
                image={ServerInstallSvg}
                message={'Your server should be ready soon, please try again in a few minutes.'}
            />
            :
            status === 'suspended' ?
                <ScreenBlock
                    title={'Server Suspended'}
                    image={ServerErrorSvg}
                    message={'This server is suspended and cannot be accessed.'}
                />
                :
                <ScreenBlock
                    title={isTransferring ? 'Transferring' : 'Restoring from Backup'}
                    image={ServerRestoreSvg}
                    message={isTransferring ? 'Your server is being transfered to a new node, please check back later.' : 'Your server is currently being restored from a backup, please check back in a few minutes.'}
                />
    );
};

const ServerRouter = ({ match, location }: RouteComponentProps<{ id: string }>) => {
    const rootAdmin = useStoreState(state => state.user.data!.rootAdmin);
    const [ error, setError ] = useState('');

    const id = ServerContext.useStoreState(state => state.server.data?.id);
    const uuid = ServerContext.useStoreState(state => state.server.data?.uuid);
    const inConflictState = ServerContext.useStoreState(state => state.server.inConflictState);
    const serverId = ServerContext.useStoreState(state => state.server.data?.internalId);
    const getServer = ServerContext.useStoreActions(actions => actions.server.getServer);
    const clearServerState = ServerContext.useStoreActions(actions => actions.clearServerState);

    useEffect(() => () => {
        clearServerState();
    }, []);

    useEffect(() => {
        setError('');

        getServer(match.params.id)
            .catch(error => {
                console.error(error);
                setError(httpErrorToHuman(error));
            });

        return () => {
            clearServerState();
        };
    }, [ match.params.id ]);

    const [ panelShown, setPanelShown ] = useState(false);

    return (
        <React.Fragment key={'server-router'}>
            <div>
                <SidePanel panelShown={panelShown} setPanelShown={setPanelShown}>
                    <CSSTransition timeout={150} classNames={'fade'} appear in>
                        <Category name={'SERVER'}>
                            <Link name={'Console'} icon={faTerminal} react link={`${match.url}`} exact/>
                            <Can action={'file.*'}>
                                <Link name={'File Manager'} icon={faFileAlt} react link={`${match.url}/files`}/>
                            </Can>
                            <Can action={'database.*'}>
                                <Link name={'Databases'} icon={faDatabase} react link={`${match.url}/databases`}/>
                            </Can>
                            <Can action={'schedule.*'}>
                                <Link name={'Schedules'} icon={faClock} react link={`${match.url}/schedules`}/>
                            </Can>
                            <Can action={'user.*'}>
                                <Link name={'Users'} icon={faUsers} react link={`${match.url}/users`}/>
                            </Can>
                            <Can action={'backup.*'}>
                                <Link name={'Backups'} icon={faCloudDownloadAlt} react link={`${match.url}/backups`}/>
                            </Can>
                            <Can action={'allocation.*'}>
                                <Link name={'Network'} icon={faNetworkWired} react link={`${match.url}/network`}/>
                            </Can>
                            <Can action={'startup.*'}>
                                <Link name={'Startup'} icon={faPlay} react link={`${match.url}/startup`}/>
                            </Can>
                            <Can action={[ 'settings.*', 'file.sftp' ]} matchAny>
                                <Link name={'Settings'} icon={faCogs} react link={`${match.url}/settings`}/>
                            </Can>
                            {rootAdmin &&
                            <Link name={'Edit Server'} icon={faExternalLinkAlt}
                                link={'/admin/servers/view/' + serverId}
                            />
                            }
                        </Category>
                    </CSSTransition>
                </SidePanel>
                <div css={tw`flex-shrink flex-grow md:pl-56`} id={'content-container'}>
                    <NavigationBar setPanelShown={setPanelShown}/>
                    {(!uuid || !id) ?
                        error ?
                            <ServerError message={error}/>
                            :
                            <Spinner size={'large'} centered/>
                        :
                        <>
                            <InstallListener/>
                            <TransferListener/>
                            <WebsocketHandler/>
                            {(inConflictState && (!rootAdmin || (rootAdmin && !location.pathname.endsWith(`/server/${id}`)))) ?
                                <ConflictStateRenderer/>
                                :
                                <ErrorBoundary>
                                    <TransitionRouter>
                                        <Switch location={location}>
                                            <Route path={`${match.path}`} component={ServerConsole} exact/>
                                            <Route path={`${match.path}/files`} exact>
                                                <RequireServerPermission permissions={'file.*'}>
                                                    <FileManagerContainer/>
                                                </RequireServerPermission>
                                            </Route>
                                            <Route path={`${match.path}/files/:action(edit|new)`} exact>
                                                <Spinner.Suspense>
                                                    <FileEditContainer/>
                                                </Spinner.Suspense>
                                            </Route>
                                            <Route path={`${match.path}/databases`} exact>
                                                <RequireServerPermission permissions={'database.*'}>
                                                    <DatabasesContainer/>
                                                </RequireServerPermission>
                                            </Route>
                                            <Route path={`${match.path}/schedules`} exact>
                                                <RequireServerPermission permissions={'schedule.*'}>
                                                    <ScheduleContainer/>
                                                </RequireServerPermission>
                                            </Route>
                                            <Route path={`${match.path}/schedules/:id`} exact>
                                                <ScheduleEditContainer/>
                                            </Route>
                                            <Route path={`${match.path}/users`} exact>
                                                <RequireServerPermission permissions={'user.*'}>
                                                    <UsersContainer/>
                                                </RequireServerPermission>
                                            </Route>
                                            <Route path={`${match.path}/backups`} exact>
                                                <RequireServerPermission permissions={'backup.*'}>
                                                    <BackupContainer/>
                                                </RequireServerPermission>
                                            </Route>
                                            <Route path={`${match.path}/network`} exact>
                                                <RequireServerPermission permissions={'allocation.*'}>
                                                    <NetworkContainer/>
                                                </RequireServerPermission>
                                            </Route>
                                            <Route path={`${match.path}/startup`} component={StartupContainer} exact/>
                                            <Route path={`${match.path}/settings`} component={SettingsContainer} exact/>
                                            <Route path={'*'} component={NotFound}/>
                                        </Switch>
                                    </TransitionRouter>
                                </ErrorBoundary>
                            }
                        </>
                    }
                </div>
            </div>
        </React.Fragment>
    );
};

export default (props: RouteComponentProps<any>) => (
    <ServerContext.Provider>
        <ServerRouter {...props}/>
    </ServerContext.Provider>
);
