import React, { memo, useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import { PowerAction } from '@/components/server/ServerConsole';
import Button from '@/components/elements/Button';
import isEqual from 'react-fast-compare';
import tw from 'twin.macro';

const StopOrKillButton = ({ onPress }: { onPress: (action: PowerAction) => void }) => {
    const [ clicked, setClicked ] = useState(false);
    const status = ServerContext.useStoreState(state => state.status.value);

    useEffect(() => {
        setClicked(status === 'stopping');
    }, [ status ]);

    return (
        <Button
            color={'red'}
            size={'xsmall'}
            disabled={!status || status === 'offline'}
            css={tw`sm:flex-grow lg:flex-grow-0`}
            onClick={e => {
                e.preventDefault();
                onPress(clicked ? 'kill' : 'stop');
                setClicked(true);
            }}
        >
            {clicked ? 'Kill' : 'Stop'}
        </Button>
    );
};

export default memo(StopOrKillButton, isEqual);
