import React from 'react';
import tw from 'twin.macro';
import Can from '@/components/elements/Can';
import Button from '@/components/elements/Button';
import StopOrKillButton from '@/components/server/StopOrKillButton';
import { PowerAction } from '@/components/server/ServerConsole';
import { ServerContext } from '@/state/server';

const PowerControls = () => {
    const status = ServerContext.useStoreState(state => state.status.value);
    const instance = ServerContext.useStoreState(state => state.socket.instance);

    const sendPowerCommand = (command: PowerAction) => {
        instance && instance.send('set state', command);
    };

    return (
        <div css={tw`shadow-md bg-neutral-700 rounded p-3 flex flex-wrap text-xs justify-center justify-around`}>
            <Can action={'control.start'}>
                <Button
                    size={'xsmall'}
                    color={'green'}
                    isSecondary
                    disabled={status !== 'offline'}
                    css={tw`sm:flex-grow lg:flex-grow-0`}
                    onClick={e => {
                        e.preventDefault();
                        sendPowerCommand('start');
                    }}
                >
                    Start
                </Button>
            </Can>
            <Can action={'control.restart'}>
                <Button
                    size={'xsmall'}
                    isSecondary
                    disabled={!status}
                    css={tw`sm:flex-grow lg:flex-grow-0`}
                    onClick={e => {
                        e.preventDefault();
                        sendPowerCommand('restart');
                    }}
                >
                    Restart
                </Button>
            </Can>
            <Can action={'control.stop'}>
                <StopOrKillButton onPress={action => sendPowerCommand(action)}/>
            </Can>
        </div>
    );
};

export default PowerControls;
